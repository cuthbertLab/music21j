import * as QUnit from 'qunit';
import * as music21 from '../../src/music21_modules';

const { test } = QUnit;


export default function tests() {

    test('music21.pitch.Accidental', assert => {
        const a = new music21.pitch.Accidental('-');
        assert.equal(a.alter, -1.0, 'flat alter passed');
        assert.equal(a.name, 'flat', 'flat name passed');
        a.name = 'sharp';
        assert.equal(a.alter, 1.0, 'flat alter passed');
        assert.equal(a.name, 'sharp', 'flat name passed');

        const b = new music21.pitch.Accidental('b');
        assert.equal(b.alter, -1.0, 'flat alter passed');
        assert.equal(b.name, 'flat', 'flat name passed');
    });

    test('music21.pitch.Pitch', assert => {
        const p = new music21.pitch.Pitch('D#5');
        assert.equal(p.name, 'D#', 'Pitch Name set to D#');
        assert.equal(p.step, 'D', 'Pitch Step set to D');
        assert.equal(p.octave, 5, 'Pitch octave set to 5');
        assert.equal(p.nameWithOctave, 'D#5', 'Name with octave');
        const c = new music21.clef.AltoClef();
        const vfn = p.vexflowName(c);
        assert.equal(vfn, 'C#/6', 'Vexflow name set');
    });

    test('music21.pitch.Pitch enharmonics', assert => {
        const es = new music21.pitch.Pitch('E-5');
        const dis = es.getLowerEnharmonic();
        assert.equal(es.name, 'E-', 'Original Pitch Name unchanged');
        assert.equal(dis.name, 'D#', 'Pitch Name set to D#');
        assert.equal(dis.step, 'D', 'Pitch Step set to D');
        assert.equal(dis.octave, 5, 'Pitch octave set to 5');

        // inPlace
        dis.getHigherEnharmonic(true); // inPlace
        assert.equal(dis.nameWithOctave, es.nameWithOctave);

        const cDblSharp = new music21.pitch.Pitch('C##5');
        const dNatural = cDblSharp.getHigherEnharmonic();
        assert.equal(cDblSharp.ps, dNatural.ps);
        assert.equal(dNatural.name, 'D', 'C## higher is D');
        assert.equal(dNatural.octave, 5, 'Octave is 5');
        const bTripleSharp = cDblSharp.getLowerEnharmonic();
        assert.equal(cDblSharp.ps, bTripleSharp.ps);
        assert.equal(bTripleSharp.octave, 4, 'Octave is 4 [B###]');

        const cDblFlat = new music21.pitch.Pitch('C--5');
        const bFlat = cDblFlat.getLowerEnharmonic();
        assert.equal(cDblFlat.ps, bFlat.ps);


        // once octaveless pitches exist...
        // const octaveless = new music21.pitch.Pitch('C');
        // const bSharp = octaveless.getLowerEnharmonic();
        // assert.equal(octaveless.octave, undefined, 'octave should be undefined');
        // assert.equal(bSharp.octave, undefined, 'octave should be undefined');
        // assert.equal(bSharp.name, 'B#');

    });

    test('music21.pitch.Pitch Equality', assert => {
        const pitch_pairs = [
            ['a#', 'a', false],
            ['a#', 'b-', false], 
            ['a#', 'a-', false], 
            ['a##', 'a#', false],
            ['a#4', 'a#4', true], 
            ['a-3', 'a-4', false], 
            ['a#3', 'a#4', false]
        ];
        
        for (const pair of pitch_pairs) {
            const p1 = new music21.pitch.Pitch(pair[0]);
            const p2 = new music21.pitch.Pitch(pair[1]);
            if (!pair[2]) {
                assert.notDeepEqual(p1, p2, 'Not Equal');
            }
            else if (pair[2]) {
                assert.deepEqual(p1, p2, 'Equal');
            }
               
        }
        const p1 = new music21.pitch.Pitch('a#');
        const p2 = new music21.pitch.Pitch('a#');
        assert.deepEqual(p1, p2, 'Pitch is Equal');
        p1.octave = 4; 
        p2.octave = 3;
        assert.notDeepEqual(p1, p2, 'Pitch with changed octaves are not equal');
        p1.octave = 4; 
        p2.octave = 4;
        assert.deepEqual(p1, p2, 'Pitch with reverted octaves are equal');
    });

    // Awaiting .xml file input
    /*
    test('music21.pitch.Accidental Import', assert => {
        // Corpus Parsing
        const piece = corpus.parse('bwv438.xml');
        const tenorMeasures = piece.parts[2].getElementsByClass('Measure');
        const pAltered = tenorMeasures[0].pitches[1];
        assert.equal(pAltered.accidental.name, 'flat', 'Accidental is Flat');
        assert.equal(pAltered.accidental.displayType, 'normal', 'Display type Normal');
        assert.notEqual(pAltered.accidental.displayStatus, false, 'Display status is Flase');
        const altoM6 = piece.parts[1].measure(6);
        const pAltered = altoM6.pitches[2];
        asert.equal(pAltered.accidental.name, 'sharp', "Accidental is Sharp");
        assert.equal(pAltered.accidental.displayStatus, 'true', 'Display Status is True');
    });
    */
    test('music21.pitch.Update Accidental Display Simple', assert => {
        // Used in Python, never utilized here though. Copied over for posterity
        // const pastPitch = [
        //   new music21.pitch.Pitch('a3#'), 
        //   new music21.pitch.Pitch('c#'), 
        //   new music21.pitch.Pitch('c')
        // ];
        const a = new music21.pitch.Pitch('c');
        a.accidental = new music21.pitch.Accidental('natural');
        a.accidental.displayStatus = false; // displays status does not exist?
        assert.equal(a.name, 'C', 'Name is C');
        assert.equal(a.accidental.displayStatus, false, 'Not Displayed');
        // a.updateAccidentalDisplay(past, overrideStatus=True) // function does not exist
        a.accidental.displayStatus = true; // Used instead
        assert.equal(a.accidental.displayStatus, true, 'Displayed');
        const b = a.clone();
        assert.equal(b.accidental.displayStatus, true, 'Displayed');
        assert.equal(b.accidental.name, 'natural', 'Natural');

    });

    test('music21.pitch.Accidentals Cautionary', assert => {
        //const conv = music21.key.convertKeyStringToMusic21KeyString;
        const bm = new music21.tinyNotation.TinyNotation("tinynotation: 4/4 fn1 fn1 e-8 e'-8 fn4 en4 e'n4").flat;
        // Function does not work, stream.ts 1353
        //bm.makeNotation(inPlace=True, cautionaryNotImmediateRepeat=False);  

        // Possible bug, first note has accidental information undefined
        assert.equal(bm.flat.elements[2].pitches.accidental, undefined, 'Undefined');
        
        // displayStatus not defined in Note class, or Renamed
        // assert.equal(bm.flat.elements[2].pitch.accName.displayStatus, 'True');
        assert.equal(bm.flat.elements[3].pitch.accidental.name, 'natural', 'Natural');
        //assert.equal(bm.flat.elements[3].pitch.accidental.displayStatus, 'True');
        assert.equal(bm.flat.elements[4].pitch.accidental.name, 'natural', 'Natural');  
        //assert.equal(bm.flat.elements[4].pitch.accidental.displayStatus, 'True');
        assert.equal(bm.flat.elements[5].pitch.accidental.name, 'flat', 'Flat');    
        //assert.equal(bm.flat.elements[5].pitch.accidental.displayStatus, 'True');
        assert.equal(bm.flat.elements[6].pitch.accidental.name, 'flat', 'Flat');    
        //assert.equal(bm.flat.elements[6].pitch.accidental.displayStatus, 'True');
        assert.equal(bm.flat.elements[7].pitch.accidental.name, 'natural', 'Natural');   
        //assert.equal(bm.flat.elements[7].pitch.accidental.displayStatus, 'True');
        assert.notEqual(bm.flat.elements[8].pitch.accidental, 'None', 'None');
        assert.notEqual(bm.flat.elements[8].pitch.accidental.name, 'flat', 'Natural');
        //assert.notEqual(bm.flat.notes[8].pitch.accidental.displayStatus, 'True');
    });

    /* // Transpose is Not Implemented in pitch class
    test('music21.pitch.Low Notes', assert => {
        const dPitch = new music21.pitch.Pitch('D2');
        const lowC = dPitch.transpose('M-23')
        assert.equal(lowC.name, 'C', 'C');
        assert.equal(lowC.octave, -1, '-1'); 
    });
    */ 

    /* // Microtones not supported in Pitch class @ 285 
    test('music21.pitch.Microtone A', assert => {
        let p = new music21.pitch.Pitch('a4');
        p.microtone = 25;
        console.log(p);
        assert.equal(p.toString(), 'A4(+25c)');
        assert.equal(p.ps, 69.25);
        p.microtone = '-10';
        assert.equal(p.toString(), 'A4(-10c)');
        assert.equal(p.ps, 68.90);
        assert.equal(p.pitchClass, 9);
        p = p.transpose(12);
        assert.equal(p.toString(), 'A5(-10c)');
        assert.equal(p.ps, 80.90);

    });
    */
}
