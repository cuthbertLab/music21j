# -*- coding: utf-8 -*-
#-------------------------------------------------------------------------------
# Name:         upload.py
# Purpose:      music21j documentation upload utility
#
# Authors:      Christopher Ariza
#
# Copyright:    Copyright © 2009-2010, 2013, 17 Michael Scott Asato Cuthbert and the music21 Project
# License:      BSD, see license.txt
#-------------------------------------------------------------------------------
#pylint: disable=line-too-long
'''
if you get a 'ssh_askpass' not found error, create this file in
/usr/libexec/ssh-askpass and sudo chmod +x it afterwards:

..raw::
    #!/bin/bash
    # Script: ssh-askpass
    # Author: Mark Carver
    # Created: 2011-09-14
    # Copyright (c) 2011 Beyond Eden Development, LLC. All rights reserved.

    # A ssh-askpass command for Mac OS X
    # Based from author: Joseph Mocker, Sun Microsystems
    # http://blogs.oracle.com/mock/entry/and_now_chicken_of_the
    # To use this script:
    #   Install this script running INSTALL as root
    #
    # If you plan on manually installing this script, please note that you will have
    # to set the following variable for SSH to recognize where the script is located:
    #   export SSH_ASKPASS="/path/to/ssh-askpass"
    TITLE="${SSH_ASKPASS_TITLE:-SSH}";
    TEXT="$(whoami)'s password:";
    IFS=$(printf "\n");
    CODE=("on GetCurrentApp()");
    CODE=(${CODE[*]} "tell application \"System Events\" to get short name of first process whose frontmost is true");
    CODE=(${CODE[*]} "end GetCurrentApp");
    CODE=(${CODE[*]} "tell application GetCurrentApp()");
    CODE=(${CODE[*]} "activate");
    CODE=(${CODE[*]} "display dialog \"${@:-$TEXT}\" default answer \"\" with title \"${TITLE}\" with icon caution with hidden answer");
    CODE=(${CODE[*]} "text returned of result");
    CODE=(${CODE[*]} "end tell");
    SCRIPT="/usr/bin/osascript"
    for LINE in ${CODE[*]}; do
    SCRIPT="${SCRIPT} -e $(printf "%q" "${LINE}")";
    done;
    eval "${SCRIPT}";


Otherwise just contact MSC...
'''

import getpass, os


def main():

    # this needs to be on level higher then the level of the source
    remoteHost = 'trecento.com'
    remoteDir = 'music21docs/music21j/doc/'

    user = getpass.getpass('provide user name : ')


    src = './doc'
    # -r flag makes this recursive
    cmdStr = 'tar czpf - -C %s . | ssh %s@%s "tar xzpf - -C %s"' % (src, user, remoteHost, remoteDir)
    print(cmdStr)

    os.system(cmdStr)

if __name__ == '__main__':
    main()
