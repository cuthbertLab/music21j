from music21 import *
import json

b = corpus.parse('bwv66.6')

outputAll = {};
parts = []

for p in b.parts:
    newPart = []
    for m in p.getElementsByClass('Measure'):
        newMeasure = []
        for n in m.notes:
            noteObj = {}
            noteObj['pitchName'] = n.name
            noteObj['octave'] = n.octave
            noteObj['quarterLength'] = n.quarterLength
            newMeasure.append(noteObj)
        newPart.append(newMeasure)
    parts.append(newPart)
outputAll['parts'] = parts

print json.dumps(outputAll)

