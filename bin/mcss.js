#!/usr/bin/env node

var microCss = require('../')
  , fs = require('fs')

var argv = require('optimist').usage('Usage: $0 [entry files] {OPTIONS}').wrap(80).option('outfile', {
  alias : 'o',
  desc : 'Write the generated css to this file.\nIf unspecified, prints to stdout.'
}).argv

var data = ""
argv._.forEach(function(path){
  data += fs.readFileSync(path, 'utf8') + "\n"
})





var css = microCss(data)

if (argv.outfile) {
  
  var maxDate = null
  argv._.forEach(function(path){
     var date = fs.statSync(path).mtime
     if (!maxDate || date > maxDate){
       maxDate = date
     }
  })
  
  fs.writeFileSync(argv.outfile, css)
  
  if (maxDate){
    fs.utimesSync(argv.outfile, maxDate, maxDate)
  }
  
} else {
  console.log(css)
}