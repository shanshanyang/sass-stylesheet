## Sass Stylesheet

> Sass-stylesheet cherry picks a list of scss code from multiple files, write out the result to one file.
> The list is 'mixin', 'variable', 'placeholder', 'function'.
> It is created to share reusable scss code across multiple projects without cross pollute css codebase.

`npm i -g sass-stylesheet`

```
$  sass-stylesheet
Usage: sass-stylesheet [options]

Options:  
  -i, --input   Provide source directory path as input       [string] [required]
// based on SCSS Abstract Syntax Tree
  -u, --uglify  Minify scss                           [boolean] [default: false]
// based on file name
  -s, --ast     Parse all scss code into AST and output the node type specified in config.json
  --settings    Path to JSON config file
  -o, --output  Provide output directory path                [string] [required]
  -n, --name    Provide Output File name prefix     [string] [default: "global"]

```

```
AST Version

$ sass-stylesheet -i [scss source code directory] -u
```

```
File name Version Required configuration JSON file

$ sass-stylesheet -i [scss source code directory] --settings config.json

config.json

{
  "filterStr": ["placeholder", "variables", "mixins"], //file name string match. example file name: dropdown.placeholder.scss
  "filterType": ["scss"],
  "filterPlatform": ["desktop", "mobile"]
}
```
