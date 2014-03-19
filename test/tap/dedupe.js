var test = require("tap").test
  , fs = require("fs")
  , path = require("path")
  , existsSync = fs.existsSync || path.existsSync
  , npm = require("../../")
  , rimraf = require("rimraf")
  , mr = require("npm-registry-mock")
  , common = require('../common-tap.js')

test("dedupe finds the common module and moves it up one level", function (t) {
  t.plan(2)

  setup(function (s) {
    npm.install(".", function (err) {
      s.close() // shutdown mock registry.

      if (err) return t.fail(err)
      npm.dedupe(function(err) {
        if (err) return t.fail(err)
        t.ok(existsSync(path.join(__dirname, "dedupe", "node_modules", "minimist")))
        t.ok(!existsSync(path.join(__dirname, "dedupe", "node_modules", "checker")))
      })
    })
  })
})

function setup (cb) {
  process.chdir(path.join(__dirname, "dedupe"))
  mr(1331, function (s) { // create mock registry.
    npm.load({registry: 'http://localhost:1331'}, function() {
      rimraf.sync(path.join(__dirname, "dedupe", "node_modules"))
      fs.mkdirSync(path.join(__dirname, "dedupe", "node_modules"))
      cb(s)
    })
  })
}
