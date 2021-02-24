const babel = require("rollup-plugin-babel");
const replace = require('rollup-plugin-replace');

const base = {
  input: 'src/index.js',
};

/**
 * babel-runtime 会往文件里面添加import 
 * 导致webpack报错 Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'
 * 报错原因是混合使用了 import 和 module.exports = 
 * 解决方法为发布为npm包或babel忽略此文件
 */
const outputs = {
  'web-dev': {
    file: 'dist/monitor.min.js',
    format: 'umd',
    env: 'production',
    name: 'Monitor'
  },
  'web-prod': {
    file: 'dist/monitor.js',
    format: 'umd',
    env: 'development',
    name: 'Monitor'
  },
  'web-cjs': {
    file: 'dist/monitor.common.js',
    format: 'cjs',
    name: 'Monitor'
  },
  'web-esm': {
    file: 'dist/monitor.esm.js',
    format: 'esm',
    name: 'Monitor'
  }
};
 function getBuids() {
  return Object.keys(outputs).map(name => {
    let input = Object.assign({}, base);
    input.plugins = [babel()]

    let output = outputs[name];

    if (output.env) {
      input.plugins.push(replace({
        'process.env.NODE_ENV': JSON.stringify(output.env)
      }))
      delete output.env;
    }

    return [input, output];
  });
}


module.exports = getBuids();



