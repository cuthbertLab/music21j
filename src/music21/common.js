define([], function(require) {
    var common = {};    
    
    common.makeSVGright = function (tag, attrs) {
        // see http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        // normal JQuery does not work.
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs) {
            el.setAttribute(k, attrs[k]);            
        }
        return el;
    };

    // end of define
    if (typeof(music21) != "undefined") {
        music21.common = common;
    }       
    return common;
});

