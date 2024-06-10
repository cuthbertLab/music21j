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
    Formatter,
    log,
    ModifierContext,
    type ModifierContextState,
    ModifierPosition,
    RenderContext,
    Stave,
    StaveNote,
    SVGContext,
    Voice,
} from 'vexflow';

// eslint-disable-next-line
function L(...args: any[]) {
    if (VFLyricAnnotation.DEBUG) {
        log('Vex.Flow.Annotation', args);
    }
}


const original_Formatter_preFormat = Formatter.prototype.preFormat;
Formatter.prototype.preFormat = function preFormat(
    justifyWidth?: number,
    renderingContext?: RenderContext,
    voicesParam?: Voice[],
    stave?: Stave
): number {
    console.log(justifyWidth);
    const out = original_Formatter_preFormat.bind(this)(
        justifyWidth,
        renderingContext,  // unused,
        voicesParam,
        stave,
    );
    console.log(this.preCalculateMinTotalWidth(voicesParam));
    console.log('....');
    return out;
};


function getLyricWidthDifference(sn: StaveNote): {left: number, right: number} {
    const myModifierContext = sn.getModifierContext();
    myModifierContext.preFormat();  // just in case it hasn't been done yet.
    const myLeft = myModifierContext.getState().left_shift;
    const myRight = myModifierContext.getState().right_shift;

    const modifierContext2 = new ModifierContext();
    for (const cat of Object.keys((myModifierContext as any).members)) {
        if (cat === Annotation.CATEGORY) {
            continue;
        }
        for (const member of myModifierContext.getMembers(cat)) {
            modifierContext2.addMember(member);
        }
    }
    modifierContext2.preFormat();
    const noLyricLeft = modifierContext2.getState().left_shift;
    const noLyricRight = modifierContext2.getState().right_shift;
    const out = {
        left: myLeft - noLyricLeft,
        right: myRight - noLyricRight,
    };
    // if (out.left || out.right) {
    //     console.log(out);
    // }
    return out;
}

const original_StaveNote_getTieRightX = StaveNote.prototype.getTieRightX;
StaveNote.prototype.getTieRightX = function getTieRightX(): number {
    const originalRight = original_StaveNote_getTieRightX.bind(this)();
    return originalRight - getLyricWidthDifference(this).right;
};

// this is not needed because StaveNote.getTieLeftX() ignores width of note all together.
// const original_StaveNote_getTieLeftX = StaveNote.prototype.getTieLeftX;
// StaveNote.prototype.getTieLeftX = function getTieLeftX(): number {
//     const originalLeft = original_StaveNote_getTieLeftX.bind(this)();
//     return originalLeft + getLyricWidthDifference(this).left;
// };



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
        let x = note.getModifierStartXY(ModifierPosition.ABOVE, this.index).x;
        if (this.horizontalJustification === AnnotationHorizontalJustify.LEFT) {
            x -= note.getGlyphWidth() / 2;
        } else if (this.horizontalJustification === AnnotationHorizontalJustify.RIGHT) {
            x += note.getGlyphWidth() / 2;
        }

        if (this.getXShift()) {
            x += this.getXShift();
        }

        this.setRendered();

        // We're changing context parameters. Save current state.
        ctx.save();
        // Apply style might not save context, if this.style is undefined, so we
        // still need to save context state just before this, since we will be
        // changing ctx parameters below.
        this.applyStyle();
        const g: SVGGElement = ctx.openGroup('lyricannotation', this.getAttribute('id'));
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
            svg_text.setAttribute('text-anchor', 'start');  // left = start is also default;
        } else if (this.horizontalJustification === AnnotationHorizontalJustify.RIGHT) {
            svg_text.setAttribute('text-anchor', 'end');
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


