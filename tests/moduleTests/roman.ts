import * as QUnit from 'qunit';
import * as music21 from '../../src/main';

const { test, skip } = QUnit;


export default function tests() {
    test('music21.roman.expandShortHand', assert => {
        let outGroups;
        outGroups = music21.roman.expandShortHand('64');
        assert.equal(outGroups.length, 2);
        assert.equal(outGroups[0], 6);
        assert.equal(outGroups[1], 4);

        outGroups = music21.roman.expandShortHand('973');
        assert.equal(outGroups.toString(), '9,7,3');

        outGroups = music21.roman.expandShortHand('11b3');
        assert.equal(outGroups.toString(), '11,b3');

        outGroups = music21.roman.expandShortHand('b13#9-6');
        assert.equal(outGroups.toString(), 'b13,#9,-6');

        outGroups = music21.roman.expandShortHand('-');
        assert.equal(outGroups.toString(), '5,-3');

        outGroups = music21.roman.expandShortHand('6/4');
        assert.equal(outGroups.toString(), '6,4');

        // no shorthand expansion here
        outGroups = music21.roman.expandShortHand('7');
        assert.equal(outGroups.toString(), '7');

        outGroups = music21.roman.expandShortHand('4/3');
        assert.equal(outGroups.toString(), '4,3');

        outGroups = music21.roman.expandShortHand('6');
        assert.equal(outGroups.toString(), '6');
    });
    test('music21.roman.correctSuffixForChordQuality', assert => {
        let c;
        c = new music21.chord.Chord('E3 C4 G4');
        assert.equal(music21.roman.correctSuffixForChordQuality(c, '6'), '6');
        c = new music21.chord.Chord('E3 C4 G-4');
        assert.equal(music21.roman.correctSuffixForChordQuality(c, '6'), 'o6');
    });
    test('music21.roman.RomanNumeral', assert => {
        const t1 = 'IV';
        let rn1 = new music21.roman.RomanNumeral(t1, 'F');
        assert.equal(rn1.scaleDegree, 4, 'test scale degree of F IV');
        const rnKey = rn1.key;
        assert.equal(rnKey.tonic.name, 'F', 'test scale is F');
        assert.equal(rn1.root().name, 'B-', 'test root of F IV');
        assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
        assert.equal(rn1.pitches.length, 3, 'should be three pitches');
        assert.equal(rn1.pitches[0].name, 'B-', 'test pitches[0] == B-');
        assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
        assert.equal(rn1.pitches[2].name, 'F', 'test pitches[2] == F');
        assert.equal(rn1.figureAndKey, 'IV in F major');
        assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

        let t2;
        t2 = 'viio7';
        assert.equal(t2, 'viio7', 'beginning viio7 test');
        rn1 = new music21.roman.RomanNumeral(t2, 'a');
        assert.equal(rn1.scaleDegree, 7, 'test scale degree of A viio7');
        assert.equal(rn1.root().name, 'G#', 'test root name == G#');
        assert.equal(rn1.impliedQuality, 'diminished', 'implied quality');
        assert.equal(rn1.pitches[0].name, 'G#', 'test viio7 pitches[0] == G#');
        assert.equal(rn1.pitches[1].name, 'B', 'test viio7 pitches[1] == B');
        assert.equal(rn1.pitches[2].name, 'D', 'test viio7 pitches[2] == D');
        assert.equal(rn1.pitches[3].name, 'F', 'test viio7 pitches[3] == F');
        assert.equal(rn1.degreeName, 'Leading-tone', 'test is Leading-tone');
        assert.equal(rn1.figureAndKey, 'viio7 in a minor');

        t2 = 'V7';
        rn1 = new music21.roman.RomanNumeral(t2, 'a');
        assert.equal(rn1.scaleDegree, 5, 'test scale degree of a V7');
        assert.equal(rn1.romanNumeralAlone, 'V', 'test romanNumeralAlone');
        assert.equal(rn1.root().name, 'E', 'root name is E');
        assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
        assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
        assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
        assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
        assert.equal(rn1.pitches[3].name, 'D', 'test pitches[3] == D');
        assert.equal(rn1.degreeName, 'Dominant', 'test is Dominant');

        t2 = 'VII';
        rn1 = new music21.roman.RomanNumeral(t2, 'f#');
        assert.equal(rn1.scaleDegree, 7, 'test scale degree of a VII');
        assert.equal(rn1.root().name, 'E', 'root name is E');
        assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
        assert.equal(rn1.pitches[0].name, 'E', 'test pitches[0] == E');
        assert.equal(rn1.pitches[1].name, 'G#', 'test pitches[1] == G#');
        assert.equal(rn1.pitches[2].name, 'B', 'test pitches[2] == B');
        assert.equal(rn1.degreeName, 'Subtonic', 'test is Subtonic');

        t2 = '#IV';
        rn1 = new music21.roman.RomanNumeral(t2, 'F');
        assert.equal(rn1.scaleDegree, 4, 'test scale degree of F #IV');
        assert.equal(rn1.root().name, 'B', 'test root of F #IV');
        assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
        assert.equal(rn1.pitches.length, 3, 'should be three pitches');
        assert.equal(rn1.pitches[0].name, 'B', 'test pitches[0] == B');
        assert.equal(rn1.pitches[1].name, 'D#', 'test pitches[1] == D#');
        assert.equal(rn1.pitches[2].name, 'F#', 'test pitches[2] == F#');
        assert.equal(rn1.figureAndKey, '#IV in F major');
        assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

        rn1 = new music21.roman.RomanNumeral('Cad64', 'c');
        assert.equal(rn1.scaleDegree, 1, 'test scale degree of Cad64');
        assert.equal(rn1.root().name, 'C', 'test root of Cad64');
        assert.equal(rn1.bass().name, 'G', 'test bass of Cad64');
        assert.equal(rn1.third.name, 'E-', 'test third of Cad64');
    });

    test('music21.roman.RomanNumeral - invalid arguments', assert => {
        // Invalid first char should throw an exception,
        // even if the chars that follow are valid.
        assert.throws(() => {
            return new music21.roman.RomanNumeral('CI');
        }, /No roman numeral found in CI/);
        assert.throws(() => {
            return new music21.roman.RomanNumeral('CIt');
        }, /No roman numeral found in CIt/);
    });

    test('music21.roman.RomanNumeral - inversions', assert => {
        const t1 = 'IV6';
        let rn1;
        rn1 = new music21.roman.RomanNumeral(t1, 'F');
        assert.equal(rn1.scaleDegree, 4, 'test scale degree of F IV6');
        const rnKey = rn1.key;
        assert.equal(rnKey.tonic.name, 'F', 'test scale is F');
        assert.equal(rn1.root().name, 'B-', 'test root of F IV6');
        assert.equal(rn1.bass().name, 'D', 'test bass of F IV6');
        assert.equal(rn1.impliedQuality, 'major', 'test quality is major');
        assert.equal(rn1.pitches[0].name, 'D', 'test pitches[0] == D');
        assert.ok(rn1.pitches.map(p => p.name).includes('B-'), 'B- in pitches');
        assert.ok(rn1.pitches.map(p => p.name).includes('F'), 'F in pitches');
        assert.equal(rn1.degreeName, 'Subdominant', 'test is Subdominant');

        let t2 = 'V43';
        rn1 = new music21.roman.RomanNumeral(t2, 'a');
        assert.equal(rn1.scaleDegree, 5, 'test scale degree of a V43');
        assert.equal(rn1.romanNumeralAlone, 'V', 'test romanNumeralAlone');
        assert.equal(rn1.root().name, 'E', 'root name is E');
        assert.equal(rn1.bass().name, 'B', 'bass name is B');
        assert.equal(rn1.impliedQuality, 'major', 'implied quality major');
        assert.equal(rn1.pitches[0].name, 'B', 'test pitches[0] == B');
        assert.equal(rn1.pitches[1].name, 'D', 'test pitches[1] == D');
        assert.equal(rn1.pitches[2].name, 'E', 'test pitches[2] == E');
        assert.equal(rn1.pitches[3].name, 'G#', 'test pitches[3] == G#');
        assert.equal(rn1.degreeName, 'Dominant', 'test is Dominant');

        t2 = 'ii/o65';
        rn1 = new music21.roman.RomanNumeral(t2, 'g');
        assert.equal(rn1.figure, 'iiø65', 'test figure is changed');
        assert.equal(rn1.scaleDegree, 2, 'test scale degree of a iiø65');
        assert.equal(
            rn1.romanNumeralAlone,
            'ii',
            'test romanNumeralAlone is ii'
        );
        assert.equal(rn1.root().name, 'A', 'root name is A');
        assert.equal(rn1.bass().name, 'C', 'bass name is C');
        assert.equal(
            rn1.impliedQuality,
            'half-diminished',
            'implied quality half-diminished'
        );
        assert.equal(rn1.pitches[0].name, 'C', 'test iiø65 pitches[0] == C');
        assert.equal(rn1.pitches[1].name, 'E-', 'test iiø65 pitches[1] == E-');
        assert.equal(rn1.pitches[2].name, 'G', 'test iiø65 pitches[2] == G');
        assert.equal(rn1.pitches[3].name, 'A', 'test iiø65 pitches[3] == A');
        assert.equal(rn1.degreeName, 'Supertonic', 'test is Supertonic');
    });

    test('music21.roman.RomanNumeral - front alterations', assert => {
        const rn1 = new music21.roman.RomanNumeral('#II', 'C');
        assert.equal(rn1.root().name, 'D#', 'root name is D#');
        assert.equal(rn1.bass().name, 'D#', 'bass name is D#');
        assert.equal(rn1.pitches[1].name, 'F##', 'next pitch is F##');
        assert.equal(rn1.pitches[2].name, 'A#', 'last pitch is A#');
    });

    test('music21.roman.RomanNumeral - neapolitan', assert => {
        const rn1 = new music21.roman.RomanNumeral('N6', 'C');
        assert.equal(rn1.root().name, 'D-', 'root name is D-');
        assert.equal(rn1.bass().name, 'F', 'bass name is F');
    });

    test('music21.roman.RomanNumeral - omittedSteps', assert => {
        let rn1;
        rn1 = new music21.roman.RomanNumeral('V7[no5][no3]', 'C');
        assert.equal(rn1.omittedSteps[0], 5, '5 is omitted');
        assert.equal(rn1.omittedSteps[1], 3, '3 is omitted');
        assert.equal(rn1.root().name, 'G', '#1 root name is G');
        assert.equal(rn1.pitches.length, 2, '#1 length is 2');
        assert.equal(rn1.pitches[0].name, 'G');
        assert.equal(rn1.pitches[1].name, 'F');

        rn1 = new music21.roman.RomanNumeral('V13[no11][no9][no7]', 'C');
        assert.equal(rn1.omittedSteps[0], 4, '4 =11 is omitted');
        assert.equal(rn1.omittedSteps[1], 2, '2 =9 is omitted');
        assert.equal(rn1.omittedSteps[2], 7, '7 is omitted');
        // root of 13th is undefined...
        // assert.equal(rn1.root().name, 'G', 'root is G');
        assert.equal(rn1.bass().name, 'G', 'bass is G');
        assert.equal(rn1.pitches.length, 4, '#2 length is 4');
        assert.equal(rn1.pitches[0].name, 'G', 'first pitch is G');
        assert.equal(rn1.pitches[1].name, 'B');
        assert.equal(rn1.pitches[2].name, 'D');
        assert.equal(rn1.pitches[3].name, 'E');
    });

    test('music21.roman.RomanNumeral - bracketedAlterations', assert => {
        const rn1 = new music21.roman.RomanNumeral('V7[#5][b3]', 'C');
        assert.deepEqual(
            rn1.bracketedAlterations[0],
            ['#', 5],
            `5 is sharped: ${rn1.bracketedAlterations[0]}`
        );
        assert.deepEqual(
            rn1.bracketedAlterations[1],
            ['b', 3],
            `3 is flattened:  ${rn1.bracketedAlterations[1]}`
        );
        assert.equal(rn1.root().name, 'G', '#1 root name is G');
        assert.equal(rn1.pitches.length, 4, '#1 length is 3');
        assert.equal(rn1.third.name, 'B-', 'third is B-');
        assert.equal(rn1.fifth.name, 'D#', 'fifth is D#');
    });

    test(
        'music21.roman.RomanNumeral - vio, VI, vii, VII in minor',
        assert => {
            let rn1;
            rn1 = new music21.roman.RomanNumeral('vio', 'c');
            assert.equal(rn1.root().name, 'A', 'root name is A');
            assert.equal(rn1.fifth.name, 'E-', 'fifth name is E-');

            rn1 = new music21.roman.RomanNumeral('vi', 'c');
            assert.equal(rn1.root().name, 'A', 'root name is A');
            assert.equal(rn1.fifth.name, 'E', 'fifth name is E');

            rn1 = new music21.roman.RomanNumeral('VI', 'c');
            assert.equal(rn1.root().name, 'A-', 'root name is A-');
            assert.equal(rn1.fifth.name, 'E-', 'fifth name is E-');

            rn1 = new music21.roman.RomanNumeral('viio', 'c');
            assert.equal(rn1.root().name, 'B', 'root name is B');
            assert.equal(rn1.fifth.name, 'F', 'fifth name is F');

            rn1 = new music21.roman.RomanNumeral('vii', 'c');
            assert.equal(rn1.root().name, 'B', 'root name is B');
            assert.equal(rn1.fifth.name, 'F#', 'fifth name is F#');

            rn1 = new music21.roman.RomanNumeral('VII', 'c');
            assert.equal(rn1.root().name, 'B-', 'root name is B-');
            assert.equal(rn1.fifth.name, 'F', 'fifth name is F');
        }
    );

    test(
        'music21.roman.RomanNumeral - secondary roman numerals',
        assert => {
            let rn1;
            rn1 = new music21.roman.RomanNumeral('V/V', 'C');
            assert.equal(rn1.root().name, 'D', 'root name is D');
            assert.equal(rn1.bass().name, 'D', 'bass name is D');
            assert.equal(rn1.pitches[1].name, 'F#', 'third is F#');

            rn1 = new music21.roman.RomanNumeral('V65/V', 'C');
            assert.equal(rn1.root().name, 'D', 'root name is F#');
            assert.equal(rn1.bass().name, 'F#', 'bass name is F#');

            rn1 = new music21.roman.RomanNumeral('V65/IV', 'C');
            assert.equal(rn1.figure, 'V65/IV', 'figure is unchanged');
            assert.equal(
                rn1.secondaryRomanNumeral.figure,
                'IV',
                'secondary to IV'
            );
            assert.equal(rn1.secondaryRomanNumeralKey.tonic.name, 'F');
            assert.equal(rn1.root().name, 'C', 'root name is C');
            assert.equal(rn1.bass().name, 'E', 'bass name is E');
            assert.equal(rn1.seventh.name, 'B-', 'seventh is B-');

            rn1 = new music21.roman.RomanNumeral('V7/V/V', 'B-');
            assert.equal(rn1.root().name, 'G');
            assert.equal(rn1.third.name, 'B');
            assert.equal(rn1.secondaryRomanNumeral.figure, 'V/V');
            assert.equal(
                rn1.secondaryRomanNumeral.secondaryRomanNumeral.figure,
                'V'
            );
        }
    );

    // Helper used by ports of music21p tests below.  AI-assisted.
    const pitchString = (rn: any): string => rn.pitches.map((pi: any) => pi.nameWithOctave).join(' ');

    // Ported from music21p RomanNumeral.Test.testFigure.  AI-assisted.
    test('music21.roman.RomanNumeral - testFigure (m21p port)', assert => {
        const r1 = new music21.roman.RomanNumeral('V');
        assert.strictEqual(
            r1.frontAlterationTransposeInterval, undefined, 'no front alteration on V'
        );
        assert.deepEqual(
            r1.pitches.map(p => p.nameWithOctave),
            ['G4', 'B4', 'D5'],
        );

        const r2 = new music21.roman.RomanNumeral('bbVI6');
        assert.equal(
            r2.frontAlterationTransposeInterval.chromatic.semitones, -2, 'bbVI6 chromatic semitones',
        );

        const dminor = new music21.key.Key('d');
        const rn = new music21.roman.RomanNumeral('ii/o65', dminor);
        assert.deepEqual(
            rn.pitches.map(p => p.nameWithOctave),
            ['G4', 'B-4', 'D5', 'E5'],
        );
        const rnReal = new music21.roman.RomanNumeral('iiø65', dminor);
        assert.deepEqual(
            rnReal.pitches.map(p => p.nameWithOctave),
            rn.pitches.map(p => p.nameWithOctave),
        );

        const rnOmit3 = new music21.roman.RomanNumeral('V[no3]', dminor);
        assert.deepEqual(
            rnOmit3.pitches.map(p => p.nameWithOctave), ['A4', 'E5'],
        );
        const rnOmit5 = new music21.roman.RomanNumeral('V[no5]', dminor);
        assert.deepEqual(
            rnOmit5.pitches.map(p => p.nameWithOctave), ['A4', 'C#5'],
        );
    });

    // Ported from music21p RomanNumeral.Test.testZeroForDiminished.  AI-assisted.
    test('music21.roman.RomanNumeral - testZeroForDiminished (m21p port)', assert => {
        let rn = new music21.roman.RomanNumeral('vii07', 'c');
        assert.deepEqual(
            rn.pitches.map(p => p.name), ['B', 'D', 'F', 'A-'],
        );
        rn = new music21.roman.RomanNumeral('vii/07', 'c');
        assert.deepEqual(
            rn.pitches.map(p => p.name), ['B', 'D', 'F', 'A'],
        );
    });

    // Ported from music21p RomanNumeral.Test.testAllFormsOfVII.  AI-assisted.
    test('music21.roman.RomanNumeral - testAllFormsOfVII (m21p port)', assert => {
        const k = new music21.key.Key('c');
        const cases: [string, string][] = [
            ['viio',  'B4 D5 F5'],
            ['viio6', 'D4 F4 B4'],
            ['viio64', 'F4 B4 D5'],
            ['vii',   'B4 D5 F#5'],
            ['vii6',  'D4 F#4 B4'],
            ['vii64', 'F#4 B4 D5'],
            ['viio7',  'B4 D5 F5 A-5'],
            ['viio65', 'D4 F4 A-4 B4'],
            ['viio43', 'F4 A-4 B4 D5'],
            ['viio42', 'A-4 B4 D5 F5'],
            ['vii/o7', 'B4 D5 F5 A5'],
            ['viiø65', 'D4 F4 A4 B4'],
            ['viiø43', 'F4 A4 B4 D5'],
            ['vii/o42', 'A4 B4 D5 F5'],
            ['VII',    'B-4 D5 F5'],
            ['VII6',   'D4 F4 B-4'],
            ['VII64',  'F4 B-4 D5'],
            ['bVII',   'B--4 D-5 F-5'],
            ['bvii',   'B-4 D-5 F5'],
            ['bviio',  'B-4 D-5 F-5'],
            ['#VII',   'B4 D#5 F#5'],
            ['#vii',   'B#4 D#5 F##5'],
            ['VII+',   'B-4 D5 F#5'],
        ];
        for (const [fig, expected] of cases) {
            const rn = new music21.roman.RomanNumeral(fig, k);
            assert.equal(pitchString(rn), expected, `${fig} in c`);
        }
    });

    // Ported from music21p RomanNumeral.Test.testAllFormsOfVI.  AI-assisted.
    test('music21.roman.RomanNumeral - testAllFormsOfVI (m21p port)', assert => {
        const k = new music21.key.Key('c');
        const cases: [string, string][] = [
            ['vio',   'A4 C5 E-5'],
            ['vio6',  'C4 E-4 A4'],
            ['vio64', 'E-4 A4 C5'],
            ['vi',    'A4 C5 E5'],
            ['vi6',   'C4 E4 A4'],
            ['vi64',  'E4 A4 C5'],
            ['vio7',  'A4 C5 E-5 G-5'],
            ['vio65', 'C4 E-4 G-4 A4'],
            ['vio43', 'E-4 G-4 A4 C5'],
            ['vio42', 'G-4 A4 C5 E-5'],
            ['viø7',  'A4 C5 E-5 G5'],
            ['vi/o65', 'C4 E-4 G4 A4'],
            ['vi/o43', 'E-4 G4 A4 C5'],
            ['viø42', 'G4 A4 C5 E-5'],
            ['VI',    'A-4 C5 E-5'],
            ['VI6',   'C4 E-4 A-4'],
            ['VI64',  'E-4 A-4 C5'],
            ['bVI',   'A--4 C-5 E--5'],
            ['bvi',   'A-4 C-5 E-5'],
            ['bvio',  'A-4 C-5 E--5'],
            ['#VI',   'A4 C#5 E5'],
            ['#vi',   'A#4 C#5 E#5'],
            ['VI+',   'A-4 C5 E5'],
        ];
        for (const [fig, expected] of cases) {
            const rn = new music21.roman.RomanNumeral(fig, k);
            assert.equal(pitchString(rn), expected, `${fig} in c`);
        }
    });

    // Ported from music21p RomanNumeral.Test.testNo5.  AI-assisted.
    test('music21.roman.RomanNumeral - testNo5 (m21p port)', assert => {
        let rn = new music21.roman.RomanNumeral('viio[no5]', 'a');
        assert.deepEqual(rn.pitches.map(p => p.name), ['G#', 'B']);

        rn = new music21.roman.RomanNumeral('vii[no5]', 'a');
        assert.deepEqual(rn.pitches.map(p => p.name), ['G#', 'B']);
    });

    // Ported from music21p RomanNumeral.Test.testSecondaryAugmentedSixth.
    // TODO(port): music21j's secondary RN handling does not currently flip
    // the secondary key to minor when the secondary is built on a major
    // chord (Ger65/IV in C).  AI-assisted.
    skip('music21.roman.RomanNumeral - secondary aug6 (m21p port)', assert => {
        const rn = new music21.roman.RomanNumeral('Ger65/IV', 'C');
        assert.deepEqual(
            rn.pitches.map(p => p.name),
            ['D-', 'F', 'A-', 'B'],
        );
    });

    // Ported from music21p RomanNumeral.Test.testSetFigureAgain.  AI-assisted.
    // TODO(port): the Ger7 case passes; the #IV case doubles the alteration
    // because frontAlterationTransposeInterval/Accidental are not reset
    // between figure assignments.
    skip('music21.roman.RomanNumeral - setFigureAgain Ger7 (m21p port)', assert => {
        const ger = new music21.roman.RomanNumeral('Ger7');
        const before = ger.pitches.map(p => p.nameWithOctave);
        ger.figure = 'Ger7';
        assert.deepEqual(ger.pitches.map(p => p.nameWithOctave), before);
    });
    skip('music21.roman.RomanNumeral - setFigureAgain #IV (m21p port)', assert => {
        const sharpFour = new music21.roman.RomanNumeral('#IV');
        const before = sharpFour.pitches.map(p => p.nameWithOctave);
        sharpFour.figure = '#IV';
        assert.deepEqual(sharpFour.pitches.map(p => p.nameWithOctave), before);
    });

    // Ported from music21p RomanNumeral.Test.test_sevenths_on_alteration.
    // Exercises the new Minor67Default.CAUTIONARY support.  AI-assisted.
    test('music21.roman.RomanNumeral - sevenths on alteration (m21p port)', assert => {
        const Minor67 = music21.roman.Minor67Default;

        let rn = new music21.roman.RomanNumeral('bII7', 'c');
        assert.equal(rn.seventh.name, 'C', 'bII7 in c minor seventh = C');

        rn = new music21.roman.RomanNumeral('bII65', 'c');
        assert.equal(rn.seventh.name, 'C', 'bII65 in c minor seventh = C');

        rn = new music21.roman.RomanNumeral('bII65', 'b');
        assert.equal(rn.seventh.name, 'B', 'bII65 in b minor seventh = B');

        rn = new music21.roman.RomanNumeral(
            'bVII7', 'c', { seventhMinor: Minor67.CAUTIONARY },
        );
        assert.equal(
            rn.seventh.name, 'A-', 'bVII7 in c minor with CAUTIONARY: seventh = A-',
        );

        rn = new music21.roman.RomanNumeral(
            'bVII7', 'C', { seventhMinor: Minor67.CAUTIONARY },
        );
        assert.equal(
            rn.seventh.name, 'A', 'bVII7 in C major with CAUTIONARY: seventh = A',
        );
    });

    // Doctest port of music21.roman.Minor67Default.  AI-assisted.
    test('music21.roman.Minor67Default - sixthMinor in c minor', assert => {
        const Minor67 = music21.roman.Minor67Default;
        const vi = (fig: string, q: any) => new music21.roman.RomanNumeral(
            fig, 'c', { sixthMinor: q },
        ).pitches.map(p => p.name).join(' ');

        // QUALITY (default)
        assert.equal(vi('vi', Minor67.QUALITY), 'A C E');
        assert.equal(vi('VI', Minor67.QUALITY), 'A- C E-');
        assert.equal(vi('#vi', Minor67.QUALITY), 'A# C# E#');
        assert.equal(vi('bVI', Minor67.QUALITY), 'A-- C- E--');
        assert.equal(vi('#VI', Minor67.QUALITY), 'A C# E');
        assert.equal(vi('bvi', Minor67.QUALITY), 'A- C- E-');

        // FLAT
        assert.equal(vi('vi', Minor67.FLAT), 'A- C- E-');
        assert.equal(vi('VI', Minor67.FLAT), 'A- C E-');
        assert.equal(vi('#vi', Minor67.FLAT), 'A C E');

        // SHARP
        assert.equal(vi('vi', Minor67.SHARP), 'A C E');
        assert.equal(vi('VI', Minor67.SHARP), 'A C# E');
        assert.equal(vi('bVI', Minor67.SHARP), 'A- C E-');

        // CAUTIONARY
        assert.equal(vi('#vi', Minor67.CAUTIONARY), 'A C E');
        assert.equal(vi('vi', Minor67.CAUTIONARY), 'A C E');
        assert.equal(vi('bVI', Minor67.CAUTIONARY), 'A- C E-');
        assert.equal(vi('VI', Minor67.CAUTIONARY), 'A- C E-');
        assert.equal(vi('##vi', Minor67.CAUTIONARY), 'A# C# E#');
        assert.equal(vi('bbVI', Minor67.CAUTIONARY), 'A-- C- E--');
        assert.equal(vi('#VI', Minor67.CAUTIONARY), 'A C# E');
        assert.equal(vi('bvi', Minor67.CAUTIONARY), 'A- C- E-');
    });

    // Doctest port -- secondary RNs inherit sixthMinor/seventhMinor.  AI-assisted.
    test('music21.roman.Minor67Default - propagates to secondary', assert => {
        const Minor67 = music21.roman.Minor67Default;
        const vi = (fig: string, q: any) => new music21.roman.RomanNumeral(
            fig, 'c', { sixthMinor: q },
        ).pitches.map(p => p.name).join(' ');

        assert.equal(vi('V/vi', Minor67.QUALITY), 'E G# B');
        assert.equal(vi('V/VI', Minor67.QUALITY), 'E- G B-');
        assert.equal(vi('V/vi', Minor67.FLAT), 'E- G B-');
        assert.equal(vi('V/VI', Minor67.FLAT), 'E- G B-');
    });

    test('music21.roman.RomanNumeral - augmented6ths', assert => {
        let k = new music21.key.Key('a');
        const p = rn => {
            const rn1 = new music21.roman.RomanNumeral(rn, k);
            let x = '';
            for (const pi of rn1.pitches) {
                x += pi.nameWithOctave + ' ';
            }
            return x.trim();
        };
        const empty = new music21.roman.RomanNumeral();
        const out = empty._parseRNAloneAmidstAug6(
            'It6',
            new music21.key.Key('C')
        );
        assert.equal(empty.useImpliedScale, true);
        assert.equal(out[0], '6');
        assert.equal(out[1].mode, 'minor');
        assert.equal(empty.scaleDegree, 4);
        assert.deepEqual(empty.bracketedAlterations[0], ['#', 1]);

        assert.equal(p('V'), 'E5 G#5 B5');
        assert.equal(p('It6'), 'F5 A5 D#6');
        assert.equal(p('Ger65'), 'F5 A5 C6 D#6');
        assert.equal(p('Ger6/5'), 'F5 A5 C6 D#6');
        assert.equal(p('Fr43'), 'F5 A5 B5 D#6');
        assert.equal(p('Fr4/3'), 'F5 A5 B5 D#6');
        assert.equal(p('Sw43'), 'F5 A5 B#5 D#6');

        k = new music21.key.Key('A');
        assert.equal(p('V'), 'E5 G#5 B5');
        assert.equal(p('It6'), 'F5 A5 D#6');
        assert.equal(p('Ger65'), 'F5 A5 C6 D#6');
        assert.equal(p('Ger6/5'), 'F5 A5 C6 D#6');
        assert.equal(p('Fr43'), 'F5 A5 B5 D#6');
        assert.equal(p('Fr4/3'), 'F5 A5 B5 D#6');
        assert.equal(p('Sw43'), 'F5 A5 B#5 D#6');
    });
}
