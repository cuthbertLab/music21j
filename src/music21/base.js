	var n = new Music21.Note("C#");
	n.duration.type="whole";
	var s = new Music21.Stream();
	s.append(n);
	s.appendNewCanvas()