/**
 * 
 * Btw -- NOTHING here works.  jsdoc in Eclipse has a LONG way to go... defineProperties, etc.
 * 
 * shows america who is boss
 * 
 * @constructor
 */
var X = function () {
    this.y = 7;
    /**
     * heya
     * 
     * @returns {string} 
     */
    this.yahoo = function () {
        return 'yahoo!';
    };
};

/**
 * @constructor
 * @property {X} x - returns an X object
 */
var Component = function (options) {
  /**
    Whether this component is visible or not

    @type Boolean
    @default false
  */
  this.visible = options.visible;
  
  this.x = new X();
  /** @type {String} */
  this.name = options.name;
  /**
   * Returns this.name plus hi
   * 
   * @param {string} hi - a string to say hi to
   * @returns string
   */
  this.helloIt = function (hi) {
      return this.name + hi;
  };
};

com = new Component({name: 'hello'});
xxx = new X();