import type * as note from '../note';
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
export declare function setStemDirectionOneGroup(group: note.NotRest[], { setNewStems, overrideConsistentStemDirections, }?: StemDirectionBeatGroupOptions): void;
//# sourceMappingURL=makeNotation.d.ts.map