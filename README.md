node-jslinux
============

This project provides a simple Node.js compatibility layer for the excellent `jslinux` project, an x86 emulator for running Linux, written in JavaScript. `jslinux` was created by Fabrice Bellard, and is not open source, so you'll have to obtain a copy from [the website](http://bellard.org/jslinux/).

Installation
------------

* Install via `npm install jslinux`, or download the dependencies yourself.
* Run the `jslinux` executable, or load the "jslinux" module and call the `boot()` function.
* If the terminal is in raw mode, hit Ctrl-C four times in a row to exit.

Example
-------

    $ node
    > require("jslinux").boot()
    [Node.js switching to raw mode. Hit Ctrl-C four times in a row to exit.]
    { base: '/usr/local/lib/node/.npm/jslinux/0.0.1/package/external/',
      terminal: 
       { handler: [Function: Jf],
           ...
      boot: [Function] }
    > Starting Linux
    Linux version 2.6.20 (bellard@voyager) (gcc version 3.4.6 20060404 (Red Hat 3.4.6-9)) #1 Wed May 18 23:22:20 CEST 2011
    BIOS-provided physical RAM map:
        ...
    VFS: Mounted root (ext2 filesystem).
    Freeing unused kernel memory: 124k freed
    Welcome to JS/Linux
    ~ # echo hello node
    hello node
    ~ # 

Dependencies
------------

* [`typed-array`](https://github.com/tlrobinson/v8-typed-array)

TODO
----

* More hooks (boot args, filesystem, etc?)

License
-------

Note: `jslinux` itself is (C) 2011 Fabrice Bellard, and is not part of this project nor is it included with the project. The code contained in this repository only is subject to the following license:

Copyright (C) 2011 by Thomas Robinson (http://tlrobinson.net/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
