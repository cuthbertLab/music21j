
// Not fully AMD since music21 is given as a global variable.
if (typeof (music21) == "undefined") {
	music21 = {};
}

music21.debug = false;
music21._inClass = function (testClass) {
	if ($.inArray(testClass, this.classes) != -1) {
		return true;
	} else {
		return false;
	}
};


/* jQuery extensions
 * 
 */
/**
 * Logic for copying events from one jQuery object to another.
 *
 * @private 
 * @name jQuery.event.copy
 * @param jQuery|String|DOM Element jQuery object to copy events from. Only uses the first matched element.
 * @param jQuery|String|DOM Element jQuery object to copy events to. Copies to all matched elements.
 * @type undefined
 * @cat Plugins/copyEvents
 * @author Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * @author Yannick Albert (mail@yckart.com || http://yckart.com)
 */
if (typeof(jQuery) != "undefined") {
	jQuery.event.copy = function (from, to) {
	    from = from.jquery ? from : jQuery(from);
	    to = to.jquery ? to : jQuery(to);
	
	    var events = from[0].events || jQuery.data(from[0], "events") || jQuery._data(from[0], "events");
	    if (!from.length || !to.length || !events) return;
	
	    return to.each(function () {
	        for (var type in events)
	        for (var handler in events[type])
	        jQuery.event.add(this, type, events[type][handler], events[type][handler].data);
	    });
	};
}

define(['music21/pitch', 'music21/duration', 'music21/baseObjects', 'music21/note',
        'music21/chord', 'music21/roman', 'music21/key', 'music21/interval', 'music21/clef',
        'music21/renderOptions', 'music21/tinyNotation', 'music21/dynamics', 'music21/stream'], 
        function(require) {
			return music21;
		}
); // end define

