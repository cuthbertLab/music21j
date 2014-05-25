/**
 * music21j -- Javascript reimplementation of Core music21p features.  
 * music21/jazzMidi -- wrapper around the Jazz Plugin
 * 
 * Uses the cross-platform, cross-browser plugin from 
 * http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html
 * P.S. by the standards of divinity of most major religions, Sema Kachalo is a god.
 *
 * Copyright (c) 2014, Michael Scott Cuthbert and cuthbertLab
 * Based on music21 (=music21p), Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(['music21/jazzMidi'], function(require) {
	var jazzMidi = {};
	jazzMidi._storedPlugin = undefined;
	jazzMidi.selectedInterface = undefined; // not the same as "" etc. uses last selected interface by default.
	
	jazzMidi.defaultGeneralCallback = function(midiEvent) {
	    midiEvent.sendToMIDIjs();
	};

    jazzMidi.callBacks = {
        raw : function (t, a, b, c) { return new jazzMidi.Event(t, a, b, c); },
        general : jazzMidi.defaultGeneralCallback,
    };

	jazzMidi.midiInArrived = function (t, a, b, c) {
	    var eventObject = jazzMidi.callBacks.raw(t, a, b, c);
	    return jazzMidi.callBacks.general(eventObject);
	};
	
	jazzMidi.createPlugin = function (appendElement, override) {
	    if ((jazzMidi._storedPlugin) && (override != true)) { 
	        return jazzMidi._storedPlugin;
	    }
	    if (typeof(appendElement) == 'undefined') {
	    	appendElement = $('body')[0];
	    } 
	    var obj = document.createElement('object');
	    obj.classid = "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90";
	    if (!obj.isJazz) {
		    obj.type = "audio/x-jazz";
	    }
	    obj.style.visibility = 'hidden';
	    obj.style.width = '0px'; 
	    obj.style.height = '0px';
	    appendElement.appendChild(obj);
	    if (obj.isJazz) {
	        jazzMidi._storedPlugin = obj;
	        return obj;
	    } else {
		    appendElement.removeChild(obj);
		    throw("Cannot use jazz plugin; install at http://jazz-soft.net/doc/Jazz-Plugin/Plugin.html");
	    }
	};

	jazzMidi.createSelector = function (midiSelectDiv, Jazz) {
	    if (typeof(Jazz) == 'undefined') {
	        Jazz = jazzMidi.createPlugin();
	    }
	    if (typeof(midiSelectDiv) == 'undefined') {
	        midiSelectDiv = $("body");
        }
	    
	    var newOption = $("<select>").attr('id','midiInSelect');
		newOption.change( function () { 
			var selectedInput = $("#midiInSelect option:selected").text();
			if (selectedInput != "None selected") {
	            jazzMidi.selectedInterface = Jazz.MidiInOpen(selectedInput, jazzMidi.midiInArrived);			    
			} else {
			    Jazz.MidiInClose();
			}
			if (music21.debug) {
			    console.log("current input changed to: " + jazzMidi.selectedInterface);
			}
		});
		var midiOptions = Jazz.MidiInList();
		var noneAppendOption = $("<option value='None'>None selected</option>");
		newOption.append(noneAppendOption);
		
		var anySelected = false;
		var allAppendOptions = [];
		for (var i = 0; i < midiOptions.length; i++) {
			var appendOption = $("<option value='" + midiOptions[i] + "'>" + midiOptions[i] + "</option>");
			if (midiOptions[i] == jazzMidi.selectedInterface) {
				appendOption.attr("selected", true);
				anySelected = true;
			}
			allAppendOptions.push(appendOption);
			console.log(appendOption);
			newOption.append(appendOption);
		}
		midiSelectDiv.append(newOption);
		if (anySelected == false && midiOptions.length > 0) {
			midiSelectDiv.val(midiOptions[0]);
			allAppendOptions[0].attr("selected", true);
			jazzMidi.selectedInterface = Jazz.MidiInOpen(midiOptions[0], jazzMidi.midiInArrived);
		} else {
		    noneAppendOption.attr("selected", true);
		}
		
	};
	
	jazzMidi.Event = function (t, a, b, c) {
	    this.timing = t;
	    this.data1 = a; 
	    this.data2 = b; 
	    this.data3 = c; 
	    this.midiCommand = (a >> 4);
	    
	    this.noteOff = (this.midiCommand == 8);
	    this.noteOn = (this.midiCommand == 9);
	    
	    this.midiNote = undefined;
	    if (this.noteOn || this.noteOff) {
	        this.midiNote = this.data2;
	        this.velocity = this.data3;
	    }
	    
	    this.noteInfo = function () {
	        if (this.noteOn) {
	            console.log('Note on: ' + this.midiNote + " ; Velocity: " + this.velocity);
	        }
	    };
	    this.sendToMIDIjs = function () {
	        if (this.noteOn) {
	            music21.MIDI.noteOn(0, this.midiNote, this.velocity, 0);
	        } else if (this.noteOff) {
	            music21.MIDI.noteOff(0, this.midiNote, 0);      
	        }
	    };
	    this.music21Note = function () {
	        var m21n = new music21.note.Note();
	        m21n.pitch.ps = this.midiNote;
	        return m21n;
	    };
	};

	
	// end of define
	if (typeof(music21) != "undefined") {
		music21.jazzMidi = jazzMidi;
	}		
	return jazzMidi;
});

/**
 * Example smallest usage of the Jazz Terst.  see testHTML/midiInRequire.html 
 
<html>
<head>
    <title>MIDI In/Jazz Test for Music21j</title>
    <!-- for MSIE 10 on Windows 8 -->
    <meta http-equiv="X-UA-Compatible" content="requiresActiveX=true"/>
    <script data-main="../src/m21theory.js" src="../ext/require/require.js"></script>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />

    <script>
    var s = "";
    function displayStream(me) {
        me.sendToMIDIjs();
        if (me.noteOn) {
            var m21n = me.music21Note();
            if (s.elements.length > 7) {
                s.elements = s.elements.slice(1)
            }
            s.append(m21n);
            var canv = s.replaceLastCanvas();
        }
    }
    
    require(['music21'], function () { 
        s = new music21.stream.Stream();
        var Jazz = music21.jazzMidi.createPlugin();
        music21.jazzMidi.createSelector($("#putMidiSelectHere"));
        music21.jazzMidi.callBacks.general = displayStream;
    });
    
    
    </script>
</head>
<body>
<div>
MIDI Input: <div id="putMidiSelectHere" />
</div>
<div>
    <canvas />
</div>
</body>
</html>
**/