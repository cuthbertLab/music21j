/**
 * If you are a programmer, this is probably not the script you are looking for.  
 * The guts of music21j begin at src/music21/moduleLoader.js
 * 
 * @exports music21
 */
// Not strict mode

if (typeof(music21) === "undefined") {
    /**
     * **music21j**: Javascript reimplementation of Core music21 features.  
     * 
     * See http://web.mit.edu/music21/ for more details.
     * 
     * Copyright (c) 2013-15, Michael Scott Cuthbert and cuthbertLab
     * 
     * Based on music21, Copyright (c) 2006-15, Michael Scott Cuthbert and cuthbertLab
     * The plan is to implement all core music21 features as Javascript and to expose
     * more sophisticated features via server-side connections to remote servers running the
     * python music21 (music21p).
     * 
     * Requires a (mostly) ECMAScript 5 compatible browser w/ SVG/Canvas. IE 9+ or any recent 
     * version of Firefox, Safari (5+), Chrome, etc. will do. To disable the warning, 
     * set an attribute in the &lt;script&gt; tag that calls requirejs, warnBanner="no".
     * 
     * All interfaces are alpha and may change radically from day to day and release to release.
     * Do not use this in production code yet. 
     * 
     * See src/moduleLoader.js for version and version history.
     * 
     * music21j acknowledges VexFlow, MIDI.js, jUnit, jQuery for their great efforts without which 
     * this module would not be possible.
     *  
     * @namespace 
     */
    music21 = {VERSION: 0.7}; // update in README.md also
}
//console.log('hi before: ' + require.toUrl('hi'));
//console.log('./hi before: ' + require.toUrl('./hi'));

require.config({
    context: 'music21',
});
//console.log('hi context: ' + require.toUrl('hi'));
//console.log('./hi context: ' + require.toUrl('./hi'));


//must be defined before loading, jQuery, etc. because needed to see if warnBanner is defined

// place a JSON obj into the <script> tag for require...
// <script data-main='music21' src='require.js' m21conf='{"loadSoundfont": false}'>

var pathSimplify = function (path) {
    var pPrefix = "";
    if (path.indexOf('//') === 0) {
        pPrefix = '//'; //cdn loading;
        path = path.slice(2);
        console.log('cdn load: ', pPrefix, " into ", path);
    } else if (path.indexOf('://') !== -1) { // for cross site requests...
        var protoSpace = path.indexOf('://');
        pPrefix = path.slice(0, protoSpace + 3);
        path = path.slice(protoSpace + 3);
        console.log('cross-site split', pPrefix, path);
    }
    var ps = path.split('/');
    var addSlash = (path.slice(path.length - 1, path.length) === '/') ? true : false;
    var pout = [];
    for (var i = 0; i < ps.length; i++) {
       var el = ps[i];
       if (el === '..') {
           if (pout.length > 0) {
               if (pout[pout.length - 1] !== '..') {
                   pout.pop();                          
               } else {
                   pout.push('..');
               }               
           } else {
               pout.push('..');
           }
       //} else if (el == '') { 
       //   // pass
       } else {
           pout.push(el);
       }
    }
    var pnew = pout.join('/');
    if (addSlash) {
        pnew += '/';
    }
    pnew = pPrefix + pnew;
    return pnew;
 };

/**
 * Get an attribute from the script tag that invokes music21 via its data-main 
 * attribute.
 * 
 * E.g. if you invoked music21 with:
 *     <script src="require.js" data-main="src/music21" quiet="2" hi="hello"></script>
 * 
 * then "getM21attribute('quiet')" would return "2".
 * 
 */
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

/**
 *  Should we warn about obsolete web browsers? default Yes.
 */
var warnBanner = (getM21attribute('warnBanner') !== 'no' ) ? true : false;

// get scriptConfig
if (typeof m21conf === 'undefined') {
    m21conf = {};
    var m21browserAttribute = getM21attribute('m21conf');
    if (m21browserAttribute !== null && m21browserAttribute !== undefined) {
        try {
            m21conf = JSON.parse(m21browserAttribute);
        } catch (e) {
            console.log('Unable to JSON parse ' + m21browserAttribute.toString() + ' into m21conf');
        }
    }
}



if (typeof m21srcPath === 'undefined') {
    if (typeof require !== 'undefined') {
        m21srcPath = pathSimplify(require.toUrl('music21').replace(/\?bust=\w*/, '') + '/..');
        //console.log('m21srcPath: ' + m21srcPath);
    }
}

music21.m21basePath = pathSimplify(m21srcPath + '/..');
music21.m21srcPath = m21srcPath;
//console.log('m21srcPath', m21srcPath);
//console.log('m21srcPath non simplified', require.toUrl('music21'));
music21.soundfontUrl = music21.m21srcPath + '/ext/soundfonts/FluidR3_GM/';

