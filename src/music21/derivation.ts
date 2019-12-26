import { Music21Object } from './base';  // just for typing

export class Derivation {
    client: Music21Object;  // base.Music21Object
    method: string;
    origin: Music21Object;  // base.Music21Object

    constructor(client: Music21Object) {
        this.client = client;
    }

    clone(): Derivation {
        const newThing = new Derivation(this.client);
        newThing.method = this.method;
        newThing.origin = this.origin;
        return newThing;
    }

    * chain(): Generator<Music21Object, void, void> {
        let origin = this.origin;
        while (origin !== undefined) {
            yield origin;
            origin = origin.derivation.origin;
        }
    }

    rootDerivation(): Music21Object|undefined {
        const derivationChain = Array.from(this.chain());
        if (derivationChain.length) {
            return derivationChain[derivationChain.length - 1];
        } else {
            return undefined;
        }
    }
}


export default Derivation;
