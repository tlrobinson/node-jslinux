
var fs = require("fs");
var path = require("path");
var tty = require('tty');

var typed_array = require('typed-array');

var bootstrapBase = path.dirname(module.filename);
var bootstrapPre = fs.readFileSync(path.join(bootstrapBase, "bootstrap.js.pre"), "utf8");
var bootstrapPost = fs.readFileSync(path.join(bootstrapBase, "bootstrap.js.post"), "utf8");

exports.DEFAULT_BASE_PATH = path.join(path.dirname(module.filename), "external") + "/";
exports.USE_RAW_MODE = true;

var constructorCache = {};
function getConstructor(basePath) {
    if (!constructorCache.hasOwnProperty(basePath)) {
        try {
            var bootstrapCpux86 = fs.readFileSync(path.join(basePath, "cpux86.js"), "utf8");
        } catch (e) {
            console.log('It looks like you\'re missing jslinux. Please download cpux86.js, root.bin, vmlinux26.bin, and linuxstart.bin to the "external" directory in the jslinux package.');
            process.exit(1);
        }
        var bootstrapVariables = "this.base = " + JSON.stringify(basePath) + ";\n";
        constructorCache[basePath] = new Function("options", "fs", "typed_array", bootstrapVariables + bootstrapPre + bootstrapCpux86 + bootstrapPost);
    }
    return constructorCache[basePath];
}

exports.Linux = function(options) {
    var options = options || {};

    options.base = options.base || exports.DEFAULT_BASE_PATH;

    if (!options.input) {
        options.input = process.stdin;

        if (exports.USE_RAW_MODE) {
            console.log("[Node.js switching to raw mode. Hit Ctrl-C four times in a row to exit.]");
            tty.setRawMode(true);
            var ctrlCs = 0;
            process.stdin.on('keypress', function(char, key) {
                if (key && key.ctrl && key.name == 'c') {
                    if (++ctrlCs >= 4) {
                        process.exit(0);
                    }
                } else {
                    ctrlCs = 0;
                }
            });
        }
    }
    if (!options.output) {
        options.output = process.stdout;
    }

    var constructor = getConstructor(options.base);

    // need to pass fs and typed_array because we compile the function in the global scope.
    return new constructor(options, fs, typed_array);
}

exports.boot = function(options) {
    var linux = new exports.Linux(options);
    linux.boot();
    return linux; 
}
