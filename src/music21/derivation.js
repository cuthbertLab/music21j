
/**
 * @namespace music21.derivation
 * @memberOf music21.derivation
 */
export class Derivation {
    /**
     *
     * @param {music21.base.Music21Object} [client]
     * @property {string} [method]
     * @property {music21.base.Music21Object} [origin]
     */
    constructor(client) {
        this.client = client;
        this.method = undefined;
        this.origin = undefined;
    }

    clone() {
        const newThing = new Derivation(this.client);
        newThing.method = this.method;
        newThing.origin = this.origin;
    }

    * chain() {
        let origin = this.origin;
        while (origin !== undefined) {
            yield origin;
            origin = origin.derivation.origin;
        }
    }

    rootDerivation() {
        const derivationChain = Array.from(this.chain());
        if (derivationChain.length) {
            return derivationChain[derivationChain.length - 1];
        } else {
            return undefined;
        }
    }
}

export default Derivation;