var m21requireConfig = {
    paths: {
        'jquery':     pathSimplify(m21srcPath + '/ext/jquery/jquery-2.1.1.min'),
        'attrchange': pathSimplify(m21srcPath + '/ext/jqueryPlugins/attrchange'),
        'jquery-ui':  pathSimplify(m21srcPath + '/ext/jqueryPlugins/jqueryUI/jquery-ui.min'),
        'vexflow':    pathSimplify(m21srcPath + '/ext/vexflow/vexflow-min'),
        'MIDI':       pathSimplify(m21srcPath + '/ext/midijs/build/MIDI'),
        'jasmidMidifile':   pathSimplify(m21srcPath + '/ext/midijs/inc/jasmid/midifile'),
        'jasmidReplayer':   pathSimplify(m21srcPath + '/ext/midijs/inc/jasmid/replayer'),
        'jasmidStream':     pathSimplify(m21srcPath + '/ext/midijs/inc/jasmid/stream'),
        // a very nice event handler from Mudcu.be that handles drags 
        'eventjs':          pathSimplify(m21srcPath + '/ext/midijs/examples/inc/event'),     
        // read binary data in base64.  In "shim" but is not a shim.
        'base64Binary': pathSimplify(m21srcPath + '/ext/midijs/inc/shim/Base64binary'),
        
        // browser shims
        'webMidiApiShim': pathSimplify(m21srcPath + '/ext/midijs/inc/shim/WebMIDIAPI'), //not currently loaded/used?
        'webAudioShim': pathSimplify(m21srcPath + '/ext/midijs/inc/shim/WebAudioAPI'), // Safari prefixed to <= 9; IE <= Edge
        'es6Shim': pathSimplify(m21srcPath + '/ext/es6-shim'),
        
        // formerly used Shims (IE9)
        //'base64Shim':   pathSimplify(m21srcPath + '/ext/midijs/inc/shim/Base64'),
        
        //'vexflowMods': 'ext/vexflowMods',
    },
    packages: [
      { name: 'jsonpickle',
        location: pathSimplify(m21srcPath + '/ext/jsonpickle'),
        main: 'main',             
      },     
    ],      
    shim: {
        'eventjs': {
            exports: 'eventjs',
        },        
        'webMidiApiShim': {
            deps: ['es6Shim'],
            exports: 'window',            
        },
        'MIDI': {
            deps: [ //'base64Shim',  // Bye-bye IE9!
                    'base64Binary', 'webAudioShim', 
                   'jasmidMidifile', 'jasmidReplayer', 'jasmidStream', 'eventjs'],
            exports: 'MIDI',
        },
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
};
//console.log('jsonpickle in music21: ', m21requireConfig.packages[0].location);


var m21modules = ['MIDI',
                  'vexflow',
                  'jquery',
                  'jsonpickle',
                  'jquery-ui',
                  'attrchange',
                  'es6Shim',
                  //'webmidiapi',
                  './music21/moduleLoader',                  
                  ];
//BUG: will this work if multiple files are listed in noLoad???
if (m21conf.noLoad !== undefined) {
    m21conf.noLoad.forEach(function(val, i, noLoad) {
        var mi = m21modules.indexOf(val);
        if (mi !== -1) {
            m21modules.splice(mi, 1);
        }
    });
}


if ((Object.defineProperties === undefined) && warnBanner) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute('style', 'font-size: 40px; padding: 40px 20px 40px 20px; margin-top: 20px; line-height: 50px; width: 500px; height: 400px; color: #ffffff; background-color: #900000;');
    var textInside = document.createTextNode('Unfortunately, IE9, Safari 4 or 5 (Leopard/Snow Leopard), and other out-of-date browsers do not work with music21j. Please upgrade your browser w/ the link above.');
    newDiv.appendChild(textInside);
    document.body.appendChild(newDiv);
    var $buoop  = {test: false, reminder: 0}; // used by update.js...
    var e = document.createElement("script");
    e.setAttribute("type", "text/javascript"); 
    e.setAttribute("src", "http://browser-update.org/update.js"); 
    document.body.appendChild(e);     

} else {
    if ( typeof define === "function" && define.amd) {
            require.config(m21requireConfig);
            //console.log(require.nameToUrl('jquery'));
            define( m21modules, 
                function (midi, vexflow, $, jsonpickle) {  // BUG, what if midi is in noLoad?     
                    //console.log('inside of require...');
                    music21.scriptConfig = m21conf;
                    //console.log(music21.chord);
                    if (midi) {  music21.MIDI = midi; }
                    if (vexflow) { music21.Vex = vexflow; } 
                    else { console.log('could not load VexFlow'); }
                    if (music21.MIDI) {
                        if ((music21.scriptConfig.loadSoundfont === undefined) ||
                                (music21.scriptConfig.loadSoundfont !== false)) {
                           music21.miditools.loadSoundfont('acoustic_grand_piano');
                        } else {
                            console.log('skipping loading sound font');
                        }
                    }
                    if ((music21.scriptConfig.renderHTML === undefined) ||
                            (music21.scriptConfig.renderHTML !== false)) {
                        $(document).ready(function() {
                            music21.tinyNotation.renderNotationDivs();
                        });
                    }
                    //console.log('end inside of require...');
                    return music21;
                });         
    }
}
