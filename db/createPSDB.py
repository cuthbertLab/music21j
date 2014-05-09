import sqlite3
import inspect
import os
pathName = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))

conn = sqlite3.connect(pathName + os.sep + "grades2013fa.db")
import time

timeStr = int(time.time())


c = conn.cursor()
#c.execute('''DROP TABLE receivedTest''')
c.execute('''CREATE TABLE receivedTest (submitDateText int, firstName text, lastName text, bankId text, worksheetId text, time real, comments text, jsonMessage text)''')

c.execute('''INSERT INTO receivedTest VALUES (?, "Myke", "Cuthbert", "bank1", "intervals", 2131, "Hello message", "{}")''', [timeStr])

conn.commit()
conn.close()
