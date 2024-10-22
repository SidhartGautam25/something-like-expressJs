var setPrototypeOf = require("setprototypeof");
var methods = require("methods");
var Router = require("./router");
var Layer = require("./Layer");
var slice = Array.prototype.slice;
var http = require("http");

var app = (exports = module.exports = {});

app.init = function () {
  this.cache = {};
  this.engines = {};
  this.settings = {};

  this._router = undefined;
};

app.set = function set(setting, val) {
  this.settings[setting] = val;

  switch (setting) {
    case "etag":
      this.set("etag fn", "");
      break;
    case "query parser":
      this.set("query parser fn", "");
      break;
    case "trust proxy":
      this.set("trust proxy fn", "");
      break;
  }

  return this;
};

app.enabled = function enabled(setting) {
  return Boolean(this.set(setting));
};

app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({});
  }
};

app.listen = function listen() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

app.handle = function handle(req, res, callback) {
  console.log("app handle method get called and app looks like ", this);
  var router = this._router;
  console.log("app router looks like ", router);
  // console.log(" app router is ", router);
  console.log("router handle method get called ");
  router.handle(req, res);
};

methods.forEach(function (method) {
  app[method] = function (path) {
    console.log("method ", method, " is called for app");
    console.log(
      "lazy router has been called my friend and app is ",
      this._router
    );
    // this and app is diffrent
    this.lazyrouter();
    console.log("after lazy router app is ", this._router);

    console.log("route.route is called by app ");
    var route = this._router.route(path);
    console.log("route returned by this._router.route looks like ", route);
    console.log("route.route after effect  on app ", this._router);
    console.log("stack looks like ", this._router.stack);
    console.log("route returned after this._router.route looks like ", route);

    console.log("route.get is getting applied ");
    route[method].apply(route, slice.call(arguments, 1));
    console.log("after getting applied route looks like ", route);

    console.log(
      "so finally after all these things our app router stack  looks like ",
      this._router.stack[0]
    );
    console.log(
      "so finally after all these things our app router looks like ",
      this._router
    );
    console.log(
      "so finally after all these things our app router stack's route looks like ",
      this._router.stack[0].route
    );

    return this;
  };
});
