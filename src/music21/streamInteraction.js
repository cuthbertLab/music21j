define(['music21/common','music21/stream', 'jquery'], function(common, stream, $) { 
    var streamInteraction = {};
    
    streamInteraction.ScrollPlayer = function (s, c) {
        this.pixelMapper = new streamInteraction.PixelMapper(s);
        this.stream = s;
        this.canvas = c;
        this.tempo = s.tempo;
        this.lastX = 0;
        this.lastNoteIndex = -1;
        this.barDOM = undefined;
        this.svgDOM = undefined;
        this.canvasParent = undefined;
        this.lastTimeout = undefined;
        this.startTime = new Date().getTime();
        this.previousSystemIndex = 0;
        this.eachSystemHeight = 120;
        this.timingMS = 50;
        this.savedRenderOptionClick = undefined;
        
        this.scrollScore = (function () {
            var timeSinceStartInMS = new Date().getTime() - this.startTime;
            var offset = timeSinceStartInMS/1000 * this.tempo/60;
            var pm = this.pixelMapper;
            var systemIndex = pm.getSystemIndexAtOffset(offset);
            
            if (systemIndex > this.previousSystemIndex) {
                this.lastX = -100;
                this.previousSystemIndex = systemIndex;
                this.barDOM.setAttribute('y', systemIndex * this.eachSystemHeight);
            }
            var x = pm.getXAtOffset(offset);
            x = Math.floor(x);
            
            //console.log(x);
            
            if (x > this.lastX) {
                this.barDOM.setAttribute('x', x);
                this.lastX = x;    
            }
            // pm is a pixelMap not a Stream
            for (var j = 0; j < pm.allMaps.length; j++) {
                var pmOff = pm.allMaps[j].offset;
                if (j <= this.lastNoteIndex)  {
                    continue;
                } else if (Math.abs(offset - pmOff) > .1) {
                    continue;
                }
                var elList = pm.allMaps[j].elements;
                for (var elIndex = 0; elIndex < elList.length; elIndex++) {
                    var el = elList[elIndex];
                    if (el !== undefined && el.playMidi !== undefined) {
                        el.playMidi(this.tempo);
                    }
                }
                this.lastNoteIndex = j;
                
            }
            //console.log(x, offset);
            //console.log(barDOM.setAttribute);
            var newTimeout = undefined;
            if (x < pm.maxX || systemIndex < pm.maxSystemIndex ) {
                //console.log(x, pm.maxX);
                newTimeout = setTimeout( this.scrollScore, this.timingMS);                  
                this.lastTimeout = newTimeout;
            } else {
                var fauxEvent = undefined;
                this.stopPlaying(fauxEvent);
            }
        }).bind(this);
    };
        
    streamInteraction.ScrollPlayer.prototype.createScrollBar = function () {
        var canvas = this.canvas;
        var svgDOM = common.makeSVGright('svg', {
            'height': canvas.height.toString() +'px',
            'width': canvas.width.toString() + 'px',
            'style': 'position:absolute; top: 0px; left: 0px;',
        });
        var scaleY = this.stream.renderOptions.scaleFactor.y;        
        var eachSystemHeight = canvas.height / (scaleY * (this.pixelMapper.maxSystemIndex + 1));
        var barDOM = common.makeSVGright('rect', {
            width: 10, 
            height: eachSystemHeight - 6,  // small fudge for separation
            x: this.pixelMapper.startX, 
            y: 3,
            style: 'fill: rgba(255, 255, 20, .5);stroke:white',    
        } );
        barDOM.setAttribute("transform", "scale(" + scaleY  + ")");        
        svgDOM.appendChild(barDOM);
  
        var canvasParent = $(canvas).parent()[0];
        canvasParent.appendChild(svgDOM);
        this.barDOM = barDOM;
        this.svgDOM = svgDOM;
        this.canvasParent = canvasParent;
        this.eachSystemHeight = eachSystemHeight;
        return barDOM;
    };
    streamInteraction.ScrollPlayer.prototype.startPlaying = function () {
        this.createScrollBar();
        
        this.savedRenderOptionClick = this.stream.renderOptions.events.click;
        this.stream.renderOptions.events.click = (function (e) { this.stopPlaying(e); }).bind(this);
        this.stream.setRenderInteraction(this.canvasParent);
        this.scrollScore(); 
    };
    streamInteraction.ScrollPlayer.prototype.stopPlaying = function (event) {
        this.stream.renderOptions.events.click = this.savedRenderOptionClick;
        this.barDOM.setAttribute('style', 'display:none');
        // TODO: generalize...
        this.canvasParent.removeChild(this.svgDOM);
        if (this.lastTimeout !== undefined) {
            clearTimeout(this.lastTimeout);
        }
        this.stream.setRenderInteraction(this.canvasParent);
        if (event !== undefined) {
            event.stopPropagation();
        }
    };
    

    /**
     * a PixelMapper is an object that knows how to map offsets to pixels on a flat Stream.
     */
    streamInteraction.PixelMapper = function (s) {
        this.allMaps = [];
        this.stream = s;
        this.notesAndRests = this.stream.flat.notesAndRests;
        this.pixelScaling = s.renderOptions.scaleFactor.x;
        
        Object.defineProperties(this, {
            'startX': {
                enumerable: true,
                configurable: false,
                get: function () {
                    return this.allMaps[0].x;
                },
            },
            'maxX': {
               enumerable: true,
               configurable: false,
               get: function () {                    
                   var m = this.allMaps[this.allMaps.length - 1];
                   return m.x;
               },
            },
            'maxSystemIndex': {
                enumerable: true,
                configurable: false,
                get: function () { 
                    return this.allMaps[this.allMaps.length - 1].systemIndex; 
                },
             },
        });
        this.processStream(s);
    };
    
    streamInteraction.PixelMapper.prototype.processStream = function () {
        var ns = this.notesAndRests;
        for (var i = 0; i < ns.length; i++) {
            var n = ns.get(i);
            this.addNoteToMap(n);
        }
        // prepare final map.
        var finalStave =  ns.get(-1).activeVexflowNote.stave;                    
        var finalX = (finalStave.x + finalStave.width);
        var endOffset = ns.get(-1).duration.quarterLength + ns.get(-1).offset;
        
        var lastMap = new streamInteraction.PixelMap(this, endOffset);        
        lastMap.elements = [undefined];
        lastMap.x = finalX;
        lastMap.systemIndex = this.allMaps[this.allMaps.length - 1].systemIndex;
        this.allMaps.push(lastMap);
        return this.allMaps;            
    };     
    
    streamInteraction.PixelMapper.prototype.addNoteToMap = function (n) {
        var currentOffset = n.offset;
        var properMap = this.findMapForExactOffset(currentOffset);
        if (properMap !== undefined) {
            properMap.elements.push(n);
        } else {
            var map = new streamInteraction.PixelMap(this, currentOffset);
            map.elements = [n];
            this.allMaps.push(map);            
        }
    };

    streamInteraction.PixelMapper.prototype.findMapForExactOffset = function (o) {
        for (var j = this.allMaps.length - 1; j >= 0; j = j - 1) {
            // find the last map with this offset. searches backwards for speed.
            if (this.allMaps[j].offset == o) {
                return this.allMaps[j];
            }
        }
        return undefined;
    };
    
    /**
     *  returns an array of two pixel maps: the previous/current one and the
        next/current one (i.e., if the offset is exactly the offset of a pixel map
        the prevNoteMap and nextNoteMap will be the same; similarly if the offset is
        beyond the end of the score)
     * @param {number} offset
     * @returns {Array<object>}
     */
    streamInteraction.PixelMapper.prototype.getPixelMapsAroundOffset = function(offset) {
        var prevNoteMap = undefined;
        var nextNoteMap = undefined;
        for (var i = 0; i < this.allMaps.length; i++) {
            thisMap = this.allMaps[i];
            if (thisMap.offset <= offset) {
                prevNoteMap = thisMap;
            } 
            if (thisMap.offset >= offset ) {
                nextNoteMap = thisMap;
                break;
            }
        }
        if (prevNoteMap === undefined && nextNoteMap === undefined) {
            var lastNoteMap = this.allMaps[this.allMaps.length - 1];
            prevNoteMap = lastNoteMap;
            nextNoteMap = lastNoteMap;
        } else if (prevNoteMap === undefined) {
            prevNoteMap = nextNoteMap;
        } else if (nextNoteMap === undefined) {
            nextNoteMap = prevNoteMap;
        }
        return [prevNoteMap, nextNoteMap];
    };
    /**
     * Uses the stored offsetToPixelMaps to get the pixel X for the offset.
     * 
     * @param {number} offset
     * @param {Array<object>} offsetToPixelMaps
     * @returns {number}
     */
    streamInteraction.PixelMapper.prototype.getXAtOffset = function(offset) {
        // returns the proper 
        var twoNoteMaps = this.getPixelMapsAroundOffset(offset);
        var prevNoteMap = twoNoteMaps[0];
        var nextNoteMap = twoNoteMaps[1];
        var pixelScaling = this.pixelScaling;
        var offsetFromPrev = offset - prevNoteMap.offset;
        var offsetDistance = nextNoteMap.offset - prevNoteMap.offset;
        var pixelDistance = nextNoteMap.x - prevNoteMap.x;       
        if (nextNoteMap.systemIndex != prevNoteMap.systemIndex) {
            var stave = prevNoteMap.elements[0].activeVexflowNote.stave;                    
            pixelDistance = (stave.x + stave.width) * pixelScaling - prevNoteMap.x;
        } 
        var offsetToPixelScale = 0;
        if (offsetDistance != 0) {
            offsetToPixelScale = pixelDistance/offsetDistance;                    
        } else {
            offsetToPixelScale = 0;   
        }
        var pixelsFromPrev = offsetFromPrev * offsetToPixelScale;
        var offsetX = prevNoteMap.x + pixelsFromPrev;
        return offsetX / pixelScaling;
    };

    /**
     * Uses the stored offsetToPixelMaps to get the systemIndex active at the current time.
     * 
     * @param {number} offset
     * @returns {number}
     */
    streamInteraction.PixelMapper.prototype.getSystemIndexAtOffset = function (offset) {
        var twoNoteMaps = this.getPixelMapsAroundOffset(offset);
        var prevNoteMap = twoNoteMaps[0];
        return prevNoteMap.systemIndex;
    };
    
    
    
    /*  PIXEL MAP */
    
    /**
     * A PixelMap maps one offset to one x location.
     */
    streamInteraction.PixelMap = function (mapper, offset) {
        this.pixelScaling = mapper.pixelScaling; // should be a Weakref...
        this.elements = [];
        this.offset = offset; // important
        this._x = undefined;
        this._systemIndex = undefined;
        
        Object.defineProperties(this, {
            'x': {
               enumerable: true,
               configurable: true,
               get: function() {
                   if (this._x !== undefined) {
                       return this._x;
                   } else {
                       if (this.elements.length == 0) {
                           return 0; // error!
                       } else {
                           return this.elements[0].x * this.pixelScaling;
                       }
                   }
               },
               set: function(x) { this._x = x; },
            },
            'systemIndex': {
                enumerable: true,
                configurable: true,
                get: function() {
                    if (this._systemIndex !== undefined) {
                        return this._systemIndex;
                    } else {
                        if (this.elements.length == 0) {
                            return 0; // error!
                        } else {
                            return this.elements[0].systemIndex;
                        }
                    }
                },
                set: function(systemIndex) { this._systemIndex = systemIndex; },
             },
             
        });
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.streamInteraction = streamInteraction;
    }       
    return streamInteraction;
});
