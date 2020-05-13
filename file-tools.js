const fs = require('fs');
const path = require('path');

module.exports = {
  check_existing_config_file: _ => {
    return fs.existsSync(path.join(process.cwd(), "scripts.json"));
  },
  check_existing_resource_folder: _ => {
    return fs.existsSync(path.join(process.cwd(), "resources"));
  },
  get_config_file: _ => {
    return require(path.join(process.cwd(), "scripts.json"));
  },
  set_config_file: (data) => {
    fs.writeFileSync(path.join(process.cwd(), "scripts.json"), data);
  }
};
