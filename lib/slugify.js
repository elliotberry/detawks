import config from './rc.js';
import stringModificationFunctions from './string-modification-functions.js';

let slugifyFunction;

const pipeFunctions = async (string_, ...fns) => {
    for (const function_ of fns) {
        string_ = await function_.fn(string_, function_.args);
    }
    return string_;
};

const init = () => {
    const slugifyConfig = config.sequence;
    const finalFunctions = [];

    for (const item of slugifyConfig) {
        const fn = stringModificationFunctions[item.name]?.fn;
        if (!fn) {
            console.warn(`String modification Function ${item.name} is not defined`);
            continue;
        }
        finalFunctions.push({
            args: item.args || {},
            fn,
        });
    }

    if (!finalFunctions.length) {
        throw new Error('Initialization error: no functions in array');
    }

    slugifyFunction = (string_) => pipeFunctions(string_, ...finalFunctions);
};

const slugify = async (string_) => {
    try {
        if (typeof slugifyFunction !== 'function') {
            throw new TypeError('Slugify function is not initialized correctly');
        }
        if (typeof string_ !== 'string' || !string_) {
            throw new TypeError('Input must be a non-empty string');
        }

        const newString = await slugifyFunction(string_);
        if (!newString) {
            throw new Error('Resulting string is empty. Check modification functions.');
        }
        return newString;
    } catch (error) {
        console.warn(`Error slugifying "${string_}": ${error.toString()}`);
    }
};

init();

export { slugify };
export { default as stringModificationFunctions } from './string-modification-functions.js';
