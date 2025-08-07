/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * music21/stream/makeNotation -- notation making functions
 */
import * as beam from '../beam';
import * as clef from '../clef';

import type * as meter from '../meter';
import * as note from '../note';
import type * as pitch from '../pitch';
import * as stream from '../stream';
import {StreamException} from '../stream';
import {opFrac} from '../common';

export interface MakeBeamsOptions {
    inPlace?: boolean,
    setStemDirections?: boolean,
    failOnNoTimeSignature?: boolean,
}

export interface StemDirectionBeatGroupOptions {
    setNewStems?: boolean,
    overrideConsistentStemDirections?: boolean,
}

export interface IterateBeamGroupsOptions {
    skipNoBeams?: boolean,
    recurse?: boolean,
}

export function makeBeams(s: stream.Stream, {
    inPlace=false,
    setStemDirections=true,
    failOnNoTimeSignature=false,
}: MakeBeamsOptions = {}): stream.Stream {
    let returnObj: stream.Stream = s;
    if (!inPlace) {
        returnObj = s.clone(true);
    }
    let mColl: stream.Measure[];
    if (s.classes.includes('Measure')) {
        mColl = [returnObj as stream.Measure];
    } else {
        mColl = [];
        for (const m of returnObj.getElementsByClass('Measure')) {
            mColl.push(m as stream.Measure);
        }
    }
    let lastTimeSignature: meter.TimeSignature;
    for (const m of mColl) {
        lastTimeSignature = m.timeSignature || m.getContextByClass('TimeSignature');
        if (lastTimeSignature === undefined) {
            if (failOnNoTimeSignature) {
                throw new StreamException('Need a Time Signature to process beams');
            }
            continue;
        }
        if (m.recurse().notesAndRests.length <= 1) {
            continue; // nothing to beam.
        }
        const noteGroups = [];
        if (m.hasVoices()) {
            for (const v of m.voices) {
                noteGroups.push(v);
            }
        } else {
            noteGroups.push(m);
        }
        for (const noteGroup of noteGroups) {
            const noteStreamIterator = noteGroup.notesAndRests;
            const durList = [];
            for (const n of noteStreamIterator) {
                durList.push(n.duration);
            }
            const noteStream = noteStreamIterator.stream();

            const durSumErr = durList.map(a => a.quarterLength).reduce((total, val) => total + val, 0);
            const durSum = opFrac(durSumErr);  // remove fraction errors
            const barQL = lastTimeSignature.barDuration.quarterLength;
            if (durSum > barQL) {
                continue;
            }
            let offset = 0.0;
            if (m.paddingLeft !== 0.0 && m.paddingLeft !== undefined) {
                offset = m.paddingLeft;
            } else if (m.paddingRight === 0.0 && noteStream.highestTime < barQL) {
                offset = opFrac(barQL - noteStream.highestTime);
            }
            const beamsList = lastTimeSignature.getBeams(noteStream, { measureStartOffset: offset });
            for (let i = 0; i < noteStream.length; i++) {
                const n = noteStream.get(i) as note.NotRest;
                const thisBeams = beamsList[i];
                if (thisBeams !== undefined) {
                    n.beams = thisBeams;
                } else {
                    n.beams = new beam.Beams();
                }
            }
        }
    }

    if (setStemDirections) {
        setStemDirectionForBeamGroups(returnObj);
    }

    // returnObj.streamStatus.beams = true;
    return returnObj;
}

export function* iterateBeamGroups(
    s: stream.Stream,
    {
        skipNoBeams=true,
        recurse=true,
    }: IterateBeamGroupsOptions = {}
): Generator<note.NotRest[], void, void> {
    let iterator: stream.iterator.StreamIterator;
    if (recurse) {
        iterator = s.recurse();
    } else {
        iterator = s.iter;
    }
    let current_beam_group: note.NotRest[] = [];
    let in_beam_group: boolean = false;
    for (const untyped_el of iterator.getElementsByClass('NotRest')) {
        const el: note.NotRest = untyped_el as note.NotRest;
        let first_el_type: string;
        if (el.beams !== undefined && el.beams.getNumbers().includes(1)) {
            first_el_type = el.beams.getTypeByNumber(1);
        }

        if (first_el_type === 'start') {
            in_beam_group = true;
        }
        if (in_beam_group) {
            current_beam_group.push(el);
        }
        if (first_el_type === 'stop') {
            yield current_beam_group;
            current_beam_group = [];
            in_beam_group = false;
        } else if (!skipNoBeams && !in_beam_group) {
            yield [el];
        }
    }

    if (current_beam_group.length) {
        yield current_beam_group;
    }
}


