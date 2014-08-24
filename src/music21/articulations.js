define(['./prebase'], 
        function(prebase) {
   var articulations = {};

   articulations.Articulation = function(){
       prebase.ProtoM21Object.call(this);
       this.classes.push('Articulation');
       this.name = undefined;
       this.placement = 'above';
       this.vexflowModifier = undefined;
       this.setPosition = undefined;
       this.dynamicScale = 1.0;
       this.lengthScale = 1.0;
   };
   articulations.Articulation.prototype = new prebase.ProtoM21Object();
   articulations.Articulation.prototype.constructor = articulations.Articulation;
   
   articulations.Articulation.prototype.vexflow = function () {
       var vfa = new Vex.Flow.Articulation(this.vexflowModifier);
       if (this.setPosition) {
           vfa.setPosition(this.setPosition);
       }
       return vfa;
   };
   
   articulations.LengthArticulation = function(){
       articulations.Articulation.call(this);
       this.classes.push('LengthArticulation');
   };
   articulations.LengthArticulation.prototype = new articulations.Articulation();
   articulations.LengthArticulation.prototype.constructor = articulations.LengthArticulation;
   
   articulations.DynamicArticulation = function(){
       articulations.Articulation.call(this);
       this.classes.push('DynamicArticulation');

   };
   articulations.DynamicArticulation.prototype = new articulations.Articulation();
   articulations.DynamicArticulation.prototype.constructor = articulations.DynamicArticulation;
   
   articulations.PitchArticulation = function(){
       articulations.Articulation.call(this);
       this.classes.push('PitchArticulation');

   };
   articulations.PitchArticulation.prototype = new articulations.Articulation();
   articulations.PitchArticulation.prototype.constructor = articulations.PitchArticulation;
   
   articulations.TimbreArticulation = function(){
       articulations.Articulation.call(this);
       this.classes.push('TimbreArticulation');

   };
   articulations.TimbreArticulation.prototype = new articulations.Articulation();
   articulations.TimbreArticulation.prototype.constructor = articulations.TimbreArticulation;
   
   articulations.Accent = function(){
       articulations.DynamicArticulation.call(this);
       this.classes.push('Accent');

       this.name = 'accent';
       this.vexflowModifier = "a>";
       this.dynamicScale = 1.5;
   };
   articulations.Accent.prototype = new articulations.DynamicArticulation();
   articulations.Accent.prototype.constructor = articulations.Accent;
   
   articulations.StrongAccent = function(){
       articulations.Accent.call(this);
       this.classes.push('StrongAccent');
       this.name = 'strong accent';
       this.vexflowModifier = "a^";
       this.dynamicScale = 2.0;
   };
   articulations.StrongAccent.prototype = new articulations.Accent();
   articulations.StrongAccent.prototype.constructor = articulations.StrongAccent;
   
   articulations.Staccato = function(){
       articulations.LengthArticulation.call(this);
       this.classes.push('Staccato');       
       this.name = 'staccato';
       this.vexflowModifier = "a.";
   };
   articulations.Staccato.prototype = new articulations.LengthArticulation();
   articulations.Staccato.prototype.constructor = articulations.Staccato;
   
   articulations.Staccatissimo = function(){
       articulations.Staccato.call(this);
       this.classes.push('Staccatissimo');
       this.name = 'staccatissimo';
       this.vexflowModifier = "av";
   };
   articulations.Staccatissimo.prototype = new articulations.Staccato();
   articulations.Staccatissimo.prototype.constructor = articulations.Staccatissimo;
   
   articulations.Spiccato = function(){
	   articulations.Staccato.call(this);
       this.classes.push('Spiccato');
       this.name = 'spiccato';
       this.vexflowModifier = undefined;

   };
   articulations.Spiccato.prototype = new articulations.Staccato();
   articulations.Spiccato.prototype.constructor = articulations.Spiccato;
   
   articulations.Marcato = function(){
	   articulations.LengthArticulation.call(this);
	   articulations.DynamicArticulation.call(this);
	   this.classes.push('Marcato');
	   this.name = 'marcato';
	   this.vexflowModifier = "a^";
	   this.dynamicScale = 1.7;
	   
   };
   articulations.Marcato.prototype = new articulations.LengthArticulation();
   articulations.Marcato.prototype.constructor = articulations.Marcato;
   
  
   articulations.Tenuto = function(){
       articulations.LengthArticulation.call(this);
       this.classes.push('Tenuto');

       this.name = 'tenuto';
       this.vexflowModifier = "a-";
   };
   articulations.Tenuto.prototype = new articulations.LengthArticulation();
   articulations.Tenuto.prototype.constructor = articulations.Tenuto;


   
   articulations.tests = function () {
       test( "music21.articulations.Articulation", function() {
               var acc = new music21.articulations.Accent();
               equal (acc.name, 'accent', 'matching names for accent');
               var ten = new music21.articulations.Tenuto();
               equal (ten.name, 'tenuto', 'matching names for tenuto');
               var n = new music21.note.Note("C");
               n.articulations.push(acc);
               n.articulations.push(ten);
               equal (n.articulations[0].name, 'accent', 'accent in array');
               equal (n.articulations[1].name, 'tenuto', 'tenuto in array');
       });
       
       test ("music21.articulations.Articulation display", function() {
    	   var marc = new music21.articulations.Marcato();
    	   equal (marc.name, 'marcato', 'matching names for marcato');
    	   var n = new music21.note.Note("D#5");
    	   n.articulations.push(marc);
    	   var nBoring = new music21.note.Note("D#5");

    	   var measure = new music21.stream.Measure();
    	   measure.append(n);
    	   measure.append(nBoring);
    	   measure.append(nBoring.clone());
    	   measure.append(n.clone());
 
    	   measure.appendNewCanvas();
    	   ok(true, "something worked");
       });
   };
   // end of define
   if (typeof(music21) != "undefined") {
       music21.articulations = articulations;
   }       
   return articulations;
});