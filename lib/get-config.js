import fg from 'fast-glob';
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const getConfig = () => {
  //try to get config json file in home directopry, if it's niot there, use default in this folder
  const configPath = path.join(os.homedir(), 'config.json');
  let config = {};
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, 'default.config.json'), 'utf8'));
  }
  return config;
};

const importAll = async () => {
  //import all js files in folder sequences

  const sequences = fg.sync(path.join(__dirname, 'sequences/*.js')).map(async f => {
    const moduleA = await import(f);
    return moduleA.default;
  });
  let sequencesArray = await Promise.all(sequences);
  console.log(sequencesArray);
  return sequences;
};
importAll();
