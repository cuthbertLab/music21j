import * as Vex from 'vexflow/bravura';

Vex.Flow.SOFTMAX_FACTOR = 5;
const bravura = Vex.Font.load('Bravura');
const metrics = bravura.getMetrics();
// metrics.clef.default.width = 20;
metrics.stave.endPaddingMax = 10;
// metrics.stave.padding = 0;
