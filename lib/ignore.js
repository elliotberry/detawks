import config from './rc.js';

const getIgnores = () => {
    const ignores = config.ignores;
    if (Array.isArray(ignores) && ignores.length > 0) {
        return ignores;
    }
    throw new Error('ignore config in the config file is not valid');
};

const ignoreFilterFactory = () => {
    const config_ = getIgnores();
    global.debug && console.log(`conf: ${config_}`);

    return (filePath) => !config_.includes(filePath.oldParsed.base);
};

const ignore = async (arrayOfFilePaths) => {
    const ignoreFunction = ignoreFilterFactory();
    return arrayOfFilePaths.filter(ignoreFunction);
};

export default ignore;
