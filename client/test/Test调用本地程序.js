#!/usr/bin/env node
var name = process.argv[2];
var exec = require('child_process').exec;

var child = exec('chromedriver', function(err, stdout, stderr) {
    if (err) throw err;
    console.log(stdout);
});