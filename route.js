module.exports = Route;
var methods = require("methods");
var flatten = require("array-flatten");
var Layer = require("./Layer");

function Route(path) {
  this.path = path;
  this.stack = [];

  this.methods = {};
}

Route.prototype.dispatch = function dispatch(req, res, done) {};

methods.forEach(function (method) {
  Route.prototype[method] = function () {
    console.log(" Route prototype method ", method, " is called");
    var handles = flatten(Array.prototype.slice.call(arguments));
    console.log("handle function is ", handles);

    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];

      if (typeof handle !== "function") {
        var type = toString.call(handle);
        var msg =
          "Route." +
          method +
          "() requires a callback function but got a " +
          type;
        throw new Error(msg);
      }
      console.log("creating a layer ");
      var layer = Layer("/", {}, handle);
      layer.method = method;
      console.log("And its look like ", layer);

      this.methods[method] = true;
      console.log("pushing to the stack of route ");
      this.stack.push(layer);
      console.log("so the route looks like ", this);
      console.log("and its stack is ", this.stack);
    }

    return this;
  };
});
