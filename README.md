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
  -u, --uglify  Minify scss                           [boolean] [default: false]
  -o, --output  Provide output directory path                [string] [required]
  -n, --name    Provide Output File name prefix     [string] [default: "global"]

```

```
AST Version

$ sass-stylesheet -i [scss source code directory]
```
