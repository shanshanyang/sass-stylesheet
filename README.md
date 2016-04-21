## Sass Stylesheet

> Sass-stylesheet cherry picks a list of scss code from multiple files, write out the result to one file. 
> The list is 'mixin', 'variable', 'placeholder', 'function' 
> It is created to share reusable scss code across multiple projects without cross pollute css codebase. 

`npm i -g sass-stylesheet`

```
$  sass-stylesheet
Usage: sass-stylesheet [options]

Options:
  -s, --ast     Parse all scss code into AST and output the node type specified in config.json 
  --settings    Path to JSON config file
  -i, --input   Provide source directory path as input       [string] [required]
  -o, --output  Provide output directory path                [string] [required]
  -n, --name    Provide Output File name prefix     [string] [default: "global"]
  -u, --uglify  Minify scss                           [boolean] [default: false]

```

```
Current Version Required configuration JSON file

$ sass-stylesheet --settings config.json

config.json

{
  "filterStr": ["placeholder", "variables", "mixins"], //file name string match. example file name: dropdown.placeholder.scss
  "filterType": ["scss"],
  "filterPlatform": ["desktop", "mobile"]
}
```

AST Version 

$ sass-stylesheet -i [scss source code directory] -u

