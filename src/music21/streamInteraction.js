import { $ } from 'jquery';
import { common } from './common';
import { stream } from './stream';

        /**
         * module with tools for working with Streams. See {@link music21.streamInteraction} namespace.
         * 
         * @exports music21/streamInteraction
         */        
    /**
     * Objects that work with Streams to provide interactions
     * 
     * @namespace music21.streamInteraction
     * @memberof music21
     * @requires music21/common
     * @requires music21/stream
     */
export    var streamInteraction = {};
    
    /**
     * Object for adding scrolling while playing.
     * 
     * @class ScrollPlayer
     * @memberof music21.streamInteraction
     * @param {music21.stream.Stream} s -- Stream
     * @param {canvas} c -- canvas
     * @property {music21.streamInteraction.PixelMapper} pixelMapper - an object that can map current pixel to notes and vice versa.
     * @property {number} [tempo=s.tempo]
     * @property {number} lastX - last X value
     * @property {Int} lastNoteIndex - index of last note played
     * @property {SVGDOMObject} barDOM - DOM object representing the scrolling bar
     * @property {SVGDOMObject} svgDOM - DOM object holding the scrolling bar (overlaid on top of canvas)
     * @property {DOMObject} canvasParent - the parent DOM object for `this.canvas`
     * @property {Int} lastTimeout - a numerical reference to a timeout object created by `setTimeout`
     * @property {number} startTime - the time in ms when the scrolling started
     * @property {Int} [previousSystemIndex=0] - the last systemIndex being scrolled
     * @property {number} [eachSystemHeight=120] - currently all systems need to have the same height.
     * @property {Int} [timingMS=50] - amount of time between polls to scroll
     * @property {function} savedRenderOptionClick - starting ScrollPlayer overrides the `'click'` event for the stream, switching it to Stop. this saves it for restoring later.
     */
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
        
        
        /**
         * function, bound to `this` to scroll the barDOM.
         * 
         * calls itself until a stop click is received or the piece ends.
         * 
         * @method streamInteraction.ScrollPlayer#scrollScore
         * @memberof music21.streamInteraction.ScrollPlayer
         */
        this.scrollScore = (function () {
            var timeSinceStartInMS = new Date().getTime() - this.startTime;
            var offset = timeSinceStartInMS/1000 * this.tempo/60;
            var pm = this.pixelMapper;
            var systemIndex = pm.getSystemIndexAtOffset(offset);
            
            if (systemIndex > this.previousSystemIndex) {
                this.lastX = -100; // arbitrary negative...
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
    
    /**
     * Create the scrollbar (barDOM), the svg to place it in (svgDOM)
     * and append it over the stream.
     * 
     * Sets as a consequence:
     * - this.barDOM
     * - this.svgDOM
     * - this.eachSystemHeight
     * - this.canvasParent
     * 
     * @memberof music21.streamInteraction.ScrollPlayer
     * @returns {SVGDOMObject} scroll bar
     */
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
    
    /**
     * start playing! Create a scroll bar and start scrolling
     * 
     * (set this to an event on stream, or something...)
     * 
     * currently called from {@link music21.stream.Stream#scrollScoreStart} via
     * {@link music21.stream.Stream#renderScrollableCanvas}. Will change.
     * 
     * @memberof music21.streamInteraction.ScrollPlayer
     */
    streamInteraction.ScrollPlayer.prototype.startPlaying = function () {
        this.createScrollBar();
        
        this.savedRenderOptionClick = this.stream.renderOptions.events.click;
        this.stream.renderOptions.events.click = (function (e) { this.stopPlaying(e); }).bind(this);
        this.stream.setRenderInteraction(this.canvasParent);
        this.scrollScore(); 
    };

    /**
     * Called when the ScrollPlayer should stop playing
     * 
     * @memberof music21.streamInteraction.ScrollPlayer
     * @param {DOMEvent} [event]
     */
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
     * A `PixelMapper` is an object that knows how to map offsets to pixels on a flat Stream.
     * 
     * Helper for ScrollPlayer and soon other places...
     * 
     * @class PixelMapper
     * @memberof music21.streamInteraction
     * @param {music21.stream.Stream} s - stream object
     * @property {Array<music21.streamInteraction.PixelMap>} allMaps - a `PixelMap` object for each offset in the Stream and one additional one for the end of the Stream.
     * @property {music21.stream.Stream} s - stream object
     * @property {music21.stream.Stream} notesAndRests - `this.stream.flat.notesAndRests`
     * @property {number} pixelScaling - `this.stream.renderOptions.scaleFactor.x`
     * @property {number} startX - (readonly) starting x
     * @property {number} maxX - (readonly) ending x
     * @property {Int} maxSystemIndex - the index of the last system.
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
    
    /**
     * Creates `PixelMap` objects for every note in the stream, and an extra
     * one mapping the end of the final offset.
     * 
     * @memberof music21.streamInteraction.PixelMapper
     * @returns {Array<music21.streamInteraction.PixelMap>}
     */
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

    /**
     * Adds a {@link music21.base.Music21Object}, usually a {@link music21.note.Note} object,
     * to the maps for the PixelMapper if a {@link music21.streamInteraction.PixelMap} object
     * already exists at that location, or creates a new `PixelMap` if one does not exist.
     * 
     * @memberof music21.streamInteraction.PixelMapper
     * @param {music21.base.Music21Object} n - note or other object
     * @returns {music21.streamInteraction.PixelMap} PixelMap added to.
     */
    streamInteraction.PixelMapper.prototype.addNoteToMap = function (n) {
        var currentOffset = n.offset;
        var properMap = this.findMapForExactOffset(currentOffset);
        if (properMap !== undefined) {
            properMap.elements.push(n);
            return properMap;
        } else {
            var map = new streamInteraction.PixelMap(this, currentOffset);
            map.elements = [n];
            this.allMaps.push(map);            
            return map;
        }
    };
    /**
     * Finds a `PixelMap` object if one matches this exact offset. Otherwise returns undefined
     * 
     * @memberof music21.streamInteraction.PixelMapper
     * @param {number} o offset
     * @returns {music21.streamInteraction.PixelMap|undefined}
     */
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

     * @memberof music21.streamInteraction.PixelMapper
     * @param {number} offset
     * @returns {Array<music21.streamInteraction.PixelMap|undefined>} returns two PixelMaps; or either (but not both) can be undefined
     * @example
     * var s = new music21.tinyNotation.TinyNotation('3/4 c4 d8 e f4 g4 a4 b4');
     * var can = s.appendNewCanvas();
     * var pm = new music21.streamInteraction.PixelMapper(s);
     * var pmaps = pm.getPixelMapsAropundOffset(1.25);
     * var prev = pmaps[0];
     * var next = pmaps[1];
     * prev.offset
     * // 1
     * next.offset
     * // 1.5
     * prev.x
     * // 97...
     * next.x
     * // 123...
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
     * @memberof music21.streamInteraction.PixelMapper
     * @param {number} offset
     * @param {Array<music21.streamInteraction.PixelMap>} offsetToPixelMaps
     * @returns {number}
     * @example
     * var s = new music21.tinyNotation.TinyNotation('3/4 c4 d8 e f4 g4 a4 b4');
     * var can = s.appendNewCanvas();
     * var pm = new music21.streamInteraction.PixelMapper(s);
     * pm.getXAtOffset(0.0); // exact placement of a note
     * // 89.94...
     * pm.getXAtOffset(0.5); // between two notes
     * // 138.63...
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
     * @memberof music21.streamInteraction.PixelMapper
     * @param {number} offset
     * @returns {number} systemIndex of the offset
     */
    streamInteraction.PixelMapper.prototype.getSystemIndexAtOffset = function (offset) {
        var twoNoteMaps = this.getPixelMapsAroundOffset(offset);
        var prevNoteMap = twoNoteMaps[0];
        return prevNoteMap.systemIndex;
    };
    
    
    
    /*  PIXEL MAP */
    
    /**
     * A PixelMap maps one offset to one x location.
     * 
     * The offset does NOT have to be the offset of an element. Offsets are generally
     * measured from the start of the flat stream.
     * 
     * @class PixelMap
     * @memberof music21.streamInteraction
     * @param {music21.streamInteraction.PixelMapper} mapper - should eventually be a weakref...
     * @param {number} offset - the offset that is being mapped.
     * @property {Array<music21.base.Music21Object>} elements -- elements being mapped to.
     * @property {number} offset - the offset inputted
     * @property {number} x - x value in pixels for this offset 
     * @property {Int} systemIndex - the systemIndex at which this offset appears.
     * @example
     * // not a particularly realistic example, since it requires so much setup...
     * var s = new music21.tinyNotation.TinyNotation('3/4 c4 d8 e f4 g4 a4 b4');
     * var can = s.appendNewCanvas();
     * var pmapper = new music21.streamInteraction.PixelMapper(s);
     * var pmapA = new music21.streamInteraction.PixelMap(pmapper, 2.0);
     * pmapA.elements = [s.flat.get(3)];
     * pmapA.offset;
     * // 2
     * pmapA.x;
     * // 149.32...
     * pmapA.systemIndex
     * // 0
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
    
    
    /*  NOT DONE YET */
    streamInteraction.CursorSelect = function (s) {
        this.stream = s;
        this.activeElementHierarchy = [undefined];        
    };
    
