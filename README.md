music21j
========
JavaScript port of music21 -- Toolkit for Computational Musicology

Copyright (c) 2013-14 Michael Scott Cuthbert and cuthbertLab.
Released under either the BSD (3-clause) or GNU LGPL license according to your choice. See LICENSE.

Extremely pre-alpha.  Everything will change here.  

To use, place in a html page like:

```html
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
```
See the Python version of music21 at http://web.mit.edu/music21/ for documentation. Only a small
part of the functionality there exists in music21j, but more is being added daily.
