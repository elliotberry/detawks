import valid from './valid.js'
import fs from 'fs'


let r = fs.readFileSync('./valid-file-extensions.js')
let g = r.toString().split('\n')
let h = g.map((x) => {
    return {
        ext: x,
        type: '`',
        mimetype: '',
        description: ''
    }
});
fs.writeFileSync('./valid-file-extensions.json', JSON.stringify(h, null, 2))