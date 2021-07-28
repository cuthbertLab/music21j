import { Music21Object } from './base';
export declare class Derivation {
    client: Music21Object;
    method: string;
    origin: Music21Object;
    constructor(client: Music21Object);
    clone(): Derivation;
    chain(): Generator<Music21Object, void, void>;
    rootDerivation(): Music21Object | undefined;
}
export default Derivation;
//# sourceMappingURL=derivation.d.ts.map