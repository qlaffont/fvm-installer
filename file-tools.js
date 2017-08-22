var fs = require('fs');
var path = require('path');

module.exports = {
  check_existing_config_file: function(){
    return fs.existsSync(path.join(process.cwd(), "scripts.json"));
  },
  check_existing_resource_folder: function(){
    return fs.existsSync(path.join(process.cwd(), "resources"));
  },
  get_config_file: function(){
    return require(path.join(process.cwd(), "scripts.json"));
  },
  set_config_file: function(data){
    fs.writeFileSync(path.join(process.cwd(), "scripts.json", data));
  }
};
