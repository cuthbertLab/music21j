import { ScoreParser as MusicXMLScoreParser } from './musicxml/xmlToM21';

export function parse(txt: string) {
    const sp = new MusicXMLScoreParser();
    return sp.scoreFromText(txt);
}
