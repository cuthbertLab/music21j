/*
music21j -- Javascript reimplementation of Core music21 features.  
See http://web.mit.edu/music21/ for more details.

Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab

This is probably not the script you are looking for.  
The guts of music21j begin at src/music21/moduleLoader.js

This version is released in non-minimized form under LGPL or proprietary licenses (your choice; the
former is Free; the latter costs money, but lets you use minimizers, etc. to optimize
web loading).  The license is still under discussion; please contact cuthbert@mit.edu for
more information.

The plan is to implement all core music21 features as Javascript and to expose
more sophisticated features via server-side connections to remote servers running the
python music21 (music21p).

Requires a (mostly) ECMAScript 5 compatible browser w/ SVG/Canvas. IE 9+ or any recent version of
Firefox, Safari (5+), Chrome, etc. will do. To disable the warning, set an attribute in the <script>
tag that calls requirejs, warnBanner="no".

All interfaces are alpha and may change radically from day to day and release to release.
Do not use this in production code yet.

See src/moduleLoader.js for version and version history.

music21j acknowledges VexFlow, MIDI.js, jUnit, jQuery for their great efforts without which
this module would not be possible.

*/

// must be defined before loading, jQuery, etc. because needed to see if warnBanner is defined
if (typeof(music21) === "undefined") var music21 = {};

// place a JSON obj into the <script> tag for require...
// <script data-main='music21' src='require.js' m21conf='{"loadSoundfont": false}'>

var getM21attribute = function (attrName) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        var dataMain = s.getAttribute('data-main');
        if (dataMain && ((/music21/.test(dataMain)) || (/m21/.test(dataMain)))) {
           var m21Attribute = s.getAttribute(attrName);
           //console.log(m21Attribute);
           return m21Attribute;
        }
    }
};
var warnBanner = (getM21attribute('warnBanner') != 'no' ) ? true : false;

if ((Object.defineProperties === undefined) && warnBanner) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute('style', 'font-size: 40px; padding: 40px 20px 40px 20px; margin-top: 20px; line-height: 50px; width: 500px; height: 400px; color: #ffffff; background-color: #900000;');
    var textInside = document.createTextNode('Unfortunately, IE8, Safari 4 (Leopard), and other out-of-date browsers do not work with music21j. Please upgrade your browser w/ the link above.');
    newDiv.appendChild(textInside);
    document.body.appendChild(newDiv);
    var $buoop  = {test: false, reminder: 0};
    var e = document.createElement("script");
    e.setAttribute("type", "text/javascript"); 
    e.setAttribute("src", "http://browser-update.org/update.js"); 
    document.body.appendChild(e);     

} else {
    if (m21conf === undefined) {
        var m21conf = {};
        var m21browserAttribute = getM21attribute('m21conf');
        if (m21browserAttribute != null) {
            m21conf = JSON.parse(m21browserAttribute);
        }
    }
    require.config({
    	paths: {
    		'jquery': 'ext/jquery/jquery-2.1.1.min',
    		'attrchange': 'ext/jqueryPlugins/attrchange',
    		'jquery-ui': 'ext/jqueryPlugins/jqueryUI/jquery-ui.min',
    		'vexflow': 'ext/vexflow/vexflow-min',
    		'es6-shim': 'ext/es6-shim',
    		//'vexflowMods': 'ext/vexflowMods',
    	},
    	packages: [
    	  { name: 'jsonpickle',
    	    location: './ext/jsonpickle',
    	    main: 'main',    	      
    	  },          	           
    	],    	
    	shim: {
    	    'attrchange': {
    	        deps: [ 'jquery' ],
    	        exports: 'jQuery.attrchange',
    	    },
    		'jquery-ui': {
    			deps: [ 'jquery' ],
    			exports: 'jQuery.ui'
    		},
            'vexflow': {
                deps: [ 'jquery' ],
                exports: 'Vex'
            },
    	}
    });
    var m21modules = ['./loadMIDI',
                      'vexflow',
                      'jquery',
                      'jsonpickle',
                      'jquery-ui',
                      'attrchange',
                      './music21/moduleLoader', ];
    if (m21conf.noLoad !== undefined) {
        m21conf.noLoad.forEach(function(val, i, noLoad) {
            var mi = m21modules.indexOf(val);
            if (mi != -1) {
                m21modules.splice(mi, 1);
            }
        });
    }
    if ( typeof define === "function" && define.amd) {
        define( "music21", m21modules, 
        		function (midi, vexflow, $, jsonpickle) { 
            
            music21.scriptConfig = m21conf;
            if (midi) {
                music21.MIDI = midi;
            }
            if (vexflow) {
                music21.Vex = vexflow;
            } else {
                console.log('could not load VexFlow');
            }
            if (music21.MIDI) {
                if ((music21.scriptConfig.loadSoundfont === undefined) ||
                        (music21.scriptConfig.loadSoundfont != false)) {
                   music21.MIDI.loadSoundfont('acoustic_grand_piano', function() {});
                } else {
                    console.log('skipping loading sound font');
                }
            }
            if ((music21.scriptConfig.renderHTML === undefined) ||
                    (music21.scriptConfig.renderHTML != false)) {
                $(document).ready(function() {
                    music21.tinyNotation.RenderNotationDivs();
                });
            }
            var m21 = music21;
        	return m21;
        });
    }
}