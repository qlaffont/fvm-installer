const fileTools = require('./file-tools');
const chalk = require('chalk');

function ConfigFile(existingFile) {
  if (existingFile == true){
    if(!fileTools.check_existing_config_file()){
      console.log(chalk.red("Please initialise your FiveM Server Folder with : ")+ chalk.bold.red("fvm init"));
      console.log("\n");
      process.exit(0);
    }

    var file = fileTools.get_config_file();

    if(!(typeof file === 'object' && typeof file.name === 'string' && typeof file.author === 'string' && typeof file.website === 'string' && typeof file.resources === 'object' && typeof file.folder === 'object')){
      console.log(chalk.red("Please delete your resources.json file because data are corrupted."));
      console.log("\n");
      process.exit(0);
    }

    this.resources = file.resources;
    this.name = file.name;
    this.author = file.author;
    this.website = file.website;
    this.folder = file.folder;
  }else{
    if(!fileTools.check_existing_resource_folder()){
      console.log(chalk.red("You need to be in an FiveM FXServer directory ! (impossible to find resources folder !)"));
      console.log("\n");
      process.exit(0);
    }
  }
}


ConfigFile.prototype.getResources = function() {
  return this.resources;
};

ConfigFile.prototype.addResource = function(resource, resource_version, specifiedfolder) {
  this.resources[resource] = undefined;
  this.resources[resource] = resource_version;

  if(specifiedfolder != ""){
    this.folder[resource] = undefined;
    this.folder[resource] = specifiedfolder;
  }

  this.saveConfigFile();
};

ConfigFile.prototype.removeResource = function(resource) {
  this.resources[resource] = undefined;
  this.folder[resource] = undefined;
  this.saveConfigFile();
};

ConfigFile.prototype.saveConfigFile = function() {
  fileTools.set_config_file(JSON.stringify({"name": this.name, "author": this.author, "website": this.website, "resources": this.resources, "folder": this.folder}, null, "\t"));
};

ConfigFile.prototype.initConfigFile = function(name, author, website) {
  this.name = name;
  this.author = author;
  this.website = website;
  this.resources = {};
  this.folder = {};
  this.saveConfigFile();
};

module.exports = ConfigFile;
