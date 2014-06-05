define([], function(require) {
    var tie = {};
    
    tie.Tie = function (type) {
        this.type = type; // start, stop, or continue
        this.style = 'normal';
    };
    
    // end of define
    if (typeof(music21) != "undefined") {
        music21.tie = tie;
    }       
    return tie;
});

