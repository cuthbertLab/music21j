require.config({
    paths: {
        'music21': '../src/music21',
        'q-unit': '../ext/qUnit/qunit-1.12.0',
    },
    baseUrl: '../src',
    shim: {
        'q-unit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        } 
     }
});

require(['music21','q-unit'], function () {
    test( "music21.pitch.Accidental", function () {
        var a = new music21.pitch.Accidental("-");
        equal(a.alter, -1.0, "flat alter passed");
        equal(a.name, 'flat', "flat name passed");
    });

    test( "music21.pitch.Pitch", function() {
        var p = new music21.pitch.Pitch("D#5");
        equal ( p.name, "D#", "Pitch Name set to D#");
        equal ( p.step, "D",  "Pitch Step set to D");
        equal ( p.octave, 5, "Pitch octave set to 5");
    });

    test( "music21.note.Note", function() {
        var n = new music21.note.Note("D#5");
        equal ( n.pitch.name, "D#", "Pitch Name set to D#");
        equal ( n.pitch.step, "D",  "Pitch Step set to D");
        equal ( n.pitch.octave, 5, "Pitch octave set to 5");


    });

    test ( "music21.key.Key" , function() {
        var testSharps = [
           // sharps, mode, given name, given mode
           [0, 'minor', 'a'],
           [0, 'major', 'C'],
           [0, 'major'],
           [6, 'major', 'F#'],
           [3, 'minor', 'f#'],
           [6, 'major', 'f#', 'major'],
           [-2, 'major', 'B-'],
           [-5, 'minor', 'b-'],
        ];
        for (var i = 0; i < testSharps.length; i++ ) {
            var thisTest = testSharps[i];
            var expectedSharps = thisTest[0];
            var expectedMode = thisTest[1];
            var givenKeyName = thisTest[2];
            var givenMode = thisTest[3];
            var k = new music21.key.Key(givenKeyName, givenMode);
            var foundSharps = k.sharps;
            var foundMode = k.mode;
            equal (foundSharps, expectedSharps, "Test sharps: " + givenKeyName + " (mode: " + givenMode + ") ");
            equal (foundMode, expectedMode, "Test mode: " + givenKeyName + " (mode: " + givenMode + ") ");
        }

        var k = new music21.key.Key("f#");
        var s = k.getScale();
        equal (s[2].nameWithOctave, "A4", "test minor scale");
        equal (s[6].nameWithOctave, "E5");
        s = k.getScale('major');
        equal (s[2].nameWithOctave, "A#4", "test major scale");
        equal (s[6].nameWithOctave, "E#5");
        s = k.getScale("harmonic minor");
        equal (s[2].nameWithOctave, "A4", "test harmonic minor scale");
        equal (s[5].nameWithOctave, "D5");
        equal (s[6].nameWithOctave, "E#5");
    });

    test ( "music21.roman.RomanNumeral" , function() {
        var t1 = "IV";
        var rn1 = new music21.roman.RomanNumeral(t1, "F");
        equal (rn1.scaleDegree, 4, 'test scale dgree of F IV');
        var scale = rn1.scale;
        equal (scale[0].name, "F", 'test scale is F');
        equal (rn1.root.name, "B-", 'test root of F IV');
        equal (rn1.impliedQuality, 'major', 'test quality is major');
        equal (rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
        equal (rn1.pitches[1].name, 'D', 'test pitches[1] == D');
        equal (rn1.pitches[2].name, 'F', 'test pitches[2] == F');
        equal (rn1.degreeName, 'Subdominant', 'test is Subdominant');
        
        t2 = 'viio7';
        rn1 = new music21.roman.RomanNumeral(t2, "a");
        equal (rn1.scaleDegree, 7, 'test scale dgree of A viio7');
        equal (rn1.root.name, "G#", 'test root name == G#');
        equal (rn1.impliedQuality, 'diminished-seventh', 'implied quality');
        equal (rn1.pitches[0].name, 'G#', 'test pitches[0] == G#');
        equal (rn1.pitches[1].name, 'B', 'test pitches[1] == B');
        equal (rn1.pitches[2].name, 'D', 'test pitches[2] == D');
        equal (rn1.pitches[3].name, 'F', 'test pitches[3] == F');
        equal (rn1.degreeName, 'Leading-tone', 'test is Leading-tone');

        t2 = 'V7';
        rn1 = new music21.roman.RomanNumeral(t2, "a");
        equal (rn1.scaleDegree, 5, 'test scale dgree of a V7');
        equal (rn1.root.name, "E", 'root name is E');
        equal (rn1.impliedQuality, 'dominant-seventh', 'implied quality dominant-seventh');
        equal (rn1.pitches[0].name, 'E', 'test pitches[0] == E');
        equal (rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
        equal (rn1.pitches[2].name, 'B', 'test pitches[2] == B');
        equal (rn1.pitches[3].name, 'D', 'test pitches[3] == D');
        equal (rn1.degreeName, 'Dominant', 'test is Dominant');
        
        t2 = 'VII';
        rn1 = new music21.roman.RomanNumeral(t2, "f#");
        equal (rn1.scaleDegree, 7, 'test scale dgree of a VII');
        equal (rn1.root.name, "E", 'root name is E');
        equal (rn1.impliedQuality, 'major', 'implied quality major');
        equal (rn1.pitches[0].name, 'E', 'test pitches[0] == E');
        equal (rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
        equal (rn1.pitches[2].name, 'B', 'test pitches[2] == B');
        equal (rn1.degreeName, 'Subtonic', 'test is Subtonic');
        
    });

    test ( "music21.roman.RomanNumeral - inversions" , function() {
        var t1 = "IV";
        var rn1 = new music21.roman.RomanNumeral(t1, "F");
        equal (rn1.scaleDegree, 4, 'test scale dgree of F IV');
        var scale = rn1.scale;
        equal (scale[0].name, "F", 'test scale is F');
        equal (rn1.root.name, "B-", 'test root of F IV');
        equal (rn1.impliedQuality, 'major', 'test quality is major');
        equal (rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
        equal (rn1.pitches[1].name, 'D', 'test pitches[1] == D');
        equal (rn1.pitches[2].name, 'F', 'test pitches[2] == F');
        equal (rn1.degreeName, 'Subdominant', 'test is Subdominant');   
    });


    test( "music21.stream.Stream", function() {
        var s = new music21.stream.Stream();
        s.append( new music21.note.Note("C#5"));
        s.append( new music21.note.Note("D#5"));
        var n =  new music21.note.Note("F5");
        n.duration.type = 'half';
        s.append(n);
        equal (s.length, 3, "Simple stream length");
    });

    test( "music21.stream.Stream.canvas", function() {
        var s = new music21.stream.Stream();
        s.append( new music21.note.Note("C#5"));
        s.append( new music21.note.Note("D#5"));
        var n =  new music21.note.Note("F5");
        n.duration.type = 'half';
        s.append(n);
        var c = s.createNewCanvas({}, 100, 50);
        equal (c.attr('width'), 100, 'stored width matches');
        equal (c.attr('height'), 50, 'stored height matches');
    });

    test( "music21.dynamics.Dynamic", function() {
        var dynamic = new music21.dynamics.Dynamic("pp");
        equal (dynamic.value, "pp", "matching dynamic");
        dynamic = new music21.dynamics.Dynamic(.98);
        equal (dynamic.value, "fff", "number conversion successful");
        equal (dynamic.volumeScalar, .98, "correct volume");
        equal (dynamic.longName, "fortississimo", "matching long name");
        equal (dynamic.englishName, "extremely loud", "matching english names");
        dynamic = new music21.dynamics.Dynamic("other");
        equal (dynamic.value, "other", "record non standard dynamic");
        equal (dynamic.longName, undefined, "no long name for non standard dynamic");
        equal (dynamic.englishName, undefined, "no english name for non standard dynamic");
        dynamic.value = .18;
        equal (dynamic.value, "pp", "change in dynamic");
        equal (dynamic.volumeScalar, .18, "change in volume");
        dynamic.value = "other";
        equal (dynamic.value, "other", "change to non standard");
        equal (dynamic.longName, undefined, "change to non standard dynamic");
        equal (dynamic.englishName, undefined, "change to non standard dynamic");
    });    
    
    QUnit.load();
    QUnit.start();

})

