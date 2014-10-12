/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * See http://web.mit.edu/music21/ for more details.
 * 
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006-14, Michael Scott Cuthbert and cuthbertLab
 *
 * If you are a programmer, this is probably not the script you are looking for.  
 * The guts of music21j begin at src/music21/moduleLoader.js
 *
 * 
 * The plan is to implement all core music21 features as Javascript and to expose
 * more sophisticated features via server-side connections to remote servers running the
 * python music21 (music21p).
 * Requires a (mostly) ECMAScript 5 compatible browser w/ SVG/Canvas. IE 9+ or any recent 
 * version of Firefox, Safari (5+), Chrome, etc. will do. To disable the warning, 
 * set an attribute in the <script> tag that calls requirejs, warnBanner="no".
 * 
 * All interfaces are alpha and may change radically from day to day and release to release.
 * Do not use this in production code yet. 
 * 
 * See src/moduleLoader.js for version and version history.
 * 
 * music21j acknowledges VexFlow, MIDI.js, jUnit, jQuery for their great efforts without which 
 * this module would not be possible.
 * 
 * @exports music21
 */
if (typeof(music21) === "undefined") {
    /** @namespace */
    music21 = {};
}
console.log('hi before: ' + require.toUrl('hi'));
console.log('./hi before: ' + require.toUrl('./hi'));
console.log('loadMIDI before: ' + require.toUrl('loadMIDI'));

require.config({
    context: 'music21',
});
console.log('hi context: ' + require.toUrl('hi'));
console.log('./hi context: ' + require.toUrl('./hi'));
console.log('loadMIDI context: ' + require.toUrl('loadMIDI'));


//must be defined before loading, jQuery, etc. because needed to see if warnBanner is defined

// place a JSON obj into the <script> tag for require...
// <script data-main='music21' src='require.js' m21conf='{"loadSoundfont": false}'>

var pathSimplify = function (path) {
    ps = path.split('/');
    addSlash = (path.slice(path.length - 1, path.length) == '/') ? true : false;
    pout = [];
    for (var i = 0; i < ps.length; i++) {
       var el = ps[i];
       if (el == '..') {
           if (pout.length > 0) {
               if (pout[pout.length - 1] != '..') {
                   pout.pop();                          
               } else {
                   pout.push('..');
               }               
           } else {
               pout.push('..');
           }
       } else if (el == '') { 
          // pass
       } else {
           pout.push(el);
       }
    }
    pnew = pout.join('/');
    if (addSlash) {
        pnew += '/';
    }
    return pnew;
 };


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
if (typeof m21conf === 'undefined') {
    m21conf = {};
    var m21browserAttribute = getM21attribute('m21conf');
    if (m21browserAttribute != null) {
        m21conf = JSON.parse(m21browserAttribute);
    }
}
if (typeof m21srcPath === 'undefined') {
    if (typeof require !== 'undefined') {
        m21srcPath = pathSimplify(require.toUrl('music21') + '/..');
        //console.log('m21srcPath: ' + m21srcPath);
    }
}
music21.m21srcPath = m21srcPath;
console.log('m21srcPath', m21srcPath);
console.log('m21srcPath non simplified', require.toUrl('music21'));

var m21requireConfig = {
    paths: {
        'jquery': pathSimplify(m21srcPath + '/ext/jquery/jquery-2.1.1.min'),
        'attrchange': pathSimplify(m21srcPath + '/ext/jqueryPlugins/attrchange'),
        'jquery-ui': pathSimplify(m21srcPath + '/ext/jqueryPlugins/jqueryUI/jquery-ui.min'),
        'vexflow': pathSimplify(m21srcPath + '/ext/vexflow/vexflow-min'),
        'loadMIDI': pathSimplify(m21srcPath + '/loadMIDI'),
        'MIDI':         pathSimplify(m21srcPath + '/ext/midijs/build/MIDI'),
        'Base64':       pathSimplify(m21srcPath + '/ext/midijs/inc/Base64'),             
        'base64binary': pathSimplify(m21srcPath + '/ext/midijs/inc/base64binary'),
        //'es6-shim': './ext/es6-shim',
        //'vexflowMods': 'ext/vexflowMods',
    },
    packages: [
      { name: 'jsonpickle',
        location: pathSimplify(m21srcPath + '/ext/jsonpickle'),
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
};
console.log('loadMIDI after: ', m21requireConfig.paths.loadMIDI);
console.log('jsonpickle in music21: ', m21requireConfig.packages[0].location);


var m21modules = ['loadMIDI',
                  'vexflow',
                  'jquery',
                  'jsonpickle',
                  'jquery-ui',
                  'attrchange',
                  './music21/moduleLoader',                  
                  ];
//BUG: will this work if multiple files are listed in noLoad???
if (m21conf.noLoad !== undefined) {
    m21conf.noLoad.forEach(function(val, i, noLoad) {
        var mi = m21modules.indexOf(val);
        if (mi != -1) {
            m21modules.splice(mi, 1);
        }
    });
}


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
    if ( typeof define === "function" && define.amd) {
            console.log('inside require'); 
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
                                (music21.scriptConfig.loadSoundfont != false)) {
                           music21.MIDI.loadSoundfont('acoustic_grand_piano');
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
                    //console.log('end inside of require...');
                    return music21;
                });         
    }
}
