const fs = require('fs');
const rollup = require('rollup');
const rollupConfigs = require('./rollup.config.js');
const uglify = require('uglify-js');

// TODO uglify
async function builds() {
  let regVersion = /(version\s*=\s*['"])((?:\d\.){2,2}\d)(['"])/;
  let packJson = await readFile('package.json');
  packJson = JSON.parse(packJson);
  await Promise.all(rollupConfigs.map(config => {
    async function build() {
      let isUglify = /min\.js$/.test(config[1].file);
      const bundle = await rollup.rollup(config[0]);
      // generate code and a sourcemap
      var { code } = await bundle.generate(config[1]);

      code = code.replace(regVersion, `$1${ packJson.version }$3`);

      if (isUglify) {
        code = await uglify.minify(code).code
      }

      await writeFile(config[1].file, code);
    }
    return build();
  }))
}

let packJson
async function writeFile(dest, code) {
  return new Promise((res, rej) => {
    fs.writeFile(dest, code, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}

function readFile(file) {
  return new Promise((res, rej) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) { 
        rej(err); 
      } else {
        res(data);
      }
    });
  });
}

builds();