#!/opt/local/bin/python

# Import smtplib for the actual sending function
import smtplib
import cgi

form = cgi.FieldStorage()
if 'first' in form:
    first = form['first'].value
else:
    first = "unk"

if 'last' in form:
    last = form['last'].value
else:
    last = "unkL"

if 'totalTime' in form:
    totalTime = form['totalTime'].value
else:
    totalTime = -1

if 'comments' in form:
    comments = form['comments'].value
else:
    comments = "no comment"


if 'assignmentId' in form:
    assignmentId = form['assignmentId'].value
else:
    assignmentId = "Intervals"



# Import the email modules we'll need
from email.mime.text import MIMEText

# Create a text/plain message
msg = MIMEText("A completed assignment [%s] was sent by %s %s in %s seconds, with comments: %s" % (assignmentId, first, last, totalTime, comments))

# me == the sender's email address
# you == the recipient's email address
msg['Subject'] = '[21m.051 M21J] %s from %s %s' % (assignmentId, first, last)
msg['From'] = "cuthbert@mit.edu"
msg['To'] = "cuthbert@mit.edu"

# Send the message via our own SMTP server, but don't include the
# envelope header.
s = smtplib.SMTP('outgoing.mit.edu')
s.sendmail("cuthbert@mit.edu", ["cuthbert@mit.edu"], msg.as_string())
s.quit()

print "Content-type: application/json\n"
print '{"reply": "Got it! you are now all set.  If you are cautious print this page as a pdf for your records...this is brand new and there may be some bugs"}'
#print "<html><head><title>reply</title></head><body><div>Got it! -- you are all set (since this is new, maybe print for your records anyhow; you know how this net thing works...)</div></body></html>\n"

