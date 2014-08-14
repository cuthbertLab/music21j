define(['music21/common'], function(common) {
    var widgets = {};
    widgets.RhythmChooser = function (s, c) {
        this.stream = s;
        this.canvasDiv = c;
        this.values = ['whole', 'half','quarter','eighth','16th','dot','undo'];
        if (this.stream.hasSubStreams()) {
            this.measureMode = true;
        } else {
            this.measureMode = false;
        }
        this.tieActive = false;
        this.autoAddMeasure = true;
        this.buttonHandlers = {
            'undo': function (t) {
                if (this.stream.length > 0) {
                    return this.stream.pop();                        
                } else { return ; }
            },
            'dot': function (t) {
                if (this.stream.length > 0) {
                    var el = this.stream.pop();
                    el.duration.dots += 1;
                    this.stream.append(el);
                    return el;
                } else { return ; }
            },
            'tie': function (t) {
                if (this.stream.length > 0) {
                    var el = this.stream.get(-1);
                    el.tie = new music21.tie.Tie('start');
                    this.tieActive = true;
                }
            },
            'default': function (t) {
                var newN = new music21.note.Note('B4');
                newN.stemDirection = 'up';
                newN.duration.type = t;
                if (this.tieActive) {
                    newN.tie = new music21.tie.Tie('stop');
                    this.tieActive = false;
                }
                this.stream.append(newN);
                return newN;
            },
        };
        this.measureButtonHandlers = {
            'undo': function (t) {
                if (this.stream.length > 0) {
                    var lastMeasure = this.stream.get(-1);
                    lastMeasure.pop();
                    if (lastMeasure.length == 0) {
                        this.stream.pop();
                    }
                } else { return ; }
            },
            'dot': function (t) {
                if (this.stream.length > 0) {
                    var lastMeasure = this.stream.get(-1);                            
                    var el = lastMeasure.pop();
                    el.duration.dots += 1;
                    lastMeasure.append(el);
                    return el;
                } else { return ; }
            },
            'addMeasure': function (t) {
                var lastMeasure = this.stream.get(-1);
                var m = new music21.stream.Measure();
                m.renderOptions.staffLines = lastMeasure.renderOptions.staffLines;
                m.renderOptions.measureIndex = lastMeasure.renderOptions.measureIndex + 1;
                m.renderOptions.rightBarline = "end";
                lastMeasure.renderOptions.rightBarline = "single";
                m.autoBeam = lastMeasure.autoBeam;
                this.stream.append( m );                        
            },
            'tie': function (t) {
                var lastMeasure = this.stream.get(-1);
                var el = undefined;
                if (lastMeasure.length > 0) {
                    el = lastMeasure.get(-1);
                } else {
                    var previousMeasure = this.stream.get(-2);
                    if (previousMeasure) {
                        el = previousMeasure.get(-1);
                    }
                }
                if (el !== undefined) {
                    var tieType = 'start';
                    if (el.tie !== undefined) { tieType = 'continue'; }
                    el.tie = new music21.tie.Tie(tieType);     
                    this.tieActive = true;
                }
  
            },
            'default': function (t) {
                var newN = new music21.note.Note('B4');
                newN.stemDirection = 'up';
                newN.duration.type = t;
                if (this.tieActive) {
                    newN.tie = new music21.tie.Tie('stop');
                    this.tieActive = false;
                }
                var lastMeasure = this.stream.get(-1);
                if (this.autoAddMeasure && 
                        lastMeasure.duration.quarterLength >= 
                            this.stream.timeSignature.barDuration.quarterLength) {
                    this.measureButtonHandlers['addMeasure'].apply(this, [t]);
                    lastMeasure = this.stream.get(-1);
                }
                lastMeasure.append(newN);
                return newN;
            },
        };
    };
    
    widgets.RhythmChooser.prototype.valueMappings = {
        whole: '&#xE1D2;',
        half: '&#xE1D3;',
        quarter: '&#xE1D5;',
        eighth: '&#xE1D7;',
        '16th': '&#xE1D9;',
        '32nd': '&#xE1DB;', // BUG in Bravura Text
        addMeasure: '<span style="position: relative; top: -20px">&#xE031</span>',
        dot: '&middot;',
        undo: '&#x232B;',
        tie: '<span style="position: relative; top: -20px;">&#xE1FD</span>',
    };
    widgets.RhythmChooser.prototype.styles = {
        'undo': 'font-family: serif; font-size: 30pt; top: -22px',
    };
            
    widgets.RhythmChooser.prototype.addDiv = function (where) {
        var $where = where;
        if (where === undefined) {
            $where = $(document.body);
        } else if (where.jquery === undefined) {
            $where = $(where);
        }
        var $outer = $('<div class="rhythmButtonDiv" style="font-size: 40pt; width: 100%; text-align: center;"/>');
        for (var i = 0; i < this.values.length; i++) {
            var value = this.values[i];
            var entity = this.valueMappings[value];
            var $inner = $('<div class="btButton" m21Type="' + value + '">' + entity + '</div>');
            if (this.styles[value] !== undefined) {
                $inner.attr('style', this.styles[value]);
            }
            $inner.click( (function(value) { this.handleButton(value); }).bind(this, value) );
            $outer.append($inner);
        }
        $where.append($outer);
        return $outer;
    };
    widgets.RhythmChooser.prototype.handleButton = function (t) {
        var bhs = this.buttonHandlers;
        if (this.measureMode) {
            bhs = this.measureButtonHandlers;
        }
        var bh = bhs[t];
        if (bh === undefined) { bh = bhs['default']; }
        bh.apply(this, [t]);
        this.stream.replaceCanvas(this.canvasDiv);
    };            
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.widgets = widgets;
    }       
    return widgets;
});
