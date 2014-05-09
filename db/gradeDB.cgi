#!/opt/local/bin/python

import sqlite3
import json

def getRows():
    try:
        conn = sqlite3.connect("/Library/WebServer/Documents/m21j/db/grades2013fa.db")
    except sqlite3.OperationalError:
        conn = sqlite3.connect("grades2013fa.db")
    
    
    c = conn.cursor()
    rows = []
    
    try:
        for row in c.execute('SELECT * FROM receivedTest ORDER BY submitDateText DESC'):
            rows.append(row)
    except IOError:
        pass #  | head, or something like that...
    
    conn.close()
    return rows

def rowsToJSON(rows):
    return json.dumps(rows)

def getTemplate():
    with open('gradeTemplate.html') as gt:
        template = gt.read()
    return template

def makePage():
    rows = getRows()
    jsonFile = rowsToJSON(rows)
    template = getTemplate()
    templateOut = template % {'jsonInfo': jsonFile}
    print("Content-type: text/html\n")
    print templateOut
    



if __name__ == '__main__':
    makePage()