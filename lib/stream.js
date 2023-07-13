import fg from 'fast-glob';
import {pipeline, Transform, Writable} from 'stream';
import path from 'path';


const xformer = new Transform()

xformer._transform = (chunk, encoding, next) => {
    console.log(chunk.toString());
    next();
  }
const read = fg.stream('./*', {absolute: true});

const getPaths = f => {
  console.log(f());
  return path.parse(f);
};

const out = f => {
  console.log(f);
};

function renderer() {
  return new Writable({
    write: (data, _, done) => {
      console.log('<-', data);
      done();
    },
  });
}
const writableStream = new Writable();

writableStream._write = (chunk, encoding, next) => {
  console.log(chunk);
  next();
};

pipeline(read, xformer, writableStream, err => {
  if (err) {
    console.log('Pipeline failed: ');
    console.log(err);
  } else {
    console.log('Pipeline succeeded.');
  }
});
