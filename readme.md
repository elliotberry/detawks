![Detawks Logo](./.github/detawks-small.jpg)
![](https://img.shields.io/badge/garbage-red)
![CI/CD Pipeline](https://github.com/elliotberry/detawks/workflows/CI/badge.svg)

# D͓̽e͓̽t͓̽a͓̽w͓̽k͓̽s͓̽

Renames files en masse so that when I scroll by them they all look uniform and pleasing.

A lazy Node.js adaptation of [detox](https://github.com/dharple/detox), tailored with personal preferences for file naming.

## Installation

```bash
npm install -g detawks
```

Requires Node.js 20.19 or later. Linux and macOS only.

## Usage

```bash
detawks <options> <glob / directory / file>
```

### For Example

```bash
detawks ./a_VERy_bad__filename.zip

a_VERy_bad__filename.zip -> a-very-bad-filename.zip
```

Passing a directory is recursive. Use `--max-depth 0` to rename only files in that directory.

### Options

- `-s, --silent`: Silent mode (no console logs for new file names).
- `-d, --dryrun`: Dry run (shows potential file renames without executing them).
- `-r, --rename`: On collision, auto-suffix (`file-01.ext`, `file-02.ext`, …). This is the default. Use `--no-rename` to skip files whose target already exists.
- `-f, --dirs`: Include directories in the operation (renames those too, deepest first).
- `-m, --max-depth`: Max crawl depth. `0` means this directory only. Omit for unlimited.
- `-b, --batch-size`: Number of files to process concurrently (default: 50). Directory renames (`-f`) always run sequentially.
- `-l, --list`: List all available string operations.
- `-h, --help`: Show help.

### Performance Features

- **Concurrent Processing**: After unique destination names are assigned, files are renamed in parallel (configurable batch size).
- **Progress Indicators**: Shows progress for large file sets (>10 files).
- **Configurable Concurrency**: Lower the batch size on limited systems.

### Examples

```bash
# Recursive rename of a folder
detawks ./files

# This directory only
detawks --max-depth 0 ./files

# High-performance processing
detawks --batch-size 100 ./files

# Conservative processing for limited resources
detawks --batch-size 10 ./files

# Dry run
detawks --dryrun ./files

# Skip collisions instead of suffixing
detawks --no-rename ./files
```

## Configuration

The configuration file follows the `rc` [package conventions](https://www.npmjs.com/package/rc) — create your own at `~/.detawksrc`. The shipped default is `./default.detawksrc`.

### Example Configuration

```json
{
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
        },
        "fallbackToRandom"
    ]
}
```

Like Detox, you specify a sequence of functions to apply to each basename. When a function takes arguments, pass an object with `name` and `args` as shown above.

`ignores` is an array of [picomatch](https://github.com/micromatch/picomatch) globs. Basename matches (e.g. `node_modules`) also skip that directory during the crawl.

## Glossary: String Functions

*(see `./lib/string-modification-functions.js` for more details)*

- **toParamCase**: Converts a string to param case (spaces and special characters to hyphens, lowercase).
- **removeInvalidChars**: Removes characters that aren't lowercase letters, numbers, spaces, or hyphens.
- **toString**: Ensures the input is of string type.
- **trim**: Strips leading and trailing whitespace.
- **lowerCase**: Converts the string to lowercase.
- **replaceWhiteSpace**: Replaces all whitespace with a specified character (default is hyphen).
- **maxChars**: Truncates the string to a specified maximum length.
- **minChars**: Removes a specified number of characters from the start (default is 3).
- **removeConsecutiveDashes**: Replaces consecutive dashes with a single dash.
- **removeConsecutiveDashesAtStartEnd**: Removes consecutive dashes at the start and end of the string.
- **fallbackToRandom**: If the string is empty, returns a short random ASCII string. Empty and emoji-only names use this when it is in the sequence (it is in the default).
- **replaceAmpersand**: Replaces `&` with `and`.

Look at `slugify.js` to see the rats' nest of code that makes this work.

### Acknowledgements

Special thanks to this contributor: [https://gist.github.com/codeguy/6684588](https://gist.github.com/codeguy/6684588)

[fdir](https://github.com/thecodrr/fdir) is a great library for getting lists of files out of dirs fast as all hell.
