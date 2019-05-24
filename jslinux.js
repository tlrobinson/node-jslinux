
var fs = require("fs");
var path = require("path");
var tty = require('tty');

exports.USE_RAW_MODE = true;

function getExternalPath(filename) {
    return path.join(path.dirname(module.filename), "external", filename);
}

var cpuX86Path;
try {
    var typed_array = require('typed-array');
    var ArrayBuffer = typed_array.ArrayBuffer;
    var Uint8Array  = typed_array.Uint8Array;
    var Int8Array   = typed_array.Int8Array;
    var Uint16Array = typed_array.Uint16Array;
    var Int16Array  = typed_array.Int16Array;
    var Uint32Array = typed_array.Uint32Array;
    var Int32Array  = typed_array.Int32Array;
    cpuX86Path = getExternalPath("cpux86-ta.js");
} catch (e) {
    console.log("[node-jslinux: Used slower non-typed array version. 'npm install typed-array' to improve performance.] "+ e);
    var document = { getElementById : function() {}};
    cpuX86Path = getExternalPath("cpux86.js");
}
var cpuX86Source;
try {
    cpuX86Source = fs.readFileSync(cpuX86Path, "utf8")
} catch (e) {
    console.log("[node-jslinux: couldn't load "+cpuX86Path+", did you run 'download_jslinux'?]");
    process.exit(1);
}

eval(cpuX86Source);

CPU_X86.prototype.load_binary = function(path, offset) {
    var buffer = fs.readFileSync(path);
    var length = buffer.length;
    for (var i = 0; i < length; i++) {
        this.st8_phys(offset + i, buffer[i]);
    }
    console.log("[node-jslinux: Loaded " + path + " ("+length+" bytes at location 0x" + offset.toString(16) + ")]");
    return length;
};

exports.boot = function() {
    var start_addr, initrd_size, params;

    params = {};

    /* serial output chars */
    params.serial_write = function(x) {
        process.stdout.write(x);
    }

    /* memory size */
    params.mem_size = 16 * 1024 * 1024;

    /* clipboard I/O */
    params.clipboard_get = null;
    params.clipboard_set = null;

    var pc = new PCEmulator(params);

    pc.load_binary(getExternalPath("vmlinux26.bin"), 0x00100000);

    initrd_size = pc.load_binary(getExternalPath("root.bin"), 0x00400000);

    start_addr = 0x10000;
    pc.load_binary(getExternalPath("linuxstart.bin"), start_addr);

    pc.cpu.eip = start_addr;
    pc.cpu.regs[0] = params.mem_size; /* eax */
    pc.cpu.regs[3] = initrd_size; /* ebx */

    pc.start();

    process.stdin.setEncoding("utf8");
    process.stdin.resume();
    process.stdin.on('data', function(data) {
        pc.serial.send_chars(data);
    });

    if (exports.USE_RAW_MODE) {
        console.log("[Node.js switching to raw mode. Hit Ctrl-C four times in a row to exit.]");
        process.stdin.setRawMode(true);
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
    
    return pc;
}