export function setStemDirectionForBeamGroups(
    s: stream.Stream,
    {
        setNewStems=true,
        overrideConsistentStemDirections=false,
    }: StemDirectionBeatGroupOptions = {}
): void {
    for (const beamGroup of iterateBeamGroups(s, {skipNoBeams: true, recurse: true})) {
        setStemDirectionOneGroup(
            beamGroup,
            {setNewStems, overrideConsistentStemDirections},
        );
    }
}

/**
 * Sets the stem direction for unspecified notes.  For beamed notes,
 * they should have already had their stem directions set in setBeams
 */
export function setStemDirectionForUnspecified(
    s: stream.Stream,
): void {
    let single_clef_context: clef.Clef;
    const all_clefs = s.rc(clef.Clef);
    if (all_clefs.length === 1) {
        // most common. do one search;
        single_clef_context = all_clefs.first();
    } else if (all_clefs.length === 0) {
        // no clef here. in outer part;
        single_clef_context = s.getContextByClass(clef.Clef);
    }

    for (const n of s.rc(note.NotRest)) {
        if (n.pitches.length > 1) {
            const pitchSet = new Set(n.pitches.map(p => p.diatonicNoteNum));
            if (pitchSet.size < n.pitches.length) {
                // bug in Vexflow v4 at least -- chords with augmented seconds
                // and down stems do no render properly.
                // set their stems to 'unspecified' which Vexflow will currently
                // render as upstems.
                n.stemDirection = 'unspecified';
                continue;
            }
        }

        if (n.stemDirection !== 'unspecified') {
            continue;
        }
        let clef_context: clef.Clef;
        if (!single_clef_context) {
            // slower...
            clef_context = n.getContextByClass(clef.Clef);
        } else {
            clef_context = single_clef_context;
        }
        if (clef_context) {
            n.stemDirection = clef_context.getStemDirectionForPitches(n.pitches);
        }
    }
}

const _up_down: readonly string[] = ['up', 'down'];
const _up_down_unspecified: readonly string[] = ['up', 'down', 'unspecified'];

/**
 *  Set stem directions for all notes in a beam group.
 */
export function setStemDirectionOneGroup(
    group: note.NotRest[],
    {
        setNewStems=true,
        overrideConsistentStemDirections=false,
    }: StemDirectionBeatGroupOptions = {}
): void {
    if (!group.length) {
        return;  // should not happen
    }
    const stem_directions_found: Set<string> = new Set();
    for (const n of group) {
        if (_up_down_unspecified.includes(n.stemDirection)) {
            stem_directions_found.add(n.stemDirection);
        }
    }
    let has_consistent_stem_directions: boolean = false;
    if (stem_directions_found.has('unspecified')) {
        has_consistent_stem_directions = false;
    } else if (stem_directions_found.size < 2) {
        has_consistent_stem_directions = true;
    }

    const clef_context = group[0].getContextByClass(clef.Clef) as clef.Clef;
    if (clef_context === undefined) {
        return;
    }
    const pitchList: pitch.Pitch[] = [];
    for (const n of group) {
        pitchList.push(...n.pitches);
    }

    const groupStemDirection = clef_context.getStemDirectionForPitches(pitchList);
    for (const n of group) {
        const noteDirection = n.stemDirection;
        if (noteDirection === 'unspecified' && !setNewStems) {
            // continue
        } else if (_up_down.includes(noteDirection)
                   && !overrideConsistentStemDirections
                   && has_consistent_stem_directions) {
            // continue
        } else if (_up_down_unspecified.includes(noteDirection)) {
            n.stemDirection = groupStemDirection;
        }
    }
}
