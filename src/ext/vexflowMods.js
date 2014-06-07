define(['vexflow'], function(Vex) {    
    // A helper function to automatically build basic beams for a voice. For more
    // complex auto-beaming use `Beam.generateBeams()`.
    // 
    // Parameters:
    // * `voice` - The voice to generate the beams for
    // * `stem_direction` - A stem direction to apply to the entire voice
    // * `groups` - An array of `Fraction` representing beat groupings for the beam    
    Vex.Flow.Beam.generateBeams = function(notes, config) {
        // replaces Vex.Flow.Beam's generateBeams function;
        if (!config) config = {};

        if (!config.groups || !config.groups.length) {
          config.groups = [new Vex.Flow.Fraction(2, 8)];
        }

        // Convert beam groups to tick amounts
        var tickGroups = config.groups.map(function(group) {
          if (!group.multiply) {
            throw new Vex.RuntimeError("InvalidBeamGroups",
              "The beam groups must be an array of Vex.Flow.Fractions");
          }
          return group.clone().multiply(Vex.Flow.RESOLUTION, 1);
        });

        var unprocessedNotes = notes;
        var currentTickGroup = 0;
        var noteGroups       = [];
        var currentGroup     = [];

        function getTotalTicks(vf_notes){
          return vf_notes.reduce(function(memo,note){
            return note.getTicks().clone().add(memo);
          }, new Vex.Flow.Fraction(0, 1));
        }

        function nextTickGroup() {
          if (tickGroups.length - 1 > currentTickGroup) {
            currentTickGroup += 1;
          } else {
            currentTickGroup = 0;
          }
        }

        function createGroups(){
          var nextGroup = [];

          unprocessedNotes.forEach(function(unprocessedNote){
            nextGroup    = [];
            if (unprocessedNote.shouldIgnoreTicks()) {
              noteGroups.push(currentGroup);
              currentGroup = nextGroup;
              return; // Ignore untickables (like bar notes)
            }

            currentGroup.push(unprocessedNote);
            var ticksPerGroup = tickGroups[currentTickGroup].value();
            var totalTicks = getTotalTicks(currentGroup).value();

            // Double the amount of ticks in a group, if it's an unbeamable tuplet
            if (parseInt(unprocessedNote.duration, 10) < 8 && unprocessedNote.tuplet) {
              ticksPerGroup *= 2;
            }

            // If the note that was just added overflows the group tick total
            if (totalTicks > ticksPerGroup) {
              nextGroup.push(currentGroup.pop());
              noteGroups.push(currentGroup);
              currentGroup = nextGroup;
              nextTickGroup();
            } else if (totalTicks == ticksPerGroup) {
              noteGroups.push(currentGroup);
              currentGroup = nextGroup;
              nextTickGroup();
            }
          });

          // Adds any remainder notes
          if (currentGroup.length > 0)
            noteGroups.push(currentGroup);
        }

        function getBeamGroups() {
          return noteGroups.filter(function(group){
              if (group.length > 1) {
                var beamable = true;
                group.forEach(function(note) {
                  if (note.getIntrinsicTicks() >= Vex.Flow.durationToTicks("4")) {
                    beamable = false;
                  }
                });
                return beamable;
              }
              return false;
          });
        }

        // Splits up groups by Rest
        function sanitizeGroups() {
          var sanitizedGroups = [];
          noteGroups.forEach(function(group) {
            var tempGroup = [];
            group.forEach(function(note, index, group) {
              var isFirstOrLast = index === 0 || index === group.length - 1;

              var breaksOnEachRest = !config.beam_rests && note.isRest();
              var breaksOnFirstOrLastRest = (config.beam_rests &&
                config.beam_middle_only && note.isRest() && isFirstOrLast);

              var shouldBreak = breaksOnEachRest || breaksOnFirstOrLastRest;

              if (shouldBreak) {
                if (tempGroup.length > 0) {
                  sanitizedGroups.push(tempGroup);
                }
                tempGroup = [];
              } else {
                tempGroup.push(note);
              }
            });

            if (tempGroup.length > 0) {
              sanitizedGroups.push(tempGroup);
            }
          });

          noteGroups = sanitizedGroups;
        }

        function formatStems() {
            // replaced noteGroups with getBeamGroups();
          getBeamGroups().forEach(function(group){
            var stemDirection = determineStemDirection(group);
            applyStemDirection(group, stemDirection);
          });
        }

        function determineStemDirection(group) {
          if (config.stem_direction) return config.stem_direction;

          var lineSum = 0;
          group.forEach(function(note) {
            if (note.keyProps) {
              note.keyProps.forEach(function(keyProp){
                lineSum += (keyProp.line - 2.5);
              });
            }
          });

          if (lineSum > 0)
            return -1;
          return 1;
        }

        function applyStemDirection(group, direction) {
          group.forEach(function(note){
            if (note.hasStem()) note.setStemDirection(direction);
          });
        }

        function getTupletGroups() {
          return noteGroups.filter(function(group){
            if (group[0]) return group[0].tuplet;
          });
        }


        // Using closures to store the variables throughout the various functions
        // IMO Keeps it this process lot cleaner - but not super consistent with
        // the rest of the API's style - Silverwolf90 (Cyril)
        createGroups();
        sanitizeGroups();
        formatStems();

        // Get the notes to be beamed
        var beamedNoteGroups = getBeamGroups();

        // Get the tuplets in order to format them accurately
        var tupletGroups = getTupletGroups();

        // Create a Vex.Flow.Beam from each group of notes to be beamed
        var beams = [];
        beamedNoteGroups.forEach(function(group){
          var beam = new Vex.Flow.Beam(group);

          if (config.show_stemlets) {
            beam.render_options.show_stemlets = true;
          }

          beams.push(beam);
        });

        // Reformat tuplets
        tupletGroups.forEach(function(group){
          var firstNote = group[0];
          for (var i=0; i<group.length; ++i) {
            if (group[i].hasStem()) {
              firstNote = group[i];
              break;
            }
          }

          var tuplet = firstNote.tuplet;

          if (firstNote.beam) tuplet.setBracketed(false);
          if (firstNote.stem_direction == -1) {
            tuplet.setTupletLocation(Vex.Flow.Tuplet.LOCATION_BOTTOM);
          }
        });

        return beams;
    };
    return Vex;
});
