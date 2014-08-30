define(['./base'], function(base) { 
   var instrument = {};
   instrument.Instrument = function (instrumentName) {
       base.Music21Object.call(this);
       this.classSortOrder = -25;
       
       this.partId = undefined;
       this.partName = undefined;
       this.partAbbreviation = undefined;
       
       this.instrumentId = undefined;
       this.instrumentName = undefined;
       this.instrumentAbbreviation = undefined;
       this.midiProgram = undefined;
       this._midiChannel = undefined;
       
       this.lowestNote = undefined;
       this.highestNote = undefined;
       
       this.transpostion = undefined;
       
       this.inGMPercMap = false;
       this.soundfontFn = undefined;
       
       if (instrumentName !== undefined) {
           instrument.find(instrumentName);
       }
       return this;
   };
   instrument.Instrument.prototype = new base.Music21Object();
   instrument.Instrument.prototype.constructor = instrument.Instrument;
   
   instrument.Instrument.usedChannels = []; // differs from m21p -- stored midiProgram numbers
   instrument.Instrument.maxMidi = 16;
   
   instrument.Instrument.prototype.autoAssignMidiChannel = function (usedChannels) {
       if (usedChannels === undefined) {
           usedChannels = instrument.Instrument.usedChannels;
       }
       for (var ch = 0; ch < instrument.Instrument.maxMidi; ch++) {
           if (ch % 16 == 10) {
               continue; // skip 10 / percussion.
           }
           if (usedChannels[ch] === undefined || usedChannels[ch] === this.midiProgram) {
               usedChannels[ch] = this.midiProgram;
               this.midiChannel = ch;
               return ch;
           }
       }
       // no channels! throw exception!
   };
   
   Object.defineProperties(instrument.Instrument.prototype, {
      'oggSoundfont': {
          enumerable: true,
          configurable: true,
          get: function () { return this.soundfontFn + '-ogg.js'; }
      },
      'mp3Soundfont': {
          enumerable: true,
          configurable: true,
          get: function () { return this.soundfontFn + '-mp3.js'; }
      },
      'midiChannel': {
          enumerable: true,
          configurable: true,
          get: function () { 
              if (this._midiChannel === undefined) {
                  this.autoAssignMidiChannel();                  
              }
              return this._midiChannel;
          },
          set: function (ch) {
              this._midiChannel = ch;
          }
      },
      
   });
   
   instrument.info = [{"fn": "acoustic_grand_piano", "name": "Acoustic Grand Piano", "midiNumber": 0}, {"fn": "bright_acoustic_piano", "name": "Bright Acoustic Piano", "midiNumber": 1}, {"fn": "electric_grand_piano", "name": "Electric Grand Piano", "midiNumber": 2}, {"fn": "honkytonk_piano", "name": "Honky-tonk Piano", "midiNumber": 3}, {"fn": "electric_piano_1", "name": "Electric Piano 1", "midiNumber": 4}, {"fn": "electric_piano_2", "name": "Electric Piano 2", "midiNumber": 5}, {"fn": "harpsichord", "name": "Harpsichord", "midiNumber": 6}, {"fn": "clavinet", "name": "Clavinet", "midiNumber": 7}, {"fn": "celesta", "name": "Celesta", "midiNumber": 8}, {"fn": "glockenspiel", "name": "Glockenspiel", "midiNumber": 9}, {"fn": "music_box", "name": "Music Box", "midiNumber": 10}, {"fn": "vibraphone", "name": "Vibraphone", "midiNumber": 11}, {"fn": "marimba", "name": "Marimba", "midiNumber": 12}, {"fn": "xylophone", "name": "Xylophone", "midiNumber": 13}, {"fn": "tubular_bells", "name": "Tubular Bells", "midiNumber": 14}, {"fn": "dulcimer", "name": "Dulcimer", "midiNumber": 15}, {"fn": "drawbar_organ", "name": "Drawbar Organ", "midiNumber": 16}, {"fn": "percussive_organ", "name": "Percussive Organ", "midiNumber": 17}, {"fn": "rock_organ", "name": "Rock Organ", "midiNumber": 18}, {"fn": "church_organ", "name": "Church Organ", "midiNumber": 19}, {"fn": "reed_organ", "name": "Reed Organ", "midiNumber": 20}, {"fn": "accordion", "name": "Accordion", "midiNumber": 21}, {"fn": "harmonica", "name": "Harmonica", "midiNumber": 22}, {"fn": "tango_accordion", "name": "Tango Accordion", "midiNumber": 23}, {"fn": "acoustic_guitar_nylon", "name": "Acoustic Guitar (nylon)", "midiNumber": 24}, {"fn": "acoustic_guitar_steel", "name": "Acoustic Guitar (steel)", "midiNumber": 25}, {"fn": "electric_guitar_jazz", "name": "Electric Guitar (jazz)", "midiNumber": 26}, {"fn": "electric_guitar_clean", "name": "Electric Guitar (clean)", "midiNumber": 27}, {"fn": "electric_guitar_muted", "name": "Electric Guitar (muted)", "midiNumber": 28}, {"fn": "overdriven_guitar", "name": "Overdriven Guitar", "midiNumber": 29}, {"fn": "distortion_guitar", "name": "Distortion Guitar", "midiNumber": 30}, {"fn": "guitar_harmonics", "name": "Guitar Harmonics", "midiNumber": 31}, {"fn": "acoustic_bass", "name": "Acoustic Bass", "midiNumber": 32}, {"fn": "electric_bass_finger", "name": "Electric Bass (finger)", "midiNumber": 33}, {"fn": "electric_bass_pick", "name": "Electric Bass (pick)", "midiNumber": 34}, {"fn": "fretless_bass", "name": "Fretless Bass", "midiNumber": 35}, {"fn": "slap_bass_1", "name": "Slap Bass 1", "midiNumber": 36}, {"fn": "slap_bass_2", "name": "Slap Bass 2", "midiNumber": 37}, {"fn": "synth_bass_1", "name": "Synth Bass 1", "midiNumber": 38}, {"fn": "synth_bass_2", "name": "Synth Bass 2", "midiNumber": 39}, {"fn": "violin", "name": "Violin", "midiNumber": 40}, {"fn": "viola", "name": "Viola", "midiNumber": 41}, {"fn": "cello", "name": "Cello", "midiNumber": 42}, {"fn": "contrabass", "name": "Contrabass", "midiNumber": 43}, {"fn": "tremolo_strings", "name": "Tremolo Strings", "midiNumber": 44}, {"fn": "pizzicato_strings", "name": "Pizzicato Strings", "midiNumber": 45}, {"fn": "orchestral_harp", "name": "Orchestral Harp", "midiNumber": 46}, {"fn": "timpani", "name": "Timpani", "midiNumber": 47}, {"fn": "string_ensemble_1", "name": "String Ensemble 1", "midiNumber": 48}, {"fn": "string_ensemble_2", "name": "String Ensemble 2", "midiNumber": 49}, {"fn": "synth_strings_1", "name": "Synth Strings 1", "midiNumber": 50}, {"fn": "synth_strings_2", "name": "Synth Strings 2", "midiNumber": 51}, {"fn": "choir_aahs", "name": "Choir Aahs", "midiNumber": 52}, {"fn": "voice_oohs", "name": "Voice Oohs", "midiNumber": 53}, {"fn": "synth_choir", "name": "Synth Choir", "midiNumber": 54}, {"fn": "orchestra_hit", "name": "Orchestra Hit", "midiNumber": 55}, {"fn": "trumpet", "name": "Trumpet", "midiNumber": 56}, {"fn": "trombone", "name": "Trombone", "midiNumber": 57}, {"fn": "tuba", "name": "Tuba", "midiNumber": 58}, {"fn": "muted_trumpet", "name": "Muted Trumpet", "midiNumber": 59}, {"fn": "french_horn", "name": "French Horn", "midiNumber": 60}, {"fn": "brass_section", "name": "Brass Section", "midiNumber": 61}, {"fn": "synth_brass_1", "name": "Synth Brass 1", "midiNumber": 62}, {"fn": "synth_brass_2", "name": "Synth Brass 2", "midiNumber": 63}, {"fn": "soprano_sax", "name": "Soprano Sax", "midiNumber": 64}, {"fn": "alto_sax", "name": "Alto Sax", "midiNumber": 65}, {"fn": "tenor_sax", "name": "Tenor Sax", "midiNumber": 66}, {"fn": "baritone_sax", "name": "Baritone Sax", "midiNumber": 67}, {"fn": "oboe", "name": "Oboe", "midiNumber": 68}, {"fn": "english_horn", "name": "English Horn", "midiNumber": 69}, {"fn": "bassoon", "name": "Bassoon", "midiNumber": 70}, {"fn": "clarinet", "name": "Clarinet", "midiNumber": 71}, {"fn": "piccolo", "name": "Piccolo", "midiNumber": 72}, {"fn": "flute", "name": "Flute", "midiNumber": 73}, {"fn": "recorder", "name": "Recorder", "midiNumber": 74}, {"fn": "pan_flute", "name": "Pan Flute", "midiNumber": 75}, {"fn": "blown_bottle", "name": "Blown bottle", "midiNumber": 76}, {"fn": "shakuhachi", "name": "Shakuhachi", "midiNumber": 77}, {"fn": "whistle", "name": "Whistle", "midiNumber": 78}, {"fn": "ocarina", "name": "Ocarina", "midiNumber": 79}, {"fn": "lead_1_square", "name": "Lead 1 (square)", "midiNumber": 80}, {"fn": "lead_2_sawtooth", "name": "Lead 2 (sawtooth)", "midiNumber": 81}, {"fn": "lead_3_calliope", "name": "Lead 3 (calliope)", "midiNumber": 82}, {"fn": "lead_4_chiff", "name": "Lead 4 chiff", "midiNumber": 83}, {"fn": "lead_5_charang", "name": "Lead 5 (charang)", "midiNumber": 84}, {"fn": "lead_6_voice", "name": "Lead 6 (voice)", "midiNumber": 85}, {"fn": "lead_7_fifths", "name": "Lead 7 (fifths)", "midiNumber": 86}, {"fn": "lead_8_bass__lead", "name": "Lead 8 (bass + lead)", "midiNumber": 87}, {"fn": "pad_1_new_age", "name": "Pad 1 (new age)", "midiNumber": 88}, {"fn": "pad_2_warm", "name": "Pad 2 (warm)", "midiNumber": 89}, {"fn": "pad_3_polysynth", "name": "Pad 3 (polysynth)", "midiNumber": 90}, {"fn": "pad_4_choir", "name": "Pad 4 (choir)", "midiNumber": 91}, {"fn": "pad_5_bowed", "name": "Pad 5 (bowed)", "midiNumber": 92}, {"fn": "pad_6_metallic", "name": "Pad 6 (metallic)", "midiNumber": 93}, {"fn": "pad_7_halo", "name": "Pad 7 (halo)", "midiNumber": 94}, {"fn": "pad_8_sweep", "name": "Pad 8 (sweep)", "midiNumber": 95}, {"fn": "fx_1_rain", "name": "FX 1 (rain)", "midiNumber": 96}, {"fn": "fx_2_soundtrack", "name": "FX 2 (soundtrack)", "midiNumber": 97}, {"fn": "fx_3_crystal", "name": "FX 3 (crystal)", "midiNumber": 98}, {"fn": "fx_4_atmosphere", "name": "FX 4 (atmosphere)", "midiNumber": 99}, {"fn": "fx_5_brightness", "name": "FX 5 (brightness)", "midiNumber": 100}, {"fn": "fx_6_goblins", "name": "FX 6 (goblins)", "midiNumber": 101}, {"fn": "fx_7_echoes", "name": "FX 7 (echoes)", "midiNumber": 102}, {"fn": "fx_8_scifi", "name": "FX 8 (sci-fi)", "midiNumber": 103}, {"fn": "sitar", "name": "Sitar", "midiNumber": 104}, {"fn": "banjo", "name": "Banjo", "midiNumber": 105}, {"fn": "shamisen", "name": "Shamisen", "midiNumber": 106}, {"fn": "koto", "name": "Koto", "midiNumber": 107}, {"fn": "kalimba", "name": "Kalimba", "midiNumber": 108}, {"fn": "bagpipe", "name": "Bagpipe", "midiNumber": 109}, {"fn": "fiddle", "name": "Fiddle", "midiNumber": 110}, {"fn": "shanai", "name": "Shanai", "midiNumber": 111}, {"fn": "tinkle_bell", "name": "Tinkle Bell", "midiNumber": 112}, {"fn": "agogo", "name": "Agogo", "midiNumber": 113}, {"fn": "steel_drums", "name": "Steel Drums", "midiNumber": 114}, {"fn": "woodblock", "name": "Woodblock", "midiNumber": 115}, {"fn": "taiko_drum", "name": "Taiko Drum", "midiNumber": 116}, {"fn": "melodic_tom", "name": "Melodic Tom", "midiNumber": 117}, {"fn": "synth_drum", "name": "Synth Drum", "midiNumber": 118}, {"fn": "reverse_cymbal", "name": "Reverse Cymbal", "midiNumber": 119}, {"fn": "guitar_fret_noise", "name": "Guitar Fret Noise", "midiNumber": 120}, {"fn": "breath_noise", "name": "Breath Noise", "midiNumber": 121}, {"fn": "seashore", "name": "Seashore", "midiNumber": 122}, {"fn": "bird_tweet", "name": "Bird Tweet", "midiNumber": 123}, {"fn": "telephone_ring", "name": "Telephone Ring", "midiNumber": 124}, {"fn": "helicopter", "name": "Helicopter", "midiNumber": 125}, {"fn": "applause", "name": "Applause", "midiNumber": 126}, {"fn": "gunshot", "name": "Gunshot", "midiNumber": 127}];

   instrument.find = function (fn, inst) {
       if (inst === undefined) {
           inst = new instrument.Instrument();           
       }
       for (var i = 0; i < instrument.info.length; i++) {
           var info = instrument.info[i];
           if (info.fn == fn || info.name == fn) {
               inst.soundfontFn = info.fn;
               inst.instrumentName = info.name;
               inst.midiProgram = info.midiNumber;               
               return inst;
           }
       }
   };
   
    // end of define
    if (typeof(music21) != "undefined") {
        music21.instrument = instrument;
    }        
    return instrument;
                    
});