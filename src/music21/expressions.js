define(['./base'], function(base) {
   //
   // expressions can be note attached or floating...
    
   var expressions = {};

   expressions.Expression = function() {
       base.Music21Object.call(this);
       this.classes.push('Expression');
       this.vexflowModifier = "";
       this.setPosition = undefined;
       
   };
   expressions.Expression.prototype = new base.Music21Object();
   expressions.Expression.prototype.constructor = expressions.Expression;
   
   expressions.Expression.prototype.vexflow = function () {
       var vfe =  new Vex.Flow.Articulation(this.vexflowModifier);
       if (this.setPosition) {
           vfe.setPosition(this.setPosition);
       }
       return vfe;
   };
   
   expressions.Fermata = function(){
       expressions.Expression.call(this);
       this.classes.push("Fermata");
       this.name = 'fermata';
       this.vexflowModifier = "a@a";
       this.setPosition = 3;
   };
   expressions.Fermata.prototype = new expressions.Expression();
   expressions.Fermata.prototype.constructor = expressions.Fermata;
   // end of define
   if (typeof(music21) != "undefined") {
       music21.expressions = expressions;
   }       
   return expressions;
});