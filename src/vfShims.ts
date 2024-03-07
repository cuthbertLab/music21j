/**
 * music21j -- Javascript reimplementation of Core music21p features.
 * Copyright (c) 2013-24, Michael Scott Asato Cuthbert
 * Based on music21 (music21p), Copyright (c) 2006-24, Michael Scott Asato Cuthbert
 *
 * The infamous vfShims returns!  To fix things that Vexflow makes hard to fix!
 */

import {
    Annotation,
    AnnotationHorizontalJustify,
    log,
    type ModifierContextState,
    ModifierPosition,
    type StemmableNote,
    TextFormatter,
} from 'vexflow';

// eslint-disable-next-line
function L(...args: any[]) {
    if (VFLyricAnnotation.DEBUG) {
        log('Vex.Flow.Annotation', args);
    }
}

const original_Annotation_format = Annotation.format;
Annotation.format = function format(annotations: Annotation[], state: ModifierContextState): boolean {
    if (!annotations || annotations.length === 0) {
        return false;
    }
    if (!(annotations[0] instanceof VFLyricAnnotation)) {
        return original_Annotation_format.bind(this)(annotations, state);
    }
    return VFLyricAnnotation.format.bind(this)(annotations as VFLyricAnnotation[], state);
};
Annotation.format = Annotation.format.bind(Annotation);


export class VFLyricAnnotation extends Annotation {
    static DEBUG = true;

    static format(annotations: VFLyricAnnotation[], state: ModifierContextState): boolean {
        if (!annotations || annotations.length === 0) {
            return false;
        }
        let leftWidth = 0;
        let rightWidth = 0;
        let maxLeftGlyphWidth = 0;
        let maxRightGlyphWidth = 0;
        for (let i = 0; i < annotations.length; ++i) {
            const annotation = annotations[i];
            const textFormatter = TextFormatter.create(annotation.textFont);

            const note = annotation.checkAttachedNote();
            const glyphWidth = note.getGlyphProps().getWidth();
            // Get the text width from the font metrics.
            const textWidth = textFormatter.getWidthForTextInPx(annotation.text);
            if (annotation.horizontalJustification === AnnotationHorizontalJustify.LEFT) {
                maxLeftGlyphWidth = Math.max(glyphWidth, maxLeftGlyphWidth);
                leftWidth = Math.max(leftWidth, textWidth) + Annotation.minAnnotationPadding;
            } else if (annotation.horizontalJustification === AnnotationHorizontalJustify.RIGHT) {
                maxRightGlyphWidth = Math.max(glyphWidth, maxRightGlyphWidth);
                rightWidth = Math.max(rightWidth, textWidth);
            } else {
                leftWidth = Math.max(leftWidth, textWidth / 2) + Annotation.minAnnotationPadding;
                rightWidth = Math.max(rightWidth, textWidth / 2);
                maxLeftGlyphWidth = Math.max(glyphWidth / 2, maxLeftGlyphWidth);
                maxRightGlyphWidth = Math.max(glyphWidth / 2, maxRightGlyphWidth);
            }
        }
        const rightOverlap = Math.min(
            Math.max(rightWidth - maxRightGlyphWidth, 0),
            Math.max(rightWidth - state.right_shift, 0)
        );
        const leftOverlap = Math.min(
            Math.max(leftWidth - maxLeftGlyphWidth, 0),
            Math.max(leftWidth - state.left_shift, 0)
        );
        state.left_shift += leftOverlap;
        state.right_shift += rightOverlap;
        return true;
    }

    /** Render text below the note at the given staff line */
    draw(): void {
        L('text_line 1', this.text_line);
        const ctx = this.checkContext();
        const note = this.checkAttachedNote();
        const textFormatter = TextFormatter.create(this.textFont);
        const start_x = note.getModifierStartXY(ModifierPosition.ABOVE, this.index).x;

        this.setRendered();

        // We're changing context parameters. Save current state.
        ctx.save();
        // Apply style might not save context, if this.style is undefined, so we
        // still need to save context state just before this, since we will be
        // changing ctx parameters below.
        this.applyStyle();
        ctx.openGroup('annotation', this.getAttribute('id'));
        ctx.setFont(this.textFont);

        const text_width = textFormatter.getWidthForTextInPx(this.text);
        let x: number;

        if (this.horizontalJustification === AnnotationHorizontalJustify.LEFT) {
            x = start_x;
        } else if (this.horizontalJustification === AnnotationHorizontalJustify.RIGHT) {
            x = start_x - text_width;
        } else if (this.horizontalJustification === AnnotationHorizontalJustify.CENTER) {
            x = start_x - text_width / 2;
        } /* CENTER_STEM */ else {
            x = (note as StemmableNote).getStemX() - text_width / 2;
        }

        const stave = note.checkStave();
        L('text_line', this.text_line);
        const y = stave.getYForLine(this.text_line);

        L('Rendering annotation: ', this.text, x, y);
        ctx.fillText(this.text, x, y);
        ctx.closeGroup();
        this.restoreStyle();
        ctx.restore();
    }
}
