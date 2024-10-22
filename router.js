var setPrototypeOf = require("setprototypeof");
var Route = require("./route");
var Layer = require("./Layer");

var proto = (module.exports = function (options) {
  console.log("proto gets called");
  var opts = options || {};

  function router(req, res, next) {
    console.log("router function gets called");
    router.handle(req, res, next);
  }
  console.log("router before proto prototype ", router);
  setPrototypeOf(router, proto);
  console.log("router after proto prototype ", router);

  router.params = {};
  router._params = [];
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  router.stack = [];

  return router;
});

proto.route = function route(path) {
  console.log("i am proto.route and i have been called and path is  ", path);
  console.log("route is being created");
  var route = new Route(path);
  console.log("route is ", route);

  console.log("a layer is also being craeted ");
  var layer = new Layer(path, {}, route.dispatch.bind(route));
  console.log("layer looks like ", layer);

  layer.route = route;
  console.log("layer after route is added ", layer);

  console.log("layer is being added to this ", this);
  this.stack.push(layer);
  console.log("so now this looks like ", this);

  return route;
};

proto.handle = function handle(req, res, out) {
  console.log("proto handle method gets called ");
  var self = this;
  console.log("self looks like ", self);
  var stack = self.stack;
  var layer = stack[0];
  var route = layer.route;
  route.stack[0].handle_request(req, res);
};
