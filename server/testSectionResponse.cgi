#!/opt/local/bin/python

# Import smtplib for the actual sending function
import smtplib
import cgi
import json

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

if 'profEmail' in form:
	profEmail = form['profEmail'].value + "@mit.edu"
else:
	profEmail = "cuthbert@post.harvard.edu"

if 'information' in form:
    infoString = form['information'].value
else:
	infoString = "{}"
	
infoDict = json.loads(infoString)

# Import the email modules we'll need
from email.mime.text import MIMEText

# Create a text/plain message
msgAsText = ("A completed assignment [%s] was sent by"  
			 " %s %s in %s seconds, with comments: %s" % (
			 	assignmentId, first, last, totalTime, comments
			 	) )
msgAsText += repr(infoDict);

msg = MIMEText(msgAsText)

# me == the sender's email address
# you == the recipient's email address
msg['Subject'] = '[21m.051 M21J] %s from %s %s' % (assignmentId, first, last)
msg['From'] = "cuthbert@mit.edu"
msg['To'] = profEmail

# Send the message via our own SMTP server, but don't include the
# envelope header.
s = smtplib.SMTP('outgoing.mit.edu')
s.sendmail("cuthbert@mit.edu", [profEmail], msg.as_string())
s.quit()

print "Content-type: application/json\n"
print '{"reply": "Got it! you are now all set.  If you are cautious print this page as a pdf for your records...this is brand new and there may be some bugs"}'
