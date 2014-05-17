define([], function() {
   var articulations = {};
   articulations.Articulation = function(){
       this.name = undefined;
       this.placement = 'above';
       this.vexflowModifier = undefined;

       this.vexflow = function () {
           return new Vex.Flow.Articulation(this.vexflowModifier);
       }
   };
   
   articulations.LengthArticulation = function(){
   };
   articulations.LengthArticulation.prototype = new articulations.Articulation();
   articulations.LengthArticulation.prototype.constructor = articulations.LengthArticulation;
   
   articulations.DynamicArticulation = function(){
   };
   articulations.DynamicArticulation.prototype = new articulations.Articulation();
   articulations.DynamicArticulation.prototype.constructor = articulations.DynamicArticulation;
   
   articulations.PitchArticulation = function(){
   };
   articulations.PitchArticulation.prototype = new articulations.Articulation();
   articulations.PitchArticulation.prototype.constructor = articulations.PitchArticulation;
   
   articulations.TimbreArticulation = function(){
   };
   articulations.TimbreArticulation.prototype = new articulations.Articulation();
   articulations.TimbreArticulation.prototype.constructor = articulations.TimbreArticulation;
   
   articulations.Accent = function(){
       this.name = 'accent';
       this.vexflowModifier = "a>";
   };
   articulations.Accent.prototype = new articulations.DynamicArticulation();
   articulations.Accent.prototype.constructor = articulations.Accent;
   
   articulations.StrongAccent = function(){
       this.name = 'strong accent';
       this.vexflowModifier = "a^";
   };
   articulations.StrongAccent.prototype = new articulations.Accent();
   articulations.StrongAccent.prototype.constructor = articulations.StrongAccent;
   
   articulations.Staccato = function(){
       this.name = 'staccato';
       this.vexflowModifier = "a.";
   };
   articulations.Staccato.prototype = new articulations.LengthArticulation();
   articulations.Staccato.prototype.constructor = articulations.Staccato;
   
   articulations.Staccatissimo = function(){
       this.name = 'staccatissimo';
       this.vexflowModifier = "av";
   };
   articulations.Staccatissimo.prototype = new articulations.Staccato();
   articulations.Staccatissimo.prototype.constructor = articulations.Staccatissimo;
   
   articulations.Tenuto = function(){
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
   };
   // end of define
   if (typeof(music21) != "undefined") {
       music21.articulations = articulations;
   }       
   return articulations;
});