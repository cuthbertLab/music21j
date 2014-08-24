define(['./prebase'], 
        function(prebase) {
    var tie = {};
    
    tie.Tie = function (type) {
        prebase.ProtoM21Object.call(this);
        this.type = type; // start, stop, or continue
        this.style = 'normal';
    };
    tie.Tie.prototype = new prebase.ProtoM21Object();
    tie.Tie.prototype.constructor = tie.Tie;
    // end of define
    if (typeof(music21) != "undefined") {
        music21.tie = tie;
    }       
    return tie;
});

