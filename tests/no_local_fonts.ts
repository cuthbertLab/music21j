/**
 * Shared helpers for the NO_LOCAL_FONTS test mode.
 *
 * When NO_LOCAL_FONTS=1 is set in environment, the test page renders as if no SMuFL
 * music font (Bravura, Petaluma, Gonville, Leland, Maestro, etc.) were
 * installed locally on the developer's machine -- useful on macOS, where a
 * developer-installed Bravura would otherwise mask the experience of a user
 * who lacks it.
 *
 * The mechanism is a set of @font-face rules whose only `src` is a local()
 * lookup at a non-existent PostScript name.  The browser resolves these
 * before any system lookup, so any local copy of the listed families is
 * shadowed.  Fonts genuinely served via @font-face url(...) (data: URLs
 * included, e.g. vexflow's bundled Bravura) are unaffected.
 */

// AI-assisted
export const BLOCKED_MUSIC_FONT_FAMILIES = [
    'Bravura', 'Bravura Text',
    'Petaluma', 'Petaluma Script',
    'Gonville', 'Leland', 'Leland Text',
    'Maestro', 'Opus', 'Sonata',
];

// AI-assisted
export function buildNoLocalFontsCss(): string {
    return BLOCKED_MUSIC_FONT_FAMILIES.map(family => (
        `@font-face { font-family: '${family}'; `
        + 'src: local(\'__m21j_no_such_font__\'); '
        + 'font-display: block; }'
    )).join('\n');
}
