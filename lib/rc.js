import rc from 'rc';
let defaults = {  IGNORES: 'node_modules, .git, .DS_Store',
SEQUENCE: 'toString, trim, doSwaps, toParamCase, lowerCase',
};
let conf = rc("detawks", defaults);
let parsedConf = {
    ignores: conf.IGNORES.split(',').map((x)=>x.trim()),
    sequence: conf.SEQUENCE.split(',').map((x)=>x.trim())
};
export { parsedConf as default };