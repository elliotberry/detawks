![Detawks Logo](./.github/detawks-small.jpg)
![](https://img.shields.io/badge/garbage-red)
# D͓̽e͓̽t͓̽a͓̽w͓̽k͓̽s͓̽

Renames files en masse so that when I scroll by them they all look uniform and pleasing.

A lazy Node.js adaptation of [detox](https://github.com/dharple/detox), tailored with personal preferences for file naming. The primary motivation was to facilitate the installation of a detox setup using `yarn`. However, at length this started to take on some arguably useful configurations.

## Installation

```bash
npm install -g detawks
```

## Usage

In your favorite terminal, run:

```bash
detawks <options> <glob / directory / file> 
```

### For Example

```bash
detawks ./a_VERy_bad__filename.zip

a_VERy_bad__filename.zip -> a-very-bad-filename.zip
```

### Options

- `-s, --silent`: Silent mode (no console logs for new file names).
- `-v, --verbose`: Verbose mode (console logs for new file names, other cool info).
- `-d, --dryrun`: Dry run (shows potential file renames without executing them).
- `-r, --rename`: if overwrite is possible, rename files AUTOMAGICALLY without prompting. This will take the form of `file-01.ext`, `file-02.ext`, etc.
- `-f, --dirs`: Includes directories in the operation. e.g. renames those too.
- `-m, --max-depth`: Specifies max depth for operations.
- `-l, --list`: List all possible string operations (see below for a more direct method of perusing this information).
- `-h, --help`: Show something approximating this, if I remember to update it.

## Configuration to Your Most Personal Desires

The configuration file follows the `rc` [package conventions](https://www.npmjs.com/package/rc) - create your own config at `~/.detawksrc`. The default configuration is located at `./default.detawksrc`.

### Example Configuration

```
 "ignores": [
        "node_modules",
        ".git",
        ".DS_Store"
    ],
    "sequence": [
        "toString",
        "trim",
        "doSwaps",
        "toParamCase",
        "lowerCase",
        {
            "name": "maxChars",
            "args": {
                "num": 100
            }
        }
    ]
```

Like in Detox, you can specify a sequence of functions to apply to a string. Right now, you can only specify the absurd ones I've written (see below), but I'll add more, or not. When they take arguments, you can specify them in the `args` object as shown above.

'ignores' is an array of globs that will be ignored when renaming files.

## Glossary: String Fuckery Sequence Functions Supported

*(see `./lib/string-modification-functions.js` for more details)*

- **toParamCase**: Converts a string to param case, transforming spaces and special characters to hyphens and converting all letters to lowercase.
- **removeInvalidChars**: Removes characters that aren't lowercase letters, numbers, spaces, or hyphens.
- **toString**: Ensures the input is of string type.
- **trim**: Strips leading and trailing whitespace.
- **lowerCase**: Converts the string to lowercase.
- **replaceWhiteSpace**: Replaces all whitespace with a specified character (default is hyphen).
- **maxChars**: Truncates the string to a specified maximum length.
- **minChars**: Removes a specified number of characters from the start (default is 3).
- **removeConsecutiveDashes**: Replaces consecutive dashes with a single dash.
- **removeConsecutiveDashesAtStartEnd**: Removes consecutive dashes at the start and end of the string.
- **fallbackToRandom**: If the string is empty, it returns a random string generated using `Math.random()` and `toString(36)`.

Look at `slugify.js` to see the rats' nest of code that makes this work.

And that's how I made converting strings to ASCII too complicated, while barely understanding how character encoding works!

### Acknowledgements

Special thanks to this contributor: [https://gist.github.com/codeguy/6684588](https://gist.github.com/codeguy/6684588)

fdir is a great library for getting lists of files out of dirs fast as all hell. Check it out: [https://github.com/thecodrr/fdir](github link)
