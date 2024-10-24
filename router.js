var setPrototypeOf = require("setprototypeof");
var Route = require("./route");
var Layer = require("./Layer");
var parseUrl = require("parseurl");

var proto = (module.exports = function (options) {
  //console.log("proto gets called");
  var opts = options || {};

  function router(req, res, next) {
    //console.log("router function gets called");
    router.handle(req, res, next);
  }
  //console.log("router before proto prototype ", router);
  setPrototypeOf(router, proto);
  //console.log("router after proto prototype ", router);

  router.params = {};
  router._params = [];
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  router.stack = [];

  return router;
});

proto.route = function route(path) {
  //console.log("i am proto.route and i have been called and path is  ", path);
  //console.log("route is being created");
  var route = new Route(path);
  //console.log("route is ", route);

  //console.log("a layer is also being craeted ");
  var layer = new Layer(path, {}, route.dispatch.bind(route));
  //console.log("layer looks like ", layer);

  layer.route = route;
  //console.log("layer after route is added ", layer);

  //console.log("layer is being added to this ", this);
  this.stack.push(layer);
  //console.log("so now this looks like ", this);

  return route;
};

proto.handle = function handle(req, res, out) {
  //console.log("proto handle method gets called ");
  var self = this;
  //console.log("self looks like ", self);
  var stack = self.stack;
  // new code ----------------------------
  var path = getPathname(req);
  //--------------------------------------

  // old code _______________________________
  // var layer = stack[0];
  // var route = layer.route;
  // route.stack[0].handle_request(req, res);
  //_________________________________________

  // new code ----------------------------
  var layer;
  var match;
  var route;
  var idx = 0;
  while (match !== true && idx < stack.length) {
    layer = stack[idx++];
    console.log("layer on router stack looks like this");
    console.log(layer);
    match = matchLayer(layer, path);
    route = layer.route;

    if (match !== true) {
      continue;
    }

    if (!route) {
      // process non-route handlers normally
      continue;
    }

    route.stack[0].handle_request(req, res);
  }

  function getPathname(req) {
    try {
      console.log("getPathname function get called");
      console.log("req object looks like ", req);
      console.log("after parsing ", parseUrl(req).pathname);
      return parseUrl(req).pathname;
    } catch (err) {
      return undefined;
    }
  }

  function matchLayer(layer, path) {
    try {
      return layer.match(path);
    } catch (err) {
      return err;
    }
  }

  //--------------------------------------
};
