import * as note from '../note';
import * as stream from '../stream';
export interface MakeBeamsOptions {
    inPlace?: boolean;
    setStemDirections?: boolean;
    failOnNoTimeSignature?: boolean;
}
export interface StemDirectionBeatGroupOptions {
    setNewStems?: boolean;
    overrideConsistentStemDirections?: boolean;
}
export interface IterateBeamGroupsOptions {
    skipNoBeams?: boolean;
    recurse?: boolean;
}
export declare function makeBeams(s: stream.Stream, { inPlace, setStemDirections, failOnNoTimeSignature, }?: MakeBeamsOptions): stream.Stream;
export declare function iterateBeamGroups(s: stream.Stream, { skipNoBeams, recurse, }?: IterateBeamGroupsOptions): Generator<note.NotRest[], void, void>;
export declare function setStemDirectionForBeamGroups(s: stream.Stream, { setNewStems, overrideConsistentStemDirections, }?: StemDirectionBeatGroupOptions): void;
/**
 * Sets the stem direction for unspecified notes.  For beamed notes,
 * they should have already had their stem directions set in setBeams
 */
export declare function setStemDirectionForUnspecified(s: stream.Stream): void;
/**
 *  Set stem directions for all notes in a beam group.
 */
export declare function setStemDirectionOneGroup(group: note.NotRest[], { setNewStems, overrideConsistentStemDirections, }?: StemDirectionBeatGroupOptions): void;
//# sourceMappingURL=makeNotation.d.ts.map