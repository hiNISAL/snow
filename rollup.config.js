import uglify from 'rollup-plugin-uglify';

const isDev = process.env.NODE_ENV === 'development';
const minify = process.env.MINIFY;

const config = {
  input: 'src/snow.js',
  output: {
    file: 'src/snow.js',
    format: 'umd',
    name: '$Snow'
  },
  plugins: []
};

if (isDev) {
  
} else {
  if (minify === 'true') {
    config.output.file = 'release/snow.min.js';
    config.plugins.push(uglify.uglify());
  } else {
    config.output.file = 'release/show.js';
  }
}

export default config;
