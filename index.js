#!/usr/bin/env node

//
var pjson = require('./package.json');
console.log("\n");
console.log("===========================");
console.log("FiveM v"+pjson.version);
console.log("Created by Quentin Laffont");
console.log("===========================");
console.log("\n");


var arguments = process.argv;

//IF No Arguments are provide
if(arguments.length == 2){
  console.log("Please provide an argument !");
}else {
  var operation = arguments[2];

  switch (operation) {
    case "install":
      if(arguments[3]){
        
      }else{
        //Check if existing file and if exist install packages
      }
      break;

    case "update":

      break;

    case "init":

      break;
    default:
      console.log("Error ! Please provide a good arguments : install / update / init ")
  }
}
