/**
 * Shared helpers for tests that check what actually reached the screen.
 * AI-assisted.
 */

/**
 * Noteheads drawn inside `where` -- an element returned by appendNewDOM(),
 * createDOM(), and friends.
 */
export function renderedNoteheads(where: HTMLElement): Element[] {
    return Array.from(where.querySelectorAll('svg .vf-notehead'));
}

/**
 * Did `where` get a stave with at least one note drawn on it?
 *
 * An empty stream still draws a stave and a clef, so the noteheads are what
 * separate real music from an empty system.
 */
export function wasMusicRendered(where: HTMLElement): boolean {
    return (
        where.querySelector('svg .vf-stave') !== null
        && renderedNoteheads(where).length > 0
    );
}
