![Detawks Logo](./.github/detawks-small.jpg)

# D͓̽e͓̽t͓̽a͓̽w͓̽k͓̽s͓̽
Renames files en masse so that when I scroll by them they all look uniform and pleasing.

A lazy Node.js adaptation of [detox](https://github.com/dharple/detox), tailored with personal preferences for file naming. The primary motivation was to facilitate the installation of a detox setup using `yarn`. However, at length this started to take on some arguably useful configurations.

## Usage
In your favorite terminal, run:
```
detawks <options> <glob / directory / file> 
```
### Options
- `-s`: Silent mode (no console logs for new file names).
- `-d`: Dry run (shows potential file renames without executing them).
- `-r`: Overwrite mode (renames files automatically without prompting).
- `-f`: Includes directories in the operation. e.g. renames those too.
- `-m`: Specifies max depth for operations.

## Config setup
### Location
The configuration file follows the `rc` [package conventions](https://www.npmjs.com/package/rc) - create your own config at `~/.detawksrc`. The default configuration is located at `./default.detawksrc`.
### Example configuration:
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

Specify a sequence of functions to apply to a string. Right now, you can only specify the absurd ones I've written (see below), but I'll add more, or not. When they take arguments, you can specify them in the `args` object as shown above.

## Glossary: Sequence Functions Supported
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

And that's how I made converting strings to ASCII too complicated!

## Acknowledgements
- Special thanks to this contributor: [https://gist.github.com/codeguy/6684588](https://gist.github.com/codeguy/6684588)

- I LOVE fdir. It's a great library. Check it out: [https://github.com/thecodrr/fdir](github link)

