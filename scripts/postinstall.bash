#!/usr/bin/env bash

echo 'Downloading orchestral soundfonts (about 90MB)'

BASEDIR=$(dirname "$(dirname "$0")")
mkdir -p soundfonts
curl https://codeload.github.com/cuthbertLab/midi-js-soundfonts/zip/master > soundfonts/soundfonts.zip
(cd "${BASEDIR}"/soundfonts || exit 1; unzip -o -q soundfonts.zip && rm soundfonts.zip)

## Uncomment these lines if Vexflow gives problems again in eslint/Typescript.
#echo "Cleaning up vexflow: keeping only 'build/'"
#rm -rf "${BASEDIR}/node_modules/vexflow/entry"
#rm -rf "${BASEDIR}/node_modules/vexflow/releases"
#rm -rf "${BASEDIR}/node_modules/vexflow/src"
#rm -rf "${BASEDIR}/node_modules/vexflow/tests"
