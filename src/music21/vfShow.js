define(['vexflow', 'music21/common'], function(Vex, common) {
    var vfShow = {}; 
    
    vfShow.RenderStack = function () {
        this.voices = [];
        this.streams = [];
        this.textVoices = [];
    };
    vfShow.RenderStack.prototype.allTickables = function () {
        var t = [];
        t.push.apply(t, this.voices);
        t.push.apply(t, this.textVoices);
        return t;
    };
    
    /**
     * Renderer is a function that takes a stream, an
     * optional existing canvas element and a DOM
     * element where the canvas element should be placed
     * and renders the stream as Vexflow on the
     * canvas element, placing it then in the where
     * DOM.
     * 
     * "s" can be any type of Stream.
     * 
     * "canvas" and "where" can be either a DOM
     * element or a jQuery object.
     */
    vfShow.Renderer = function (s, canvas, where) {
        this.stream = s;
        //this.streamType = s.classes[-1];

        this.canvas = undefined;
        this.$canvas = undefined;
        this.$where = undefined;
        this.activeFormatter = undefined;
        this._vfRenderer = undefined;
        this._ctx = undefined;
        this.beamGroups = [];
        this.stacks = []; // an Array of dictionaries: {voices: [Array of Vex.Flow.Voice objects],
                          //                            streams: [Array of Streams, usually Measures]}
        this.ties = [];
        this.systemBreakOffsets = [];
        this.vfTuplets = [];
        //this.measureFormatters = [];
        
        Object.defineProperties(this, {
           'vfRenderer': { 
               get: function () { 
                       if (this._vfRenderer !== undefined) {
                           return this._vfRenderer;
                       } else {
                           this._vfRenderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
                           return this._vfRenderer;
                       }
               },
               set: function (vfr) { this._vfRenderer = vfr; },
           },
           'ctx': { 
              get: function () {
                  if (this._ctx !== undefined) {
                     return this._ctx;
                  } else {
                      this._ctx = this.vfRenderer.getContext();
                      if (this.stream && this.stream.renderOptions) {
                          this._ctx.scale(this.stream.renderOptions.scaleFactor.x,
                                  this.stream.renderOptions.scaleFactor.y);                          
                      }
                      return this._ctx;
                  }
              },
              set: function (ctx) { this._ctx = ctx; }
           }
        });
        
        if (where !== undefined) {
            if (where.jquery !== undefined) {
                this.$where = where;
            } else {
                this.$where = $(where);
            }
        }
        if (canvas !== undefined) {
            if (canvas.jquery !== undefined) {
                this.$canvas = canvas;
                this.canvas = canvas[0];
            } else {
                this.canvas = canvas;
                this.$canvas = $(canvas);
            }
        }
      
    };
        
    /**
     * main function to render a Stream.
     * 
     * if s is undefined, uses the stored Stream from
     * the constructor object.
     */
    vfShow.Renderer.prototype.render = function (s) {
        if (s === undefined) {
            s = this.stream;                
        }
        
        var isScorelike = false;
        var isPartlike = false;
        var hasSubStreams = s.hasSubStreams();
        
        if (s.isClassOrSubclass('Score')) {
            isScorelike = true;
        } else if (hasSubStreams && s.get(0).hasSubStreams()) {
            isScorelike = true;
        } else if (hasSubStreams) {
            isPartlike = true;
        }  
        // requires organization Score -> Part -> Measure -> elements...
        if (isScorelike) {
            this.prepareScorelike(s);
        } else if (isPartlike) {
            this.preparePartlike(s);
        } else {
            this.prepareArrivedFlat(s);
        }
        this.formatMeasureStacks();
        this.drawTies();
        this.drawMeasureStacks();
        this.drawBeamGroups();
        this.drawTuplets();
    };

    /**
     * Prepares a scorelike stream (i.e., one with parts or
     * Streams that should be rendered vertically like parts)
     * for rendering and adds Staff Connectors
     */
    vfShow.Renderer.prototype.prepareScorelike = function (s) {
        //console.log('prepareScorelike called');
        for (var i = 0; i < s.length; i++) {
            var subStream = s.get(i);
            this.preparePartlike(subStream);
        }
        this.addStaffConnectors(s);                
    };
    
    /**
     * Prepares a Partlike stream (that is one with Measures
     * or substreams that should be considered like Measures)
     * for rendering.
     * 
     * Assumes that measures are flat. TODO: allow voices.
     */
    vfShow.Renderer.prototype.preparePartlike = function (p) {
        //console.log('preparePartlike called');
        this.systemBreakOffsets = [];
        for (var i = 0; i < p.length; i++) {
            var subStream = p.get(i);
            if (subStream.renderOptions.startNewSystem) {
                this.systemBreakOffsets.push(subStream.offset);
            }
            if (i == p.length - 1) {
                subStream.renderOptions.rightBarline = 'end';
            }                
            if (this.stacks[i] === undefined) {
                this.stacks[i] = new vfShow.RenderStack();
            }
            this.prepareMeasure(subStream, this.stacks[i]);
        }
        this.prepareTies(p);
    };        
    /**
     * Prepares a score that arrived flat... sets up
     * stacks and ties after calling prepareFlat
     */
    vfShow.Renderer.prototype.prepareArrivedFlat = function (m) {
        var stack = new vfShow.RenderStack();
        this.prepareMeasure(m, stack);
        this.stacks[0] = stack;
        this.prepareTies(m);
    };
    /**
     * Prepares a measure (w/ or w/o voices) or generic Stream -- makes accidentals,
     * associates a Vex.Flow.Stave with the stream and
     * returns a vexflow Voice object
     */
    vfShow.Renderer.prototype.prepareMeasure = function (s, stack) {
        // TODO: don't assume that all elements are Voices;
        if (s.hasVoices == undefined || s.hasVoices() == false) {
            this.prepareFlat(s, stack);
        } else {
            var stave = undefined;
            var rendOp = s.renderOptions; // get render options from Measure;
            for (var voiceIndex = 0; voiceIndex < s.length; voiceIndex++) {
                var voiceStream = s.get(voiceIndex);
                stave = this.prepareFlat(voiceStream, stack, stave, rendOp);
            }            
        }
        return stack;
    };

    vfShow.Renderer.prototype.prepareFlat = function (s, stack, optionalStave, optional_renderOp) {
        s.makeAccidentals();
        var stave = undefined;
        if (optionalStave !== undefined) {
            stave = optionalStave;
        } else {
            stave = this.renderStave(s, optional_renderOp);
        }       
        s.activeVFStave = stave;
        var voice = this.getVoice(s, stave);
        stack.voices.push(voice);
        stack.streams.push(s);
        
        if (s.hasLyrics()) {
            stack.textVoices.push( this.getLyricVoice(s, stave) );
        }
        
        return stave;
    };

    
    /**
     * Render a measure as a stave
     * 
     * @param {music21.stream.Measure} m
     * @returns {Vex.Flow.Stave} stave
     */
    vfShow.Renderer.prototype.renderStave = function (m, optional_rendOp) {   
        if (m === undefined) {
            m = this.stream;
        }
        var ctx = this.ctx;
        // stave will be passed in from Measure when we have Voices 
        var stave = this.newStave(m, optional_rendOp);

        this.setClefEtc(m, stave, optional_rendOp);
        stave.setContext(ctx);
        stave.draw();
        return stave;
    };
    

    vfShow.Renderer.prototype.drawMeasureStacks = function () {
        var ctx = this.ctx;
        for (var i = 0; i < this.stacks.length; i++) {
            var voices = this.stacks[i].allTickables();
            for (var j = 0; j < voices.length; j++ ) {
                var v = voices[j];
                v.draw(ctx);
            }
        }
    };
    vfShow.Renderer.prototype.drawTuplets = function () {
        var ctx = this.ctx;
        this.vfTuplets.forEach( function(vft) { 
            vft.setContext(ctx).draw();
        });
    };
    vfShow.Renderer.prototype.drawTies = function () {
        var ctx = this.ctx;
        for (var i = 0; i < this.ties.length; i++) {
            this.ties[i].setContext(ctx).draw();
        }
    };
    vfShow.Renderer.prototype.prepareTies = function (p) {
        var pf = p.flat.notesAndRests;
        //console.log('newSystemsAt', this.systemBreakOffsets);
        for (var i = 0; i < pf.length - 1; i++) {
            var thisNote = pf.get(i);
            if (thisNote.tie === undefined || thisNote.tie.type == 'stop') {
                continue;
            }
            var nextNote = pf.get(i+1);
            var onSameSystem = true;
            // this.systemBreakOffsets.length will be 0 for a flat score
            for (var sbI = 0; sbI < this.systemBreakOffsets.length; sbI++ ) {
                var thisSystemBreak = this.systemBreakOffsets[sbI];
                if (thisNote.offset < thisSystemBreak && nextNote.offset >= thisSystemBreak) {
                    onSameSystem = false;
                    break;
                }
            }
            if (onSameSystem) {
                var vfTie = new Vex.Flow.StaveTie({
                    first_note: thisNote.activeVexflowNote,
                    last_note: nextNote.activeVexflowNote,
                    first_indices: [0],
                    last_indices: [0],
                });
                this.ties.push(vfTie);                   
            } else {
                //console.log('got me a tie across systemBreaks!');
                var vfTie1 = new Vex.Flow.StaveTie({
                    first_note: thisNote.activeVexflowNote,
                    first_indices: [0],                        
                });
                this.ties.push(vfTie1);
                var vfTie2 = new Vex.Flow.StaveTie({
                    last_note: nextNote.activeVexflowNote,
                    first_indices: [0],                        
                });
                this.ties.push(vfTie2);
            }
            
        }
        
    };
    
    /**
     * 
     * @param {music21.stream.Stream} s -- usually a Measure or Voice
     * @param {Vex.Flow.Stave} stave
     * @returns {Vex.Flow.Voice}
     */    
    vfShow.Renderer.prototype.getVoice = function (s, stave) {
        if (s === undefined) {
            s = this.stream;
        }
        
        // gets a group of notes as a voice, but completely unformatted and not drawn.
        var notes = this.vexflowNotes(s, stave);
        var voice = this.vexflowVoice(s);
        voice.setStave(stave);
        voice.addTickables(notes);
        //console.log(voice.ticksUsed.value(), voice.totalTicks.value());
        return voice;
    };

    /**
     * 
     * @param {music21.stream.Stream} s -- usually a Measure or Voice
     * @param {Vex.Flow.Stave} stave
     * @returns {Vex.Flow.Voice}
     */    
    vfShow.Renderer.prototype.getLyricVoice = function (s, stave) {
        var textVoice = this.vexflowVoice(s);
        var lyrics = this.vexflowLyrics(s, stave);
        textVoice.setStave(stave);
        textVoice.addTickables(lyrics);
        return textVoice;
    };
    
    
    vfShow.Renderer.prototype.formatMeasureStacks = function () {
        // adds formats the voices, then adds the formatter information to every note in a voice...
        for (var i = 0; i < this.stacks.length; i++) {
            var stack = this.stacks[i];
            var voices = stack.voices;
            var measures = stack.streams;
            var formatter = this.formatVoiceGroup(stack);
            for (var j = 0; j < measures.length; j++ ) {
                var m = measures[j];
                var v = voices[j];
                this.applyFormatterInformationToNotes(v.stave, m, formatter);
            }
        }
    };
    vfShow.Renderer.prototype.formatVoiceGroup = function (stack, autoBeam) {
        // formats a group of voices to use the same formatter; returns the formatter
        // if autoBeam is true then it will apply beams for each voice and put them in
        // this.beamGroups;
        var allTickables = stack.allTickables();
        var voices = stack.voices;
        var measures = stack.streams;
        if (autoBeam === undefined) {
            autoBeam = measures[0].autoBeam;
        }
        
        var formatter = new Vex.Flow.Formatter();
        //var minLength = formatter.preCalculateMinTotalWidth([voices]);
        //console.log(minLength);
        if (voices.length == 0) {
            return formatter;
        }
        var maxGlyphStart = 0; // find the stave with the farthest start point -- diff key sig, etc.
        for (var i = 0; i < allTickables.length; i++) {             
            //console.log(voices[i], voices[i].stave, i);
            if (allTickables[i].stave.start_x > maxGlyphStart) {
                maxGlyphStart = allTickables[i].stave.start_x;
            }
        }
        for (var i = 0; i < allTickables.length; i++) {             
            allTickables[i].stave.start_x = maxGlyphStart; // corrected!
        }
        // TODO: should do the same for end_x -- for key sig changes, etc...
        
        var stave = voices[0].stave; // all staves should be same length, so does not matter;
        formatter.joinVoices(allTickables);
        formatter.formatToStave(allTickables, stave);
        if (autoBeam) {
            for (var i = 0; i < voices.length; i++) {
                // find beam groups -- n.b. this wipes out stem direction and
                //      screws up middle line stems -- worth it for now.
                var voice = voices[i];
                var beatGroups = [new Vex.Flow.Fraction(2, 8)];
                if (measures[i] !== undefined && measures[i].timeSignature !== undefined) {
                    beatGroups = measures[i].timeSignature.vexflowBeatGroups(Vex);
                    //console.log(beatGroups);
                }
                var beamGroups = Vex.Flow.Beam.applyAndGetBeams(voice, undefined, beatGroups);
                this.beamGroups.push.apply(this.beamGroups, beamGroups);                    
            }
        }
        return formatter;
    };

    vfShow.Renderer.prototype.drawBeamGroups = function () {
        var ctx = this.ctx;
        // draw beams
        
        for(var i = 0; i < this.beamGroups.length; i++){
             this.beamGroups[i].setContext(ctx).draw();
        }
    };

    /**
     * Return a new Vex.Flow.Stave object, which represents
     * a single MEASURE of notation in m21j
     * 
     * @param {music21.stream.Stream} s
     * @returns {Vex.Flow.Stave}
     */
    vfShow.Renderer.prototype.newStave = function (s, rendOp) {
        if (s === undefined) {
            s = this.stream;
        }
        if (rendOp === undefined) {
            rendOp = s.renderOptions;                
        }
        // measure level...
        var width = rendOp.width;
        if (width == undefined) {
            width = s.estimateStaffLength() + rendOp.staffPadding;
        }
        var top = rendOp.top;// * rendOp.scaleFactor.y;
        if (top == undefined) {
            top = 0;
        }
        var left = rendOp.left;
        if (left == undefined) {
            left = 10;
        }
        //console.log('streamLength: ' + streamLength);
        if (music21.debug) {
            console.log('creating new stave: left:' + left + ' top: ' + top + ' width: ' + width);            
        }
        var stave = new Vex.Flow.Stave(left, top, width);
        return stave;
    };
    
    vfShow.Renderer.prototype.setClefEtc = function (s, stave, rendOp) {
        if (rendOp === undefined) {
            rendOp = s.renderOptions;
        } 
        this.setStafflines(s, stave);
        if (rendOp.showMeasureNumber) {
            stave.setMeasure(rendOp.measureIndex + 1);
        }
        if (rendOp.displayClef) {
            var ottava = undefined;
            var size = 'default';
            if (s.clef.octaveShift == 1) { ottava = '8va'; }
            else if (s.clef.octaveShift == -1) { ottava = '8vb'; }
            stave.addClef(s.clef.name, size, ottava);
        }
        if ((s.keySignature != undefined) && (rendOp.displayKeySignature)) {
            stave.addKeySignature(s.keySignature.vexflow());
        }
        
        if ((s.timeSignature != undefined) && (rendOp.displayTimeSignature)) {
            stave.addTimeSignature(
                    s.timeSignature.numerator.toString() 
                    + "/" 
                    + s.timeSignature.denominator.toString()); // TODO: convertToVexflow...
        }
        if (rendOp.rightBarline != undefined) {
            var bl = rendOp.rightBarline;
            var barlineMap = {
                    'single': 'SINGLE',
                    'double': "DOUBLE",
                    'end': 'END',
                    };
            var vxBL = barlineMap[bl];
            if (vxBL != undefined) {
                stave.setEndBarType(Vex.Flow.Barline.type[vxBL]);
            }
        }
       
    };
    vfShow.Renderer.prototype.setStafflines = function(s, vexflowStave) {
        var rendOp = s.renderOptions;
        if (rendOp.staffLines != 5) {
            if (rendOp.staffLines == 0) {
                vexflowStave.setNumLines(0);
            } else if (rendOp.staffLines == 1) {
                // Vex.Flow.Stave.setNumLines hides all but the top line.
                // this is better
                vexflowStave.options.line_config = [{visible: false},
                                             {visible: false},
                                             {visible: true}, // show middle
                                             {visible: false},
                                             {visible: false},];
            } else if (rendOp.staffLines == 2) {
                vexflowStave.options.line_config = [{visible: false},
                                             {visible: false},
                                             {visible: true}, // show middle
                                             {visible: true},
                                             {visible: false},];
            } else if (rendOp.staffLines == 3) {
                vexflowStave.options.line_config = [{visible: false},
                                             {visible: true},
                                             {visible: true}, // show middle
                                             {visible: true},
                                             {visible: false},];
            } else {
                vexflowStave.setNumLines(rendOp.staffLines);                 
            }
        }
    };
    vfShow.Renderer.prototype.vexflowNotes = function (s, stave) {
        if (s === undefined) {
            s = this.stream;
        }
        // runs on a flat stream, returns a list of voices...
        var notes = [];
        var vfTuplets = [];
        var activeTuplet = undefined;
        var activeTupletLength = 0.0;
        var activeTupletVexflowNotes = [];

        var options = {clef: s.clef, stave: stave};
        for (var i = 0; i < s.length; i++) {
            var thisEl = s.get(i);
            if (thisEl.isClassOrSubclass('GeneralNote') && (thisEl.duration !== undefined)) {
                var vfn = thisEl.vexflowNote(options);
                if (vfn === undefined) {
                    console.error('Cannot create a vexflowNote from: ', thisEl);
                }
                // sets thisEl.activeVexflowNote -- may be overwritten but not so fast...
                if (stave !== undefined) {
                    vfn.setStave(stave);
                }
                notes.push(vfn);
                
                // account for tuplets...
                if (thisEl.duration.tuplets.length > 0) {
                    // only support one tuplet -- like vexflow
                    var m21Tuplet = thisEl.duration.tuplets[0];
                    if (activeTuplet === undefined) {
                        activeTuplet = m21Tuplet;
                    }
                    activeTupletVexflowNotes.push(vfn);
                    activeTupletLength += thisEl.duration.quarterLength;
                    //console.log(activeTupletLength, activeTuplet.totalTupletLength());
                    if (activeTupletLength >= activeTuplet.totalTupletLength() ||
                            Math.abs(activeTupletLength - activeTuplet.totalTupletLength()) < 0.001) {
                        //console.log(activeTupletVexflowNotes);
                        var tupletOptions = {num_notes: activeTuplet.numberNotesActual, 
                                       beats_occupied: activeTuplet.numberNotesNormal};
                        //console.log('tupletOptions', tupletOptions);
                        var vfTuplet = new Vex.Flow.Tuplet(activeTupletVexflowNotes, 
                                tupletOptions);
                        if (activeTuplet.tupletNormalShow == 'ratio') {
                            vfTuplet.setRatioed(true);
                        }
                        //console.log(vfn.tickMultiplier);
                        vfTuplets.push(vfTuplet);
                        activeTupletLength = 0.0;
                        activeTuplet = undefined;
                        activeTupletVexflowNotes = [];
                    }
                }
            
            }
        }
        if (activeTuplet !== undefined) {
            console.warn('incomplete tuplet found in stream: ', s);
        }
        if (vfTuplets.length > 0) {
            this.vfTuplets.push.apply(this.vfTuplets, vfTuplets);
        }
        return notes;
    };
    
    
    vfShow.Renderer.prototype.vexflowLyrics = function (s, stave) {
        var getTextNote = function (text, font, d) {
            //console.log(text, font, d);
            var t1 = new Vex.Flow.TextNote({
                text: text,
                font: font,
                duration: d,
            }).setLine(11).setStave(stave).setJustification(Vex.Flow.TextNote.Justification.LEFT);
            return t1;
        };
        
        if (s === undefined) {
            s = this.stream;
        }
        var font = { 
            family: "Serif",
            size: 12,
            weight: "",
        };
        // runs on a flat, gapless, no-overlap stream, returns a list of TextNote objects...
        var lyricsObjects = [];
        for (var i = 0; i < s.length; i++) {
            var el = s.get(i);
            var lyricsArray = el.lyrics;
            var text = undefined;
            var d = el.duration.vexflowDuration;
            var addConnector = false;
            if (lyricsArray.length == 0) {
                text = "";
            } else {
                text = lyricsArray[0].text;
                if (text === undefined) { 
                    text = "";
                }
                if (lyricsArray[0].syllabic == 'middle' || lyricsArray[0].syllabic == 'begin') {
                    addConnector = " " + lyricsArray[0].lyricConnector;
                    var tempQl = el.duration.quarterLength / 2.0;
                    d = new music21.duration.Duration(tempQl).vexflowDuration;
                }
            }
            var t1 = getTextNote(text, font, d);            
            lyricsObjects.push(t1);
            if (addConnector != false) {
                var connector = getTextNote(addConnector, font, d);
                lyricsObjects.push(connector);                
            }
            
        }
        return lyricsObjects;
    };
    
    vfShow.Renderer.prototype.vexflowVoice = function (s) {
        var vfv;
        var totalLength = s.duration.quarterLength;
        var numSixteenths = totalLength / 0.25;
        var beatValue = 16;
        if (numSixteenths % 8 == 0) { beatValue = 2; numSixteenths = numSixteenths / 8; }
        else if (numSixteenths % 4 == 0) { beatValue = 4; numSixteenths = numSixteenths / 4; }
        else if (numSixteenths % 2 == 0) { beatValue = 8; numSixteenths = numSixteenths / 2; }
        //console.log('creating voice');
        if (music21.debug) {
            console.log("New voice, num_beats: " + numSixteenths.toString() + " beat_value: " + beatValue.toString());
        }
        vfv = new Vex.Flow.Voice({ num_beats: numSixteenths,
                                    beat_value: beatValue,
                                    resolution: Vex.Flow.RESOLUTION });
        
        // from vexflow/src/voice.js
        //
        // Modes allow the addition of ticks in three different ways:
        //
        // STRICT: This is the default. Ticks must fill the voice.
        // SOFT:   Ticks can be added without restrictions.
        // FULL:   Ticks do not need to fill the voice, but can't exceed the maximum
        //         tick length.
        vfv.setMode(Vex.Flow.Voice.Mode.SOFT);
        return vfv;
    };
    vfShow.Renderer.prototype.staffConnectorsMap = {
            'brace': Vex.Flow.StaveConnector.type.BRACE, 
            'single': Vex.Flow.StaveConnector.type.SINGLE, 
            'double': Vex.Flow.StaveConnector.type.DOUBLE, 
            'bracket': Vex.Flow.StaveConnector.type.BRACKET, 
    };
    
    vfShow.Renderer.prototype.addStaffConnectors = function (s) {
        if (s === undefined) {
            s = this.stream;
        }
        var numParts = s.length;
        if (numParts < 2) {
            return;
        }
        
        var firstPart = s.get(0);
        var lastPart = s.get(-1);
        var numMeasures = firstPart.length;
        for (var mIndex = 0; mIndex < numMeasures; mIndex++) {
            var thisPartMeasure = firstPart.get(mIndex);
            var lastPartMeasure = lastPart.get(mIndex); // only needed once per system but
                                                        // good for symmetry.
            if (thisPartMeasure.renderOptions.startNewSystem) {
                var topVFStaff = thisPartMeasure.activeVFStave;
                var bottomVFStaff = lastPartMeasure.activeVFStave;
                /* TODO: warning if no staves... */;
                for (var i = 0; i < s.renderOptions.staffConnectors.length; i++) {
                    var sc = new Vex.Flow.StaveConnector(topVFStaff, bottomVFStaff);
                    var scTypeM21 = s.renderOptions.staffConnectors[i];
                    var scTypeVF = this.staffConnectorsMap[scTypeM21];
                    sc.setType(scTypeVF);
                    sc.setContext(this.ctx);
                    sc.draw();
                }
            }
        }
    };

    /**
     *  For later retrieval of notes from, say, a clicked score.
     */
    vfShow.Renderer.prototype.removeFormatterInformation = function(s, recursive) {
        s.storedVexflowStave = undefined;
        for (var i = 0; i < s.length; i ++ ) {
            var el = s.get(i);
            el.x = undefined;
            el.systemIndex = undefined;
            el.activeVexflowNote = undefined;
            if (recursive && el.isClassOrSubclass('Stream')) {
                this.removeFormatterInformation(el, recursive);
            }
        }
    };
    vfShow.Renderer.prototype.applyFormatterInformationToNotes = function (stave, s, formatter) {
        // mad props to our friend Vladimir Viro for figuring this out!
        // visit http://peachnote.com/
        if (s === undefined) {
            s = this.stream;
        }
        var noteOffsetLeft = 0;
        //var staveHeight = 80;
        if (stave != undefined) {
            noteOffsetLeft = stave.start_x + stave.glyph_start_x;
            if (music21.debug) {
                console.log("noteOffsetLeft: " + noteOffsetLeft + " ; stave.start_x: " + stave.start_x);
                console.log("Bottom y: " + stave.getBottomY() );                        
            }
            //staveHeight = stave.height;
        }
        
        var nextTicks = 0;
        for (var i = 0; i < s.length; i ++ ) {
            var el = s.get(i);
            if (el.isClassOrSubclass('GeneralNote')) {
                var vfn = el.activeVexflowNote;
                if (vfn === undefined) {
                    continue;
                }
                var nTicks = parseInt(vfn.ticks);
                var formatterNote = formatter.tContexts.map[String(nextTicks)];                
                nextTicks += nTicks;
                el.x = vfn.getAbsoluteX();
                // these are a bit hacky...
                el.systemIndex = s.renderOptions.systemIndex;
                
                //console.log(i + " " + el.x + " " + formatterNote.x + " " + noteOffsetLeft);
                if (formatterNote === undefined) {
                    continue;
                }
                
                el.width = formatterNote.width;         
                if (el.pitch != undefined) { // note only...
                    el.y = (stave.getBottomY() - (s.clef.firstLine - el.pitch.diatonicNoteNum) * 
                            stave.options.spacing_between_lines_px);
                    //console.log('Note DNN: ' + el.pitch.diatonicNoteNum + " ; y: " + el.y);
                }
            }
        }
        if (music21.debug) {
            for (var i = 0; i < s.length; i ++ ) {
                var n = s.get(i);
                if (n.pitch != undefined) {
                    console.log(n.pitch.diatonicNoteNum + " " + n.x + " " + (n.x + n.width));
                }
            }
        }
        s.storedVexflowStave = stave;
    };

    // end of define
    if (typeof(music21) != "undefined") {
        music21.vfShow = vfShow;
    }       
    return vfShow;
});
