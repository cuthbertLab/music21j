music21j
========
JavaScript port of music21 -- Toolkit for Computational Musicology

Copyright (c) 2013-14 Michael Scott Cuthbert and cuthbertLab

Extremely pre-alpha.  Everything will change here.  For now, you can use it unminified
under LGPL but the license will change soon.

To use, place in a html page like:

<head>
   <script data-main="src/music21" src="ext/require/require.js">
   <script>
   require(['music21'], function () {
       var n = new music21.note.Note("F#");
       var s = new music21.stream.Stream();
       s.append(n);
       s.createNewCanvas();
   });
   </script>
</head>
<body />

See the Python version of music21 at http://web.mit.edu/music21/ for documentation. Only a small
part of the functionality there exists in music21j.
