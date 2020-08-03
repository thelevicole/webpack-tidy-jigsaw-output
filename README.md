# Tidy the Jigsaw generated output
[![Latest Stable Version](https://img.shields.io/npm/v/@thelevicole/webpack-tidy-jigsaw-output)](https://www.npmjs.com/package/@thelevicole/webpack-tidy-jigsaw-output)
[![Total Downloads](https://img.shields.io/npm/dt/@thelevicole/webpack-tidy-jigsaw-output)](https://www.npmjs.com/package/@thelevicole/webpack-tidy-jigsaw-output)

This webpack plugin is run when the [jigsawDone](https://github.com/tightenco/laravel-mix-jigsaw/pull/14) event.

Basic Usage
-

Install with npm:
```bash
npm i @thelevicole/webpack-tidy-jigsaw-output --save-dev
```

Include the plugin in your `webpack.mix.js` file as follows:
```javascript
const mix = require('laravel-mix');
const TidyJigsawOutput = require('@thelevicole/webpack-tidy-jigsaw-output');
require('laravel-mix-jigsaw');

...
```

And then add the plugin to the webpack config:
```javascript
...

mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput()
    ]
});
```

The full `webpack.mix.js` should look something like...
```javascript
const mix = require('laravel-mix');
const TidyJigsawOutput = require('webpack-tidy-jigsaw-output');
require('laravel-mix-jigsaw');

mix.disableSuccessNotifications();
mix.setPublicPath('source/assets/build');

mix.jigsaw()
    .js('source/_assets/js/main.js', 'js')
    .sass('source/_assets/sass/main.scss', 'css')
    .options({
        processCssUrls: false,
    })
    .version();

mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput({
            verbose: true
        })
    ]
});
```

Options
-

The below options can be passed to the plugin.

|Key|Description|Default|
|--|--|--|
| [`rules`](#rules) | This is an object of rules to be used by [pretty](https://www.npmjs.com/package/pretty). | `{ ocd: true }` |
| [`env`](#env) | Set a specific build environment for dynamically guessing the output directories. By default uses the parameter sent to webpack e.g. `npm run production` | `local` |
| [`allowedEnvs`](#allowedenvs) | Accepts a string or array of environment names for which tidying should run. E.g. `[ 'production', 'staging' ]` will only tidy production and staging builds.  | `*` |
| [`verbose`](#verbose) | Whether or not to print logs to the console. | `false` |
| [`test`](#test) | The regular expression used before modifying a file | `/\.html$/` |
| [`encoding`](#encoding) | The file encoding used to read the input. | `utf8` |

### `rules`

This is an object of rules will be passed **as is** to [pretty](https://www.npmjs.com/package/pretty).
If empty, the default value is used: `{ ocd: true }`.

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput({
            rules: {
                ocd: true
            }
        })
    ]
});
```
The above example will:
- condenses multiple newlines to a single newline
- trims leading and trailing whitespace
- ensures that a trailing newline is inserted
- normalizes whitespace before code comments

### `env`

Set a specific build environment for dynamically guessing the output directories.
If empty, the `env` parameter parsed to node is used.

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput({
            env: 'production'
        })
    ]
});
```
The above example will only tidy the build output in the `build_production` directory.

### `allowedEnvs`

Accepts a string or array of environment names for which tidying should run. 
If empty, the default value is used: `'*'`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput({
            allowedEnvs: ['production', 'staging']
        })
    ]
});
```
The above example will only run the tidying process when the build environment is either `production` or `staging`, local will not be tidied.

### `verbose`

This option  increases  the amount of information you are given during the tidying process.
If empty, the default value is used: `false`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput({
            verbose: true
        })
    ]
});
```
The above example will print a list of tidied files as and when they are processed, for example:

- `[TidyJigsawOutput] Tidying /Users/example/my-site/build_production/index.html`
- `[TidyJigsawOutput] Tidying /Users/example/my-site/build_production/about/index.html`

### `test`

The regular expression used before to check if a file should be tidied.
If empty, the default value is used: `/\.html$/`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput({
            test: /about\/.*\.html$/
        })
    ]
});
```
The above example will only process `.html` files found in the about directory, for example:

- `/Users/example/my-site/build_production/about/index.html`
- `/Users/example/my-site/build_production/about/the-team/index.html`

> Please note that this full path is tested against the regex pattern, so the above example would tidy all html files if a directory outside of the project includes "about".
> E.g.
> - /Users/**about**/my-site/build_production/index.html
> - /Users/example/project-**about**/build_production/index.html

### `encoding`

If for some reason you need to set the file encoding used to read the input source, use this option. The allowed values are determined by node.js, a good thread about supported encodings can be found here: https://stackoverflow.com/a/14551669/3804924
If empty, the default value is used: `'utf8'`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new TidyJigsawOutput({
            encoding: 'latin1'
        })
    ]
});
```