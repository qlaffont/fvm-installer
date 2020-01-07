var binaryParser = require('superagent-binary-parser');
var request = require('superagent');
var chalk = require('chalk');
var fs = require('fs');
var extract = require('extract-zip');
var rimraf = require('rimraf');
var path = require('path');

module.exports = {
  download_resource: function(resource, dataConfigFile, save, specifiedfolder) {
    var arraytosplit = resource.split("/");
    var resource_user = arraytosplit[0];
    var resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];
    var resource_version;
    var versionarray = arraytosplit[1].split("@");

    if(versionarray.length > 0){
      resource_version = versionarray[1] || "";
    }

    return new Promise(function(resolve, reject) {
      request.get('https://api.github.com/repos/' + resource_user + "/" + resource_name + "/tags").set('Accept', 'application/json').set('User-Agent', 'fvm-installer').end(function(err, res) {
        if (err) {
          console.log(chalk.red("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to download !"));
          console.log("\n");
          reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to download !");
          return;
        } else {
          var data;

          if(resource_version == ""){
            data = res.body[0];
            resource_version = data.name;
          }else{
            data = res.body.find(function(element){
              if(element.name == resource_version){
                return true;
              }else{
                return false;
              }
            });

            if (!(data)){
              console.log(chalk.red("Error: Version for "+ resource_user + "/" + resource_name + " not found !"));
              console.log("\n");
              reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found for this version !");
              return;
            }
          }


          console.log(chalk.green("Installing " + resource_name + " - " + resource_version));
          var zip_url = data.zipball_url;
          console.log(zip_url);

          request.get(zip_url).set('User-Agent', 'fvm-installer').parse(binaryParser).buffer().end(function(err, resp) {
            if(err){
              console.log(chalk.red("Please Try Again in 60 Minutes - Exceed Github Rate Limite or Github Down"));
              process.exit(0);
            }
            if(!res.body){
              console.log(chalk.red("Please Try Again - Network Bug"));
              process.exit(0);
            }
            fs.writeFileSync("resourcedownloadedfvm.zip", resp.body);
            var zipfolder = "";

            extract("resourcedownloadedfvm.zip", {
              dir: path.join(process.cwd(),  "resources"),
              onEntry: function(fileunzipped, zip) {
                if (zipfolder == "") {
                  zipfolder = fileunzipped.fileName;
                }
              }
            }, function(err) {
              fs.unlinkSync(path.join(process.cwd(),  "resourcedownloadedfvm.zip"));
              //Remove and put resource in folder
              var pathtoinstall = path.join(process.cwd(),  "resources", resource_name);

              if(specifiedfolder != ""){
                pathtoinstall = path.join(process.cwd(),  "resources", "[" + specifiedfolder + "]", resource_name, "/");
                if (!fs.existsSync(path.join(process.cwd(),  "resources", "[" + specifiedfolder + "]"))){
                    fs.mkdirSync(path.join(process.cwd(),  "resources", "[" + specifiedfolder + "]"));
                }
              }
              rimraf(pathtoinstall, function() {

                fs.rename(path.join(process.cwd(),  "resources", zipfolder), pathtoinstall, function(err) {
                  console.log("\n");
                  if(save){
                    dataConfigFile.addResource(resource_user+"/"+resource_name, resource_version, specifiedfolder);
                  }
                  resolve("Install Successful of "+resource_user+"/"+resource_name);
                });
              });
            });

          });
        }
      });
    });
  },
  update_resource: function(resource, previous_version, dataConfigFile, save) {
    var arraytosplit = resource.split("/");
    var resource_user = arraytosplit[0];
    var resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];
    var resource_version;
    var versionarray = arraytosplit[1].split("@");

    if(versionarray.length > 0){
      resource_version = versionarray[1] || "";
    }

    return new Promise(function(resolve, reject) {
      request.get('https://api.github.com/repos/' + resource_user + "/" + resource_name + "/tags").set('Accept', 'application/json').end(function(err, res) {
        if (err) {
          console.log(chalk.red("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !"));
          console.log("\n");
          reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !");
          return;
        } else {
          var data;

          if(resource_version == ""){
            data = res.body[0];
            resource_version = data.name;
          }else{
            data = res.body.find(function(element){
              if(element.name == resource_version){
                return true;
              }else{
                return false;
              }
            });

            if (!(data)){
              console.log(chalk.red("Error: Version for "+ resource_user + "/" + resource_name + " not found !"));
              console.log("\n");
              reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found for this version !");
              return;
            }
          }


          console.log(chalk.green("Updating " + resource_name + " - " + chalk.red(previous_version) + " -> " + resource_version));
          var zip_url = data.zipball_url;
          console.log(zip_url);

          request.get(zip_url).parse(binaryParser).buffer().end(function(err, resp) {
            if(err){
              console.log(chalk.red("Please Try Again in 60 Minutes - Exceed Github Rate Limite or Github Down "));
              process.exit(0);
            }
            if(!res.body){
              console.log(chalk.red("Please Try Again - Network Bug"));
              process.exit(0);
            }
            fs.writeFileSync("resourcedownloadedfvm.zip", resp.body);
            var zipfolder = "";

            extract("resourcedownloadedfvm.zip", {
              dir: path.join(process.cwd(),  "resources"),
              onEntry: function(fileunzipped, zip) {
                if (zipfolder == "") {
                  zipfolder = fileunzipped.fileName;
                }
              }
            }, function(err) {
              // fs.unlinkSync(path.join(process.cwd(),  "resourcedownloadedfvm.zip"));
              //Remove and put resource in folder
              var pathtoupdate = path.join(process.cwd(),  "resources", resource_name);

              if(dataConfigFile.folder[resource_user+"/"+resource_name]){
                pathtoupdate = path.join(process.cwd(),  "resources", "[" + dataConfigFile.folder[resource_user+"/"+resource_name] + "]", resource_name);

                if (!fs.existsSync(path.join(process.cwd(),  "resources", "[" + dataConfigFile.folder[resource_user+"/"+resource_name] + "]"))){
                    fs.mkdirSync(path.join(process.cwd(),  "resources", "[" + dataConfigFile.folder[resource_user+"/"+resource_name] + "]"));
                }
              }
              rimraf(pathtoupdate, function() {

                fs.rename(path.join(process.cwd(),  "resources", zipfolder), pathtoupdate, function(err) {
                  console.log("\n");
                  if(save){
                    if(dataConfigFile.folder[resource_user+"/"+resource_name]){
                      dataConfigFile.addResource(resource_user+"/"+resource_name, resource_version, dataConfigFile.folder[resource_user+"/"+resource_name]);
                    }else{
                      dataConfigFile.addResource(resource_user+"/"+resource_name, resource_version, "");
                    }
                  }
                  resolve("Update Successful of "+resource_user+"/"+resource_name);
                });
              });
            });

          });
        }
      });
    });
  },
  deleteresource: function(resource, save, dataConfigFile){
    return new Promise(function(resolve, reject) {
      var arraytosplit = resource.split("/");
      var resource_user = arraytosplit[0];
      var resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];

      var pathtodelete = path.join(process.cwd(),  "resources", resource_name);

      if(dataConfigFile.folder[resource]){
        pathtodelete = path.join(process.cwd(),  "resources", "[" + dataConfigFile.folder[resource] + "]", resource_name)
      }

      rimraf(pathtodelete, function() {
        if (save){
          dataConfigFile.removeResource(resource);
        }
        console.log("Delete Successful of "+resource_user+"/"+resource_name);
        resolve("Delete Successful of "+resource_user+"/"+resource_name);
      });
    });
  },
  check_update_resource: function(resource, resource_version){
    var arraytosplit = resource.split("/");
    var resource_user = arraytosplit[0];
    var resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];

    return new Promise(function(resolve, reject) {
      request.get('https://api.github.com/repos/' + resource_user + "/" + resource_name + "/tags").set('Accept', 'application/json').end(function(err, res) {
        if (err) {
          console.log(chalk.red("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !"));
          console.log("\n");
          reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !");
          return;
        } else {
          var version = res.body[0].name;

          if(resource_version != version){
            console.log(resource + "\t"+ "Installed: " + resource_version+"\t" +chalk.green(" New Version:"+version)+"\n");
          }else{
            console.log(resource + "\t"+ "Installed: " + resource_version+"\n");
          }
          resolve();
        }
      });
    });
  },
  check_resource_format: function (resource_name){
    return /(^([^/]+)\/([^/]+)@\S+$)|(^([^/]+)\/([^/]+)$)/g.test(resource_name);
  }
};
