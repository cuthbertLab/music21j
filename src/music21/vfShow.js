define(['vexflow'], function(require) {
    var vfShow = {}; 
    
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
        this.measureStackVoices = []; // an Array of Array of vexflow voices
        this.measureStackStreams = []; // an Array of Array of Streams (usually Measures);
        //this.measureFormatters = [];
        
        Object.defineProperties(this, {
           'vfRenderer': { 
               get: function () { 
                       if (this._vfRenderer !== undefined) {
                           return this._vfRenderer;
                       } else {
                           this._vfRenderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
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
        
        
        this.render = function (s) {
            canvas = this.canvas;
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
                this.prepareFlat(s);
            }
            this.formatMeasureStacks();
            this.drawMeasureStacks();
            this.drawBeamGroups();
        };

        this.prepareScorelike = function (s) {
            //console.log('prepareScorelike called');
            for (var i = 0; i < s.length; i++) {
                var subStream = s.get(i);
                this.preparePartlike(subStream);
            }
            this.addStaffConnectors(s);                
        };
        
        this.preparePartlike = function (p) {
            //console.log('preparePartlike called');
            for (var i = 0; i < p.length; i++) {
                var subStream = p.get(i);
                if (i == p.length - 1) {
                    subStream.renderOptions.rightBarline = 'end';
                }                
                voice = this.prepareFlat(subStream);
                if (this.measureStackVoices[i] === undefined) {
                    // firstPart
                    this.measureStackVoices[i] = [];
                    this.measureStackStreams[i] = [];
                }
                this.measureStackVoices[i].push(voice);
                this.measureStackStreams[i].push(subStream);
            }    
        };
        this.prepareFlat = function (m) {
            m.makeAccidentals();
            var stave = this.renderStave(m);
            m.activeVFStave = stave;
            var voice = this.getVoice(m, stave);
            //this.renderNotes(m, stave);
            return voice;
        };
        
        this.renderStave = function (m) {   
            //console.log('renderNotes called on ', m);
            if (m === undefined) {
                m = this.stream;
            }
            var ctx = this.ctx;
            // stave will be passed in from Measure when we have Voices 
            var stave = this.newStave(m);

            this.setClefEtc(m, stave);
            stave.setContext(ctx);
            stave.draw();
            return stave;
        };
        
        this.getVoice = function (m, stave) {
            // gets a group of notes as a voice, but completely unformatted and not drawn.
            var notes = this.vexflowNotes(m, stave);
            var voice = this.vexflowVoice(m);
            voice.setStave(stave);
            voice.addTickables(notes);
            return voice;
        };
        
        this.drawMeasureStacks = function () {
            var ctx = this.ctx;
            for (var i = 0; i < this.measureStackVoices.length; i++) {
                var voices = this.measureStackVoices[i];
                for (var j = 0; j < voices.length; j++ ) {
                    var v = voices[j];
                    v.draw(ctx);
                }
            }
        };
        this.formatMeasureStacks = function () {
            for (var i = 0; i < this.measureStackVoices.length; i++) {
                var voices = this.measureStackVoices[i];
                var measures = this.measureStackStreams[i];
                var autoBeam = measures[0].autoBeam;
                var formatter = this.formatVoiceGroup(voices, autoBeam);
                for (var j = 0; j < measures.length; j++ ) {
                    var m = measures[j];
                    var v = voices[j];
                    this.applyFormatterInformationToNotes(v.stave, m, formatter);
                }
            }
        };
        this.formatVoiceGroup = function (voices, autoBeam) {
            // formats a group of voices to use the same formatter; returns the formatter
            // if autoBeam is true then it will apply beams for each voice and put them in
            // this.beamGroups;
            var formatter = new Vex.Flow.Formatter();
            if (voices.length == 0) {
                return formatter;
            }
            var stave = voices[0].stave; // all staves should be same length, so does not matter;
            formatter.joinVoices(voices);
            formatter.formatToStave(voices, stave);
            if (autoBeam) {
                for (var i = 0; i < voices.length; i++) {
                    // find beam groups -- n.b. this wipes out stem direction and
                    //      screws up middle line stems -- worth it for now.
                    var voice = voices[i];
                    var beamGroups = Vex.Flow.Beam.applyAndGetBeams(voice);
                    this.beamGroups.push.apply(this.beamGroups, beamGroups);                    
                }
            }
            return formatter;
        };
        this.renderNotes = function (m, stave) {
            // add notes...
            var voice = this.getVoice(m, stave);
                
            var formatter = this.formatVoiceGroup([voice], m.autoBeam); 
            var ctx = this.ctx;
            voice.draw(ctx);

            this.applyFormatterInformationToNotes(stave, m, formatter);

            //console.log(stave.start_x + " -- stave startx");
            //console.log(stave.glyph_start_x + " -- stave glyph startx");
            return stave;
        };
        this.drawBeamGroups = function () {
            var ctx = this.ctx;
            // draw beams
            
            for(var i = 0; i < this.beamGroups.length; i++){
                 this.beamGroups[i].setContext(ctx).draw();
            }
        };
        this.applyFormatterInformationToNotes = function (stave, s, formatter) {
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
                    //console.log(i + " " + el.x + " " + formatterNote.x + " " + noteOffsetLeft);
                    if (formatterNote === undefined) {
                        continue;
                    }
                    
                    el.width = formatterNote.width;         
                    if (el.pitch != undefined) { // note only...
                        el.y = stave.getBottomY() - (s.clef.firstLine - el.pitch.diatonicNoteNum) * stave.options.spacing_between_lines_px;
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
        
        this.newStave = function (s) {
            if (s === undefined) {
                s = this.stream;
            }
            var rendOp = s.renderOptions;
            // measure level...
            var width = rendOp.width;
            if (width == undefined) {
                width = s.estimateStaffLength() + rendOp.staffPadding;
            }
            var top = rendOp.top;
            if (top == undefined) {
                top = 0;
            }
            var left = rendOp.left;
            if (left == undefined) {
                left = 10;
            }
            //console.log('streamLength: ' + streamLength);
            var stave = new Vex.Flow.Stave(left, top, width);
            return stave;
        };
        
        this.setClefEtc = function (s, stave) {
            var rendOp = s.renderOptions;
            this.setStafflines(s, stave);
            if (rendOp.showMeasureNumber) {
                stave.setMeasure(rendOp.measureIndex + 1);
            }
            if (rendOp.displayClef) {
                stave.addClef(s.clef.name);
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
        this.setStafflines = function(s, stave) {
            var rendOp = s.renderOptions;
            rendOp.vexflowRenderStafflines(stave);                
        };
        this.vexflowNotes = function (s, stave) {
            var notes = [];
            for (var i = 0; i < s.length; i++) {
                var thisEl = s.get(i);
                if (thisEl.isClassOrSubclass('GeneralNote') && (thisEl.duration !== undefined)) {
                    var tn = thisEl.vexflowNote(s.clef);
                    if (stave !== undefined) {
                        tn.setStave(stave);
                    }
                    notes.push(tn);
                }
            }
            return notes;
        };
        this.vexflowVoice = function (s) {
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
            var vfv = new Vex.Flow.Voice({ num_beats: numSixteenths,
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
        this.staffConnectorsMap = {
                'brace': Vex.Flow.StaveConnector.type.BRACE, 
                'single': Vex.Flow.StaveConnector.type.SINGLE, 
                'double': Vex.Flow.StaveConnector.type.DOUBLE, 
                'bracket': Vex.Flow.StaveConnector.type.BRACKET, 
        };
        
        this.addStaffConnectors = function (s) {
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
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.vfShow = vfShow;
    }       
    return vfShow;
});
