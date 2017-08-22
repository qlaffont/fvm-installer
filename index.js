#!/usr/bin/env node

var request = require('superagent');
var chalk = require('chalk');
var fs = require('fs');
var tools = require('./tools');
var ConfigFile = require('./ConfigFileClass');
var co = require('co');
var prompt = require('co-prompt');


var pjson = require('./package.json');
console.log("\n");
console.log("===========================");
console.log("FiveM Installer v"+pjson.version);
console.log("Created by Quentin Laffont");
console.log("https://qlaffont.com");
console.log("===========================");
console.log("\n");




var arguments = process.argv;
var save = false;

//Helper
if(arguments.length == 2){
  console.log("Usage: fvm <args>");
  console.log("\n");
  console.log("Arguments:\n");
  console.log("  install (--save) <package_name> \t Install Github Package (Option Save : Save in scripts.json)");
  console.log("  update \t\t\t\t Check if some packages can be upgraded");
  console.log("  update (--save) <package_name> \t Update Package (Option Save : Save in scripts.json)");
  console.log("  delete (--save) <package_name> \t Delete Package (Option Save : Save in scripts.json)");
  console.log("\n");
  console.log(chalk.cyan("Package name format is : ") + chalk.bold.cyan("user/repo") + chalk.cyan(". Exemple: fivemtools/ft_ui"));
}else {
  var operation = arguments[2];

  switch (operation) {
    case "install":
      if(arguments[3]){

        var dataConfigFile = new ConfigFile(true);


        var resourcestoinstall = arguments;
        resourcestoinstall.splice(0, 3);

        promiseArray = [];

        resourcestoinstall.forEach(resource => {
          if(resource == "--save"){
            save = true;
          }
        });

        //Can give multiple resources to install
        resourcestoinstall.forEach(resource => {
          if(resource != "--save"){
            if(tools.check_resource_format(resource)){
              promiseArray.push(tools.download_resource(resource, dataConfigFile, save));
            }else{
              console.log(chalk.red("Error: Resource Not Found ! Please provide a resource name with a good format : user/repository or user/repository@version"));
              console.log("\n");
              process.exit(0);
            }
          }
        });

        Promise.all(promiseArray).then(values => {
          console.log("\n");

          console.log(chalk.green("Installation Successful !"));
        }).catch(data => {
          process.exit(0);
        });

      }else{
        //Check if existing file and if exist install packages
        var dataConfigFile = new ConfigFile(true);

        promiseArray = [];

        Object.keys(dataConfigFile.resources).forEach(key => {
            var resource = key + "@" +dataConfigFile.resources[key];
            if(tools.check_resource_format(resource)){
              promiseArray.push(tools.download_resource(resource, dataConfigFile, save));
            }
          }
        );

        Promise.all(promiseArray).then(values => {
          console.log("\n");

          console.log(chalk.green("Installation Successful !"));
        }).catch(data => {
          process.exit(0);
        });
      }
      break;

    case "update":
      var dataConfigFile = new ConfigFile(true);

      if(arguments[3]){

        var resourcestoupdate = arguments;
        resourcestoupdate.splice(0, 3);

        promiseArray = [];

        resourcestoupdate.forEach(resource => {
          if(resource == "--save"){
            save = true;
          }
        });

        //Can give multiple resources to install
        resourcestoupdate.forEach(resource => {
          if(resource != "--save"){
            if(tools.check_resource_format(resource)){

              promiseArray.push(tools.update_resource(resource, dataConfigFile.resources[resource], dataConfigFile, save));
            }else{
              console.log(chalk.red("Error: Resource Not Found ! Please provide a resource name with a good format : user/repository or user/repository@version"));
              console.log("\n");
              process.exit(0);
            }
          }
        });

        Promise.all(promiseArray).then(values => {
          console.log(chalk.green("Update Successful !"));
        }).catch(data => {
          process.exit(0);
        });
      } else {
        console.log("This package can be upgraded: "+"\n");

        promiseArray = [];

        Object.keys(dataConfigFile.resources).forEach(key => {
          promiseArray.push(tools.check_update_resource(key, dataConfigFile.resources[key]));
        });

        Promise.all(promiseArray).then(values => {
          console.log("To upgrade packages, do " + chalk.green("fvm update <package_name>"));
        }).catch(data => {
          process.exit(0);
        });
      }

      break;

    case "init":
      console.log("Initialisation of FiveM Installer directory !")
      console.log("\n");
      var dataConfigFile = new ConfigFile(false);

      co(function *() {
        var nameConfig = yield prompt('Name: ');
        var authorConfig = yield prompt('Author: ');
        var websiteConfig = yield prompt('Website: ');
        dataConfigFile.initConfigFile(nameConfig, authorConfig, websiteConfig);
        console.log("\n");
        console.log(chalk.green("Initialisation of FiveM Installer directory finish ! You can now use fvm installer."));
        process.exit(0);
      });
      break;

    case "remove":
      if(arguments[3]){
        var dataConfigFile = new ConfigFile(true);
        var resourcestodelete = arguments;
        resourcestodelete.splice(0, 3);

        promiseArray = [];

        resourcestodelete.forEach(resource => {
          if(resource == "--save"){
            save = true;
          }
        });

        //Can give multiple resources to install
        resourcestodelete.forEach(resource => {
          if(resource != "--save"){
            if(tools.check_resource_format(resource)){
              tools.deleteresource(resource, save, dataConfigFile)
            }else{
              console.log(chalk.red("Error: Resource Not Found ! Please provide a resource name with a good format : user/repository or user/repository@version"));
              console.log("\n");
              process.exit(0);
            }
          }
        });
      }else{
        console.log(chalk.red("Error: please give ressource name to remove"));
      }
      break;
    default:
      console.log(chalk.red("Error ! Please provide a good arguments : install / update / init "));
  }
}
