#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
mkdir -p soundfonts
curl https://github.com/cuthbertLab/midi-js-soundfonts/archive/master.zip > soundfonts/soundfonts.zip
unzip soundfonts/soundfonts.zip
