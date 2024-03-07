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
    SVGContext,
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
    static DEBUG = false;
    fill: string;

    static format(annotations: VFLyricAnnotation[], state: ModifierContextState): boolean {
        if (!annotations || annotations.length === 0) {
            return false;
        }
        let leftWidth = 0;
        let rightWidth = 0;
        for (let i = 0; i < annotations.length; ++i) {
            const annotation = annotations[i];

            const note = annotation.checkAttachedNote();
            const ctx = note.checkContext();
            ctx.save();
            ctx.setFont(annotation.fontInfo);
            if (annotation.fill) {
                ctx.setFillStyle(annotation.fill);
            }
            const textWidth = ctx.measureText(annotation.text).width;
            ctx.restore();

            // Get the text width from the font metrics.
            if (annotation.horizontalJustification === AnnotationHorizontalJustify.RIGHT) {
                leftWidth = Math.max(leftWidth, textWidth + Annotation.minAnnotationPadding);
            } else if (annotation.horizontalJustification === AnnotationHorizontalJustify.LEFT) {
                rightWidth = Math.max(rightWidth, textWidth);
            } else {
                leftWidth = Math.max(leftWidth, textWidth / 2 + Annotation.minAnnotationPadding);
                rightWidth = Math.max(rightWidth, textWidth / 2);
            }
        }
        const rightOverlap = Math.max(rightWidth - state.right_shift, 0);
        const leftOverlap = Math.max(leftWidth - state.left_shift, 0);
        state.left_shift += leftOverlap;
        state.right_shift += rightOverlap;
        return true;
    }

    getFill(): string {
        return this.fill;
    }

    setFill(color: string) {
        this.fill = color;
    }

    /** Render text below the note at the given staff line */
    draw(): void {
        const ctx = <SVGContext> this.checkContext();
        if (ctx.svg === undefined) {
            throw new Error('Can only add lyrics to SVG Context not Canvas');
        }
        const note = this.checkAttachedNote();
        // const textFormatter = TextFormatter.create(this.textFont);
        let x = note.getModifierStartXY(ModifierPosition.ABOVE, this.index).x;
        if (this.horizontalJustification === AnnotationHorizontalJustify.LEFT) {
            x -= note.getGlyphWidth() / 2;
        }

        this.setRendered();

        // We're changing context parameters. Save current state.
        ctx.save();
        // Apply style might not save context, if this.style is undefined, so we
        // still need to save context state just before this, since we will be
        // changing ctx parameters below.
        this.applyStyle();
        const g: SVGGElement = ctx.openGroup('annotation', this.getAttribute('id'));
        ctx.setFont(this.textFont);
        if (this.fill) {
            ctx.setFillStyle(this.fill);
        }

        const stave = note.checkStave();
        const y = stave.getYForLine(this.text_line);

        L('Rendering annotation: ', this.text, x, y);
        ctx.fillText(this.text, x, y);
        const svg_text = g.lastElementChild as SVGTextElement;
        if (this.horizontalJustification === AnnotationHorizontalJustify.LEFT) {
            // left is default;
        } else if (this.horizontalJustification === AnnotationHorizontalJustify.RIGHT) {
            svg_text.setAttribute('text-anchor', 'right');
        } else if (this.horizontalJustification === AnnotationHorizontalJustify.CENTER) {
            svg_text.setAttribute('text-anchor', 'middle');
        } /* CENTER_STEM */ else {
            // TODO: this should be slightly different.
            // x = (note as StemmableNote).getStemX() - text_width / 2;
            svg_text.setAttribute('text-anchor', 'middle');
        }

        ctx.closeGroup();
        this.restoreStyle();
        ctx.restore();
    }
}
