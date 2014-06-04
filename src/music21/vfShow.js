define(['vexflow'], function(require) {
    var vfShow = {}; 
    
    vfShow.Renderer = function (s, canvas, where) {
        this.stream = s;
        this.streamType = s.classes[-1];

        this.canvas = undefined;
        this.$canvas = undefined;
        this.$where = undefined;
        this.activeFormatter = undefined;
        this._vfRenderer = undefined;
        Object.defineProperties(this, {
           'vfRenderer': { 
               get: function () { 
                       if (this._vfRenderer !== undefined) {
                           return this._vfRenderer;
                       } else {
                           this._vfRenderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
                           return this._vfRenderer;
                       }
                   }
               },
               'set': function (vfr) { this._vfRenderer = vfr; },
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
        
        
        this.renderVexflowOnCanvas = function (s) {
            canvas = this.canvas;
            var renderer = this.vfRenderer;
            if (s === undefined) {
                s = this.stream;                
            }
            var hasSubStreams = s.hasSubStreams();
            if (hasSubStreams) {
                for (var i = 0; i < s.length; i++) {
                    var subStream = s.get(i);
                    if ('Measure' in subStream.classes) {
                        if (i == s.length - 1) {
                            subStream.renderOptions.rightBarline = 'end';
                        }
                    }
                    this.renderVexflowOnCanvas(subStream);
                }
            } else {
                s.makeAccidentals();
                var stave = this.renderVexflowNotesOnCanvas(s);
                s.activeVFStave = stave;
            }
            if (s.isClassOrSubclass('Score')) {
                s.addStaffConnectors(renderer);
            }
        };
        
        this.renderVexflowNotesOnCanvas = function (s) {     
            var renderer = this.vfRenderer;
            if (s === undefined) {
                s = this.stream;
            }
            var ctx = renderer.getContext();

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
            rendOp.vexflowRenderStafflines(stave);
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
            
            stave.setContext(ctx);
            stave.draw();

            // add notes...
            var notes = s.vexflowNotes();
            var voice = s.vexflowVoice();

            voice.addTickables(notes);
            
            // find beam groups -- n.b. this wipes out stem direction and
            //      screws up middle line stems -- worth it for now.
            var beamGroups = [];
            if (s.autoBeam) {
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
            this.applyFormatterInformationToNotes(stave, s);
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
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.vfShow = vfShow;
    }       
    return vfShow;
});
