![Detawks Logo](detawks-small.jpg)

# Detawks

A Node.js adaptation of [detox](https://github.com/dharple/detox), tailored with personal preferences for file naming. The primary motivation was to facilitate the installation of a detox setup using `yarn`.

## Defawlt Features
- Replaces spaces with dashes (because dashes are great!)
- Removes underscores.
- Converts filenames to lowercase.
- Transforms most accented characters to their unaccented counterparts, probably
- Eliminates most punctuation.

## NOW WITH CUSTOMIZABILITY in .rc format!
- Specify a sequence of functions to apply to a string. Right now, you can only specify the absurd ones I've written, but I'll add more and maybe they'll even make sense.
- Specify a list of files and directories to ignore, glob-style.
- Comma-delimited, please
Example configuration:
``` 
IGNORES = node_modules, .git, .DS_Store
SEQUENCE = toString, trim, doSwaps, toParamCase, lowerCase, maxChars, minChars, fallbackToRandom
```
### Sequence Functions:
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

And that's how I made converting strings to ASCII too complicated!
## Usage
Execute the command:
```
detawks <options> <glob / directory / file> 
```

## Options
- `-s`: Silent mode (no console logs for new file names).
- `-d`: Dry run (shows potential file renames without executing them).
- `-r`: Overwrite mode (renames files automatically without prompting).
- `-f`: Includes directories in the operation. e.g. renames those too.
- `-m`: Specifies max depth for operations.

## Acknowledgements
Special thanks to this contributor: [https://gist.github.com/codeguy/6684588](https://gist.github.com/codeguy/6684588)
- I LOVE fdir. It's a great library. Check it out: [https://github.com/thecodrr/fdir](github link)

