![enter image description here](detawks-small.jpg)
# detawks
Very rough copy of [detox](https://github.com/dharple/detox) in node, with my own personal opinions about file naming. I just wanted to be able to install my detox setup with `yarn` tbh.

- removes spaces, replaces with dashes
- i like dashes
- removes underscores
- converts to lowercase
- converts most accented characters to their unaccented equivalent, which it sort of intolerant i suppose, sorry
- removes most punctuation, probably

## Usage

Run `detawks <glob>`.
## Options
1. `-s`: Silent mode; e.g no console.log describing new file names
2. `-u`: Fix unix file extensions created by backup scripts (e.g. .txt~: I use the wonderful rsync to screw around a lot)
3. `-d`: Dry run, showing what files would be renamed
4. `-r`: If overwrite possible, rename files AUTOMAGICALLY without prompting
5. `-f`: Include directories
6. `-m`: Max depth

## Acknowledgements
This freakin' guyyyyy: https://gist.github.com/codeguy/6684588


