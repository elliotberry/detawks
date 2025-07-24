import config from './rc.js';
import stringModificationFunctions from './string-modification-functions.js';

let slugifyFunction;
const slugifyCache = new Map();

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
        const function_ = stringModificationFunctions[item.name]?.fn;
        if (!function_) {
            console.warn(`String modification Function ${item.name} is not defined`);
            continue;
        }
        finalFunctions.push({
            args: item.args || {},
            fn: function_,
        });
    }

    if (finalFunctions.length === 0) {
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

        // Check cache first for performance
        if (slugifyCache.has(string_)) {
            return slugifyCache.get(string_);
        }

        const newString = await slugifyFunction(string_);
        if (!newString) {
            throw new Error('Resulting string is empty. Check modification functions.');
        }

        // Cache the result
        slugifyCache.set(string_, newString);
        
        // Limit cache size to prevent memory issues
        if (slugifyCache.size > 1000) {
            const firstKey = slugifyCache.keys().next().value;
            slugifyCache.delete(firstKey);
        }

        return newString;
    } catch (error) {
        console.warn(`Error slugifying "${string_}": ${error.toString()}`);
    }
};

init();

export { slugify };
export { default as stringModificationFunctions } from './string-modification-functions.js';
