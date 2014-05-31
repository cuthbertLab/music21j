/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/keyboard -- PianoKeyboard rendering and display objects
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

// Minimum usage:

// var kd = document.getElementById('keyboardDiv');
// k = new music21.keyboard.Keyboard();
// k.appendKeyboard(kd, 6, 57); // 88 key keyboard

// configurable:
// k.scaleFactor = 1.2;  // default 1
// k.whiteKeyWidth = 40; // default 23


define(['music21/base', 'music21/pitch', 'loadMIDI', 'jquery'], function(require) {
    var keyboard = {};
    
    keyboard.Key = function () {
        this.classes = ['Key']; // name conflict with key.Key
        this.callbacks = [];
        this.scaleFactor = 1;
        this.parent = undefined;
        this.id = 0;
        this.pitchObj = undefined;
        this.svgObj = undefined;        
        
        this.makeKey = function (startX) {
            keyattrs = {
                    style: this.keyStyle,
                    x: startX,
                    y: 0,
                    'class': 'keyboardkey ' + this.keyClass,
                    'id': this.id,
                    width: this.width * this.scaleFactor,
                    height: this.height * this.scaleFactor,
                };
            var keyDOM = music21.keyboard.makeSVGright('rect', keyattrs);
            for (var x in this.callbacks) {
                keyDOM.addEventListener(x, this.callbacks[x], false);
            }
            this.svgObj = keyDOM;
            return keyDOM;
        };
        this.addCircle = function (strokeColor) {
            if ((this.svgObj === undefined) ||
                (this.parent === undefined) ||
                (this.parent.svgObj === undefined)
                    ) {
                return;
            }
            if (strokeColor === undefined) {
                strokeColor = 'red';
            }
            var x = parseInt(this.svgObj.getAttribute('x'));
            var cx = x + (this.width)/2;
            //console.log('cx', cx);
            keyattrs = {
                    stroke: strokeColor,
                    'stroke-width': 3,
                    fill: 'none',
                    cx: cx,
                    cy: this.height - 10,
                    'class': 'keyboardkeyannotation',
                    r: this.width/4,
                };
            
            var circleDom = music21.keyboard.makeSVGright('circle', keyattrs);
            this.parent.svgObj.appendChild(circleDom);
            //console.log(circleDom);
            return circleDom;
        };
        this.addNoteName = function (labelOctaves) {
            if ((this.svgObj === undefined) ||
                    (this.parent === undefined) ||
                    (this.parent.svgObj === undefined)
                        ) {
                    return;
                }
            if ((this.id == 0) && (this.pitchObj === undefined)) {
                return
            } else if (this.pitchObj === undefined) {
                this.pitchObj = new music21.pitch.Pitch();
                this.pitchObj.ps = this.id;
            }
            if ((this.pitchObj.accidental !== undefined) && 
                    (this.pitchObj.accidental.alter != 0)    ){
                    return;
                }
            var x = parseInt(this.svgObj.getAttribute('x'));
            var idStr = this.pitchObj.name;
            var fontSize = 14;
            if (labelOctaves == true) {
                idStr = this.pitchObj.nameWithOctave;
                fontSize = 12;
                x -= 2;
            }
            
            var textfill = 'white';
            if (this.keyClass == 'whitekey') {
                textfill = 'black';
            }
            textattrs = {
                    fill: textfill,
                    x: x + this.width/2 - 5,
                    y: this.height - 20,
                    'class': 'keyboardkeyname',
                    'font-size': fontSize,
                };
            
            var textDom = music21.keyboard.makeSVGright('text', textattrs);
            var textNode = document.createTextNode(idStr);
            textDom.appendChild(textNode);
            this.parent.svgObj.appendChild(textDom);

        };

    };
    keyboard.WhiteKey = function () {
        keyboard.Key.call(this);
        this.classes.push('WhiteKey');
        this.width = 23;
        this.height = 120;
        this.keyStyle = 'fill:#fffff6;stroke:black';
        this.keyClass = 'whitekey';
    };
    keyboard.WhiteKey.prototype = new keyboard.Key();
    keyboard.WhiteKey.prototype.constructor = keyboard.WhiteKey;

    keyboard.BlackKey = function () {
        keyboard.Key.call(this);
        this.classes.push('BlackKey');
        this.width = 13;
        this.height = 80;
        this.keyStyle = 'fill:black;stroke:black';
        this.keyClass = 'blackkey';
    };
    keyboard.BlackKey.prototype = new keyboard.Key();
    keyboard.BlackKey.prototype.constructor = keyboard.BlackKey;
    
    keyboard.Keyboard = function () {
       this.whiteKeyWidth = 23;
       this._defaultWhiteKeyWidth = 23;
       this._defaultBlackKeyWidth = 13;
       this.scaleFactor = 1;
       this.height = 120; // does nothing right now...
       this.keyObjects = {};
       this.svgObj = undefined;
       
       this.appendKeyboard = function(where, dnnStart, dnnEnd) {
           if (where === undefined) {
               where = document.body;
           } else if (where.jquery !== undefined) {
               where = where[0];
           }
           svgDOM = this.createSVG(dnnStart, dnnEnd);           
           where.appendChild(svgDOM);
       };
       this.callbacks = {
               click: this.clickhandler,
       };
       this.clickhandler = function (keyRect) {
           var id = keyRect.id;
           var thisKeyObject = this.keyObjects[id];
           if (thisKeyObject === undefined) {
               return; // not on keyboard;
           }
           var storedStyle = thisKeyObject.keyStyle;
           var fillColor = '#c0c000';
           if (thisKeyObject.keyClass == 'whitekey'){
               fillColor = 'yellow';    
           }
           keyRect.setAttribute("style", "fill:" + fillColor + ";stroke:black");
           music21.MIDI.loadSoundfont('acoustic_grand_piano', function() {
               music21.MIDI.noteOn(0, id, 100, 0);
               music21.MIDI.noteOff(0, id, 500);
           });
           setTimeout(function() { 
               keyRect.setAttribute("style", storedStyle);
           }, 500);
       };
       
       //   more accurate offsets from http://www.mathpages.com/home/kmath043.htm
       this.sharpOffsets = {0: 14.3333, 1: 18.6666, 3: 13.25, 4: 16.25, 5: 19.75};
       this.createSVG = function (dnnStart, dnnEnd) {
           // dnn = pitch.diatonicNoteNum;
           // dnnEnd = final key note. I.e., the last note to be included, not the first note not included.
           // 6, 57 gives a standard 88-key keyboard;
           if (dnnStart === undefined) {
               dnnStart = 29; // middle C
           }
           if (dnnEnd === undefined) {
               dnnEnd = dnnStart + 8;
           }
           var currentIndex = (dnnStart - 1) % 7; // C = 0
           var keyboardDiatonicLength = 1 + dnnEnd - dnnStart;
           var totalWidth = this.whiteKeyWidth * this.scaleFactor * keyboardDiatonicLength;
           var height = 120 * this.scaleFactor;
           var heightString = height.toString() + 'px';
           
           var svgDOM = music21.keyboard.makeSVGright('svg', {
               'xml:space': 'preserve',
               'height': heightString,
               'width': totalWidth.toString() + 'px',
           });
           var movingPitch = new music21.pitch.Pitch("C4");
           var blackKeys = [];
           var thisKeyboardObject = this;
           
           for (var wki = 0; wki < keyboardDiatonicLength; wki++) {
               movingPitch.diatonicNoteNum = dnnStart + wki;
               var wk = new music21.keyboard.WhiteKey();
               wk.id = movingPitch.midi;
               wk.parent = this;
               this.keyObjects[movingPitch.midi] = wk;
               wk.scaleFactor = this.scaleFactor;
               wk.width = this.whiteKeyWidth;
               wk.callbacks.click = function() { thisKeyboardObject.clickhandler(this); };
               
               var wkSVG = wk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki);
               svgDOM.appendChild(wkSVG);
               
               if (((currentIndex == 0) ||
                   (currentIndex == 1) ||
                   (currentIndex == 3) ||
                   (currentIndex == 4) ||
                   (currentIndex == 5)
                   ) && ( wki != keyboardDiatonicLength - 1)) {
                   var bk = new music21.keyboard.BlackKey();
                   bk.id = movingPitch.midi + 1;
                   this.keyObjects[movingPitch.midi + 1] = bk;
                   bk.parent = this;

                   bk.scaleFactor = this.scaleFactor;
                   bk.width = this._defaultBlackKeyWidth * this.whiteKeyWidth/this._defaultWhiteKeyWidth;
                   bk.callbacks.click = function() { thisKeyboardObject.clickhandler(this); };

                   var offsetFromWhiteKey = this.sharpOffsets[currentIndex];
                   offsetFromWhiteKey = this.whiteKeyWidth/this._defaultWhiteKeyWidth * this.scaleFactor * offsetFromWhiteKey;
                   var bkSVG = bk.makeKey(this.whiteKeyWidth * this.scaleFactor * wki + offsetFromWhiteKey);
                   blackKeys.push(bkSVG);
               }
               currentIndex += 1;
               currentIndex = currentIndex % 7;
           }
           // append blackkeys later since they overlap white keys;
           for (var bki = 0; bki < blackKeys.length; bki++) {
               svgDOM.appendChild(blackKeys[bki]);
           }
           this.svgObj = svgDOM;
           return svgDOM;
       };
       this.markMiddleC = function (strokeColor) {
           return this.keyObjects[60].addCircle('red');
       };
       this.markNoteNames = function (labelOctaves) {
           for (var midi in this.keyObjects) {
               var keyObj = this.keyObjects[midi];
               keyObj.addNoteName(labelOctaves);
           }
       };
    };
    keyboard.makeSVGright = function (tag, attrs) {
        // see http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        // normal JQuery does not work.
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.keyboard = keyboard;
    }       
    return keyboard;

});
