Music21j
=========

Copyright &copy;2013-14, Michael Scott Cuthbert and cuthbertLab, some rights reserved.

**Music21j** is a Javascript reinterpretation of the [Music21 Python] package, 
a toolkit for computer-aided musicology, now with intuitive HTML/Javascript
interfaces. Some of the things music21j offers are:

  - The ability to visualize and hear changes in Streams quickly (using [Vexflow] and [MIDI.js])
  - Connections (via [JazzSoft] plugin) to MIDI devices. 
  - A framework for easily making music theory exercises and interfaces to exploring scores.
  - A repository of modules such as metronomes, keyboards, and automatic transcribers.

Though it does not have all the power of [Music21 Python], music21j can help with
a number of research problems in music history and theory. The introduction to the
Python package will say more about it (it's better documented). The "namespaces"
tab above will give introductions to some of the features of music21j. At this
point we're focusing on documenting usage; developer docs will come 
later.

Music21j requires your users to have a relatively recent web browser. Safari 6+,
Chrome since 2013, or Firefox since 2013 all work great. Internet Explorer 9+
works well too, though timing of playback can be a bit off. There is basic
support for IE 8 also.  Safari 5 and below and IE 7 and older are not
supported.

Documentation
-------------
This README appears in both the GitHub home page and the documentation 
home page; to make the following links work, go to the documentation
page at http://web.mit.edu/music21/music21j/doc/ .

Begin at the {@link music21} namespace (click the link or use the
menu above), or start with
a specific one such as {@link music21.note} or {@link music21.stream}
or a Class such as {@link music21.note.Note} or {@link music21.stream.Stream}. 

(Ignore "Modules" they're not useful and duplicate the namespace pages).

Example
--------
Install by downloading a copy of the music21 code to your own webserver.

If you have `git` installed, you can use (on Mac/Unix):

```sh
% cd ~/git
% git clone https://github.com/cuthbertLab/music21j.git
% cd music21j
```

The files in music21j are best viewed by running your own
webserver (rather than using `file:///...` links). We've
included a small script to start you up:

```sh
% cd ~/git/music21j
% python start_python_server.py
```

Then navigate to http://localhost:8000/testHTML/ for some demos.

To use music21j in your own page, place in a html page like this (this assumes that you're
using the python server above).

```html
<html>
<head>
   <script data-main="/src/music21" src="/ext/require/require.js"> 
   </script>
   <script>
   require(['music21'], function () {
       // your code goes here.  For instance...
       var n = new music21.note.Note("F#");
       var s = new music21.stream.Stream();
       s.append(n);
       s.appendNewCanvas();
   });
   </script>
</head>
<body></body>
</html>
```


Version
--------
0.3 alpha


License
--------
Music21j is released under the BSD 3-Clause License. Essentially you
can do with it what you want so long as you leave in my copyright statements
and do not represent that I endorse your product.

Or you can choose to use the GNU Lesser Public License if for some reason
that suits your project better.

Thanks
-----------

Thanks to the following packages (among others) for making music21j possible:

* [Vexflow] - music notation in HTML5
* [MIDI.js] - audio processing of MIDI
* [Jazzsoft] - plug-in for accessing MIDI in the browser.
* [require.js] - method for loading multiple modules in the browser and managing dependencies.
* [jQuery] - easy manipulation of HTML DOM.
* [qUnit] - testing framework
* [jsdoc] - makes this documentation possible

Music21j is developed with a grant from the D'Arbeloff Fund for teaching and
learning at [MIT]. The Python version of music21 was supported by grants from
the Seaver Institute and the National Endowment for the Humanities.


[MIT]:http://web.mit.edu
[music21 python]:http://web.mit.edu/music21/
[Vexflow]:http://www.vexflow.com
[MIDI.js]:http://mudcu.be/midi-js/
[Jazzsoft]:http://jazz-soft.net
[require.js]:http://requirejs.org
[jQuery]:http://jquery.com
[qUnit]:http://qunitjs.com
[jsdoc]:http://usejsdoc.org