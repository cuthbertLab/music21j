// future -- rewrite of Score and Part to Page, System, SystemPart
//     not currently used

define(['music21/base','music21/renderOptions','music21/stream',  
        'music21/common', 'jquery'], 
        function(base, renderOptions, stream, common, $) {   
    var layout = {};
    layout.makeLayoutFromScore = function (score, containerWidth) {
        /*
         * Divide a part up into systems and fix the measure
         * widths so that they are all even.
         * 
         * Note that this is done on the part level even though
         * the measure widths need to be consistent across parts.
         * 
         * This is possible because the system is deterministic and
         * will come to the same result for each part.  Opportunity
         * for making more efficient through this...
         */
        //var systemHeight = score.systemHeight; /* part.show() called... */
        //var systemPadding = score.systemPadding;
        var parts = score.parts;
        //console.log(parts);
        var numParts = parts.length;
        var partZero = parts[0];
        var numMeasures = partZero.length;
        
        var measureWidths = partZero.getMeasureWidths();
        var maxSystemWidth = containerWidth || score.maxSystemWidth; /* of course fix! */
        
        var layoutScore = new music21.layout.LayoutScore();
        var currentPage = new music21.layout.Page(); // to-do multiple pages...
        currentPage.measureStart = 1;
        currentPage.measureEnd = numMeasures;
        
        layoutScore.insert(0, currentPage);
        
        var currentSystem = new music21.layout.System();
        currentSystemNumber = 1;
        currentSystem.measureStart = 1;
        
        //var currentStaves = [];
        var staffMaker = function (staffHolder, numParts, measureStart) {
            for (var pNum = 0; pNum < numParts; pNum++) {
                var staff = new music21.layout.Staff();
                staff.measureStart = measureStart;
                staff.staffNumber = pNum + 1;
                staffHolder.push( staff );
            }            
        };
        staffMaker(currentStaves, numParts, 1);
        
        var systemCurrentWidths = [];
        var systemBreakIndexes = [];
        var lastSystemBreak = 0; /* needed to ensure each line has at least one measure */
        var startLeft = 20; /* TODO: make it obtained elsewhere */
        var currentLeft = startLeft;
        var currentSystemTop = 0;
        //var partTopOffsets = [];
        var ignoreSystemsInCalculatingScoreHeight = true;
        var systemHeight = score.estimateStreamHeight(ignoreSystemsInCalculatingScoreHeight);        
        
        for (var i = 0; i < measureWidths.length; i++) {
            var currentRight = currentLeft + measureWidths[i];
            /* console.log("left: " + currentLeft + " ; right: " + currentRight + " ; m: " + i); */
            if ((currentRight > maxSystemWidth) && (lastSystemBreak != i)) {
                // new system...
                for (var j = 0; j < currentStaves.length; j++) {
                    currentStaves.measureEnd = i;
                    currentSystem.insert(0, currentStaves[j]);                    
                }
                currentStaves = [];
                staffMaker(currentStaves, numParts, i + 1);
                currentSystemTop += systemHeight; 
                currentSystem.measureEnd = i;
                currentPage.insert(0, currentSystem);
                currentSystemNumber += 1;
                currentSystem = new music21.layout.System();
                currentSystem.measureStart = i + 1;
                currentSystem.systemNumber = currentSystemNumber;
                
                systemBreakIndexes.push(i-1);
                systemCurrentWidths.push(currentLeft);
                console.log('setting new width at ' + currentLeft + ' measure ' + i);
                currentLeft = startLeft + measureWidths[i];
                lastSystemBreak = i;
            } else {
                currentLeft = currentRight;
            }
            for (var pNum = 0; pNum < currentStaves.length; pNum ++) {
                currentStaves[pNum].append(parts[pNum].get(i));
            }            
        }
        for (var j = 0; j < currentStaves.length; j++) {
            currentStaves.measureEnd = measureWidths.length - 1;
            currentSystem.insert(0, currentStaves[j]);            
        }
        currentPage.insert(0, currentSystem);
        return layoutScore;    
    };

    layout.LayoutScore = function () {
        stream.Score.call(this);
        this.classes.push('LayoutScore');
        this.scoreLayout = undefined;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        this._width = undefined;
        this.height = undefined;
        this.top = 0;
        this.left = 0;
        Object.defineProperties(this, {
            'pages': {
                configurable: true,
                enumerable: true,
                get: function () { return this.getElementsByClass('Page'); },
            },
            'width': {
                configurable: true,
                enumerable: true,
                get: function () { 
                    if (this._width) {
                        return this._width;
                    } else if (this.activeSite) {
                        return this.activeSite.width;
                    }
                },
            },
        });
        
    };
    layout.LayoutScore.prototype = new stream.Score();
    layout.LayoutScore.prototype.constructor = layout.LayoutScore;
    
    /**
     * return a tuple of (top, bottom) for a staff, specified by a given pageId,
     * systemId, and staffId in PIXELS.

     * @param pageId
     * @param systemId
     * @param staffId
     * @param units -- "pixels" or "tenths" (not supported)
     */
    
    layout.LayoutScore.prototype.getPositionForStaff = function(pageId, systemId, staffId, units) {
        units = units || "pixels";
        
    };
    
    
    /**
     * All music must currently be on page 1.
     */
    layout.Page = function () {
        stream.Score.call(this);
        this.classes.push('Page');
        this.pageNumber = 1;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        this.systemStart = undefined;
        this.systemEnd = undefined;
        this.pageLayout = undefined;
        Object.defineProperties(this, {
            'systems': {
                configurable: true,
                enumerable: true,
                get: function () { return this.getElementsByClass('System'); },
            },
            'width': {
                configurable: true,
                enumerable: true,
                get: function () { 
                    if (this._width) {
                        return this._width;
                    } else if (this.activeSite) {
                        return this.activeSite.width;
                    }
                },
            },
        });
    };
    layout.Page.prototype = new stream.Score();
    layout.Page.prototype.constructor = layout.Page;

    layout.System = function () {
        stream.Score.call(this);
        this.classes.push('System');
        this.systemNumber = 1;
        this.systemLayout = undefined;
        this.measureStart = undefined;
        this.measureEnd = undefined;
        this._width = undefined;
        this.height = undefined;
        this.top = undefined;
        this.left = undefined;
        Object.defineProperties(this, {
            'staves': {
                configurable: true,
                enumerable: true,
                get: function () { return this.getElementsByClass('Staff'); },
            },
            'width': {
                configurable: true,
                enumerable: true,
                get: function () { 
                    if (this._width) {
                        return this._width;
                    } else if (this.activeSite) {
                        return this.activeSite.width;
                    }
                },
            },
        });

    };
    layout.System.prototype = new stream.Score();
    layout.System.prototype.constructor = layout.System;
    
    layout.Staff = function () {
        stream.Part.call(this);
        this.classes.push('Staff');
        this.staffNumber = 1;
        this.optimized = 0;
        this.top = undefined;
        this.left = undefined;
        this._width = undefined;
        this.height = undefined;
        this.inheritedHeight = undefined;
        this.staffLayout = undefined;
        Object.defineProperties(this, {
            'width': {
                configurable: true,
                enumerable: true,
                get: function () { 
                    if (this._width) {
                        return this._width;
                    } else if (this.activeSite) {
                        return this.activeSite.width;
                    }
                },
            },
        });
    };
    layout.Staff.prototype = new stream.Part();
    layout.Staff.prototype.constructor = layout.Staff;
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.layout = layout;
    }       
    return layout;
});
