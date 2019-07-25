#!/usr/bin/env bash

echo 'Downloading orchestral soundfonts (about 90MB)'

BASEDIR=$(dirname "$(dirname "$0")")
mkdir -p soundfonts
curl https://codeload.github.com/cuthbertLab/midi-js-soundfonts/zip/master > soundfonts/soundfonts.zip
(cd ${BASEDIR}/soundfonts; unzip soundfonts.zip)

if [[ ! -f "${BASEDIR}/src/music21.js" ]]; then
    echo 'Symlinking music21.js for use with require'

    (cd ${BASEDIR}/src; ln -s ../releases/music21.debug.js music21.js)
fi
