import * as prebase from './prebase';
export declare enum Enclosure {
    RECTANGLE = "rectangle",
    SQUARE = "square",
    OVAL = "oval",
    CIRCLE = "circle",
    BRACKET = "bracket",
    TRIANGLE = "triangle",
    DIAMOND = "diamond",
    PENTAGON = "pentagon",
    HEXAGON = "hexagon",
    HEPTAGON = "heptagon",
    OCTAGON = "octagon",
    NONAGON = "nonagon",
    DECAGON = "decagon",
    NONE = "none"
}
export declare class Style extends prebase.ProtoM21Object {
    relativeX: number | undefined;
    relativeY: number | undefined;
    absoluteX: number | undefined;
    absoluteY: number | undefined;
    enclosure: Enclosure | undefined;
    color: string | undefined;
    hideObjectOnPrint: boolean;
}
//# sourceMappingURL=style.d.ts.map