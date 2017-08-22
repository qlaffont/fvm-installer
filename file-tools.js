var fs = require('fs');

module.exports = {
  check_existing_config_file: function(){
    return fs.existsSync(process.cwd() + "\\scripts.json");
  },
  check_existing_resource_folder: function(){
    return fs.existsSync(process.cwd() + "\\resources\\");
  },
  get_config_file: function(){
    return require(process.cwd() + "\\scripts.json");
  },
  set_config_file: function(data){
    fs.writeFileSync(process.cwd() + "\\scripts.json", data);
  }
};
