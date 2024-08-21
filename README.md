# Music21j

**Music21j: An Interactive Framework for Musical Analysis**

Copyright (c) 2013-24, Michael Scott Asato Cuthbert, some rights reserved (BSD).

**Music21j** is a Javascript reinterpretation of the [Music21 Python] package,
a toolkit for computer-aided musicology, now with intuitive HTML/Javascript
interfaces. Some things music21j offers are:

  - The ability to visualize and hear changes in Streams quickly (using [Vexflow] and [MIDI.js])
  - Connections (via Web Midi or [JazzSoft] plugin) to MIDI devices.
  - Music theory and analysis modules at the level of music21 ca. 2014
  - A repository of modules such as metronomes, keyboards, and automatic transcribers.

Though it does not have all the power of [Music21 Python], music21j can help with
a number of research problems in music history and theory. The introduction to the
Python package will say more about it (it's better documented). The "namespaces"
tab above will give introductions to some features of music21j. At this
point we're focusing on documenting usage; developer docs will come
later.

Music21j requires your users to have a relatively recent web browser -- the project
targets browsers no more than 30 months old.
Safari is the only major desktop browser for which there is no out of the box 
support for MIDI devices.

## Documentation
This README appears in both the GitHub home page and the documentation
home page; to make the following links work, go to the documentation
page at http://web.mit.edu/music21/music21j/doc/ .

Begin at the {@link music21} namespace (click the link or use the
menu above), or start with
a specific one such as {@link music21.note} or {@link music21.stream}
or a Class such as {@link music21.note.Note} or {@link music21.stream.Stream}.

(Ignore "Modules" they're not useful and duplicate the namespace pages).

## Example
Install by downloading a copy of the music21 code to your own webserver.

```sh
% npm install music21j
```

If this line (`npm install`) doesn't work, download the
latest version of `node.js` from https://nodejs.org/en/download/
  
A guide to installing music21j on Windows would be appreciated.

The files in music21j are best viewed by running your own
webserver (rather than using `file:///...` links). We've
included a small script to start you up:

```sh
$ cd ~/git/music21j
$ grunt webpack
$ python start_python_server.py
```

Then navigate to http://localhost:8000/testHTML/ for some demos.

To use music21j in your own page, place in a html page like this (this assumes that you're
using the python server above).

```html
<html lang="en">
<head>
<title>music21 test</title>
</head>
<body>
   <script src="/node_modules/music21j/releases/music21.debug.js">
   </script>
   <script>
   const n = new music21.note.Note('F#');
   const s = new music21.stream.Stream();
   s.append(n);
   s.appendNewDOM();
   </script>
</body>
</html>
```

or use it in your own Javascript/Typescript project:

```sh
$ npm install --save music21j
```
```javascript
import * as music21 from 'music21j';

const n = new music21.note.Note('F#');
// etc.
```

### Embedding, etc.
Music21j was originally intended for self-hosting, so embedding is not
yet as simple as it should be.

To load soundfonts from other locations (like in a CDN), 
(1) set a global `m21conf` variable to disable loading soundfonts,
(2) load the music21j script, and (3) set the new soundfont location,
and (4) load the soundfont.

This fragment shows how to do it.  A working implementation is in the
testHTML directory as `sfElsewhereCDN.html`.

```html
<body>
<script>
    window.m21conf = { loadSoundfont: false };
</script>
<script 
    src="https://cdn.jsdelivr.net/npm/music21j/releases/music21.debug.min.js"
></script>
<script>
    music21.common.urls.soundfontUrl = 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/';
    music21.miditools.loadSoundfont('clarinet', i => {
       const tn = music21.tinyNotation.TinyNotation('4/4 c4 d e f g1');
       tn.instrument = i;
       tn.playStream();
    });
</script>
</body>
```



## Version
0.16 beta


## License
Music21j is released under the BSD 3-Clause License. Essentially you
can do with it what you want so long as you leave in my copyright statements
and do not represent that I endorse your product.

## Thanks

Thanks to the following packages (among others) for making music21j possible:

* [Vexflow] - music notation in HTML5
* [midicube] - audio processing of MIDI based on [MIDI.js]
* [Jazzsoft] - plug-in for accessing MIDI in the browser in the absence of WebMIDI Api.
* [qUnit] - testing framework
* [jsdoc] - makes this documentation possible

The Python version of music21 was supported by grants from
the Seaver Institute and the National Endowment for the Humanities
and supported by the Music and Theater Arts section of [MIT].


[MIT]:http://web.mit.edu
[music21 python]:http://web.mit.edu/music21/
[midicube]:https://github.com/mscuthbert/midicube
[Vexflow]:http://www.vexflow.com
[MIDI.js]:http://mudcu.be/midi-js/
[Jazzsoft]:http://jazz-soft.net
[qUnit]:http://qunitjs.com
[jsdoc]:http://usejsdoc.org


## Dev Notes
Build and watch with

```sh
$ grunt
```

test with

```sh
$ grunt test
```

You might get an error that looks like this which you can currently ignore:

```
Access to XMLHttpRequest at 
'file:///soundfonts/midi-js-soundfonts-master/FluidR3_GM/acoustic_grand_piano-ogg.js' 
from origin 'null' has been blocked by CORS policy
```

We hope to fix it later, but for now, we're not testing audio output.


for running tests one time without watch, you can use:

```sh
$ grunt test_no_watch
```

### Publishing a new version
You'll need to be part of the npm dev team.

Two steps 

1: Build the latest version by running:

```sh
$ grunt
```

Then update the version number and commit with:

```sh
$ grunt publish
```

(It also tries to build the
docs via `grunt jsdoc` (currently failing).
The template is specified in jsdoc-template/jsdoc.conf.json)

For a non-backwards compatible release, edit the minor 
version number manually in this README.md, in main.ts, and in
package.json.  Then do all the steps again from the start.  :-)

Then run the copy script with:

```sh
$ npm publish
```

which will copy the current contents of `build` in `releases`
and publish on npm.

Before publishing, every once in a while run (in the music21j directory)

```sh
$ node_modules/.bin/npm-check-updates
```

and if it looks like something to update, run

```sh
$ node_modules/.bin/npm-check-updates -u
$ npm install
```


These docs may change someday in preparation for v.1.0 release.
