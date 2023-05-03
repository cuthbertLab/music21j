#!/usr/bin/env bash

echo 'Downloading orchestral soundfonts (about 90MB)'

BASEDIR=$(dirname "$(dirname "$0")")
mkdir -p soundfonts
curl https://codeload.github.com/cuthbertLab/midi-js-soundfonts/zip/master > soundfonts/soundfonts.zip
(cd "${BASEDIR}"/soundfonts || exit 1; unzip -o -q soundfonts.zip && rm soundfonts.zip)

# do not use the double-bracket form -- Ubuntu 16 cannot handle it and is still supported.
# if [ ! -f "${BASEDIR}/src/music21.js" ]; then
#     echo 'Symlinking music21.js for use with require'

#     (cd "${BASEDIR}"/src || exit 1; ln -s ../releases/music21.debug.js music21.js)
# fi
