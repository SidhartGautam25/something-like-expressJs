var mixin = require("merge-descriptors");
var proto = require("./app");

exports = module.exports = createApplication;

function createApplication() {
  console.log("creating your app in craeteApplication");
  let app = function (req, res, next) {
    console.log("app as a function get called ");
    app.handle(req, res, next);
  };
  console.log("app before proto being mixed ", app);
  mixin(app, proto, false);
  console.log("app after proto being mixed ", app);
  console.log("intializing your app ");
  app.init();
  console.log("after your app ", app);
  return app;
}

exports.application = proto;
