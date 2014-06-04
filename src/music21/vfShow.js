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
                this.renderScorelike(s);
            } else if (isPartlike) {
                this.renderPartlike(s);
            } else {
                this.renderFlat(s);
            }
        };

        this.renderScorelike = function (s) {
            //console.log('renderScorelike called');
            for (var i = 0; i < s.length; i++) {
                var subStream = s.get(i);
                this.renderPartlike(subStream);
            }
            this.addStaffConnectors(s);                
        };
        
        this.renderPartlike = function (p) {
            //console.log('renderPartlike called');
            for (var i = 0; i < p.length; i++) {
                var subStream = p.get(i);
                if (i == p.length - 1) {
                    subStream.renderOptions.rightBarline = 'end';
                }                
                this.renderFlat(subStream);
            }                
        };
        this.renderFlat = function (m) {
            m.makeAccidentals();
            var stave = this.renderNotes(m);
            m.activeVFStave = stave;
        };
        
        this.renderNotes = function (m) {   
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

            // add notes...
            var notes = this.vexflowNotes(m, stave);
            var voice = this.vexflowVoice(m);
            voice.addTickables(notes);
            // find beam groups -- n.b. this wipes out stem direction and
            //      screws up middle line stems -- worth it for now.
            var beamGroups = [];
            if (m.autoBeam) {
                beamGroups = Vex.Flow.Beam.applyAndGetBeams(voice);
            } 
                
            var formatter = new Vex.Flow.Formatter();
            if (music21.debug) {
                console.log("Voice: ticksUsed: " + voice.ticksUsed + " totalTicks: " + voice.totalTicks);
            }
            //Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes);
            formatter.joinVoices([voice]);
            formatter.formatToStave([voice], stave);
            //formatter.format([voice], this.estimateStaffLength() );

            voice.draw(ctx, stave);

            // draw beams
            for(var i = 0; i < beamGroups.length; i++){
                 beamGroups[i].setContext(ctx).draw();
            }
            
            this.activeFormatter = formatter;
            this.applyFormatterInformationToNotes(stave, m);
            //console.log(stave.start_x + " -- stave startx");
            //console.log(stave.glyph_start_x + " -- stave glyph startx");
            return stave;
        };
        this.applyFormatterInformationToNotes = function (stave, s) {
            // mad props to our friend Vladimir Viro for figuring this out!
            // visit http://peachnote.com/
            if (s === undefined) {
                s = this.stream;
            }
            var formatter = this.activeFormatter;
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
            //alert(numSixteenths + " " + beatValue);
            //console.log('voice created');
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
            if (!(s.isClassOrSubclass('Score'))) {
                return;
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
                        sc.setContext(this.ctx)
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
