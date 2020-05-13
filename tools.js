const binaryParser = require('superagent-binary-parser');
const request = require('superagent');
const chalk = require('chalk');
const fs = require('fs');
const extract = require('extract-zip');
const rimraf = require('rimraf');
const path = require('path');

module.exports = {
  download_resource: (resource, dataConfigFile, save, specifiedfolder) => {
    const arraytosplit = resource.split("/");
    const resource_user = arraytosplit[0];
    const resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];
    const versionarray = arraytosplit[1].split("@");

    var resource_version;

    if (versionarray.length > 0) resource_version = versionarray[1] || "";

    return new Promise(async (resolve, reject) => {
      await request.get('https://api.github.com/repos/' + resource_user + "/" + resource_name + "/tags").set('Accept', 'application/json').set('User-Agent', 'fvm-installer')
      .then(async res => {
          var data;

          if(resource_version == "") {
            data = res.body[0];
            resource_version = data.name;
          } else {
            data = res.body.find((element) => {
              return (element.name == resource_version) ? true : false
            });
            
            if (!(data)) {
              console.log(chalk.red("Error: Version for "+ resource_user + "/" + resource_name + " not found !"));
              console.log("\n");
              reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found for this version !");
              return;
            }        
          }
          console.log(chalk.green('Installing ' + resource_name + ' - ' + resource_version));
          const zip_url = data.zipball_url;
          console.log(zip_url);

          await request
            .get(zip_url)
            .set('User-Agent', 'fvm-installer')
            .parse(binaryParser)
            .buffer()
            .then(async resp => {
              if (!resp.body) {
                console.log(chalk.red('Please Try Again - Network Bug'));
                process.exit(0);
              }
              fs.writeFileSync('resourcedownloadedfvm.zip', resp.body);
              var zipfolder = '';
              try {
                await extract('resourcedownloadedfvm.zip', {
                  dir: path.join(process.cwd(), 'resources'),
                  onEntry: (fileunzipped, zip) => { if (zipfolder == '') zipfolder = fileunzipped.fileName; },
                })
                  fs.unlinkSync(path.join(process.cwd(), 'resourcedownloadedfvm.zip'));
                  //Remove and put resource in folder
                  var pathtoinstall = path.join(process.cwd(), 'resources', resource_name);

                  if (specifiedfolder != '') {
                    pathtoinstall = path.join(process.cwd(), 'resources', '[' + specifiedfolder + ']', resource_name, '/');
                    if (!fs.existsSync(path.join(process.cwd(), 'resources', '[' + specifiedfolder + ']'))) fs.mkdirSync(path.join(process.cwd(), 'resources', '[' + specifiedfolder + ']'));
                  }
                  rimraf(pathtoinstall, _ => {
                    fs.rename(path.join(process.cwd(), 'resources', zipfolder), pathtoinstall, (err) => {
                      console.log('\n');
                      if (save) dataConfigFile.addResource(resource_user + '/' + resource_name, resource_version, specifiedfolder);
                      resolve('Install Successful of ' + resource_user + '/' + resource_name);
                    });
                  });                
              } catch (err) { console.log (err) }
              })
              .catch(err => {
                console.log(chalk.red('Please Try Again in 60 Minutes - Exceed Github Rate Limite or Github Down'));
                process.exit(0);
              })
          });          
      })
      .catch(err => {
        console.log(chalk.red("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to download !"));
        console.log("\n");
        reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to download !");
        return;
      });
  },
  update_resource: (resource, previous_version, dataConfigFile, save) => {
    const arraytosplit = resource.split("/");
    const resource_user = arraytosplit[0];
    const resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];
    var resource_version;
    const versionarray = arraytosplit[1].split("@");

    if(versionarray.length > 0) resource_version = versionarray[1] || "";
    
    return new Promise(async (resolve, reject) => {
      await request.get('https://api.github.com/repos/' + resource_user + "/" + resource_name + "/tags").set('Accept', 'application/json')
      .then(async res => {
          var data;

          if(resource_version == "") {
            data = res.body[0];
            resource_version = data.name;
          } else {
            data = res.body.find((element) => {
              return (element.name == resource_version) ? true : false;
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

          await request.get(zip_url).parse(binaryParser).buffer()
          .then(async res => {
            if(!res.body){
              console.log(chalk.red("Please Try Again - Network Bug"));
              process.exit(0);
            }
            fs.writeFileSync("resourcedownloadedfvm.zip", res.body);
            var zipfolder = "";
            try {
              await extract('resourcedownloadedfvm.zip', {
                dir: path.join(process.cwd(), 'resources'), onEntry: (fileunzipped, zip) => {
                  if (zipfolder == '') zipfolder = fileunzipped.fileName;
                },
              });
              // fs.unlinkSync(path.join(process.cwd(),  "resourcedownloadedfvm.zip"));
              //Remove and put resource in folder
              var pathtoupdate = path.join(process.cwd(), 'resources', resource_name);
              if (dataConfigFile.folder[resource_user + '/' + resource_name]) {
                pathtoupdate = path.join(process.cwd(), 'resources', '[' + dataConfigFile.folder[resource_user + '/' + resource_name] + ']', resource_name);
                if (!fs.existsSync(path.join(process.cwd(), 'resources', '[' + dataConfigFile.folder[resource_user + '/' + resource_name] + ']'))) fs.mkdirSync(path.join(process.cwd(), 'resources', '[' + dataConfigFile.folder[resource_user + '/' + resource_name] + ']'));
              }
              rimraf(pathtoupdate, _ => {
                fs.rename(path.join(process.cwd(), 'resources', zipfolder), pathtoupdate, (err) => {
                  console.log('\n');
                  if (save) {
                    (dataConfigFile.folder[resource_user + '/' + resource_name])
                    ? dataConfigFile.addResource(resource_user + '/' + resource_name, resource_version, dataConfigFile.folder[resource_user + '/' + resource_name])
                    : dataConfigFile.addResource(resource_user + '/' + resource_name, resource_version, '');
                  }
                  resolve('Update Successful of ' +  resource_user + '/' + resource_name);
                });
              });
            } catch (err) { console.log (err) }            
          })
          .catch(err => {
              console.log(chalk.red("Please Try Again in 60 Minutes - Exceed Github Rate Limite or Github Down "));
              process.exit(0);
          })
      })
      .catch(err => {
        console.log(chalk.red("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !"));
        console.log("\n");
        reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !");
        return;
      });
    });
  },
  deleteresource: (resource, save, dataConfigFile) => {
    return new Promise((resolve, reject) => {
      const arraytosplit = resource.split("/");
      const resource_user = arraytosplit[0];
      const resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];

      var pathtodelete = path.join(process.cwd(),  "resources", resource_name);

      if(dataConfigFile.folder[resource]) pathtodelete = path.join(process.cwd(),  "resources", "[" + dataConfigFile.folder[resource] + "]", resource_name);

      rimraf(pathtodelete, _ => {
        if (save) dataConfigFile.removeResource(resource);

        console.log("Delete Successful of "+resource_user+"/"+resource_name);
        resolve("Delete Successful of "+resource_user+"/"+resource_name);
      });
    });
  },
  check_update_resource: (resource, resource_version) => {
    const arraytosplit = resource.split("/");
    const resource_user = arraytosplit[0];
    const resource_name = arraytosplit[1].split("@")[0] || arraytosplit[1];

    return new Promise(async (resolve, reject) => {
      await request.get('https://api.github.com/repos/' + resource_user + "/" + resource_name + "/tags").set('Accept', 'application/json')
      .then(res => {
        const version = res.body[0].name;
        
        (resource_version != version)
        ? console.log(resource + "\t"+ "Installed: " + resource_version+"\t" +chalk.green(" New Version:"+version)+"\n")
        : console.log(resource + "\t"+ "Installed: " + resource_version+"\n");
        resolve();
      })
      .catch(err => {
        console.log(chalk.red("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !"));
        console.log("\n");
        reject("Error: Resource "+ resource_user + "/" + resource_name + " Not Found or not possible to update !");
        return;
      });
    });
  },
  check_resource_format: (resource_name) => {
    return /(^([^/]+)\/([^/]+)@\S+$)|(^([^/]+)\/([^/]+)$)/g.test(resource_name);
  }
};