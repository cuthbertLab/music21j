import { ScoreParser as MusicXMLScoreParser } from './musicxml/xmlToM21.js';

export function parse(txt) {
    const sp = new MusicXMLScoreParser();
    return sp.scoreFromText(txt);
}
