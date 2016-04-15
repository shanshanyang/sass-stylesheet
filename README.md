`npm i -g sass-stylesheet`

```
$  sass-stylesheet
Usage: sass-stylesheet [options]

Options:
  --settings    Path to JSON config file
  -i, --input   Provide source directory path as input       [string] [required]
  -o, --output  Provide output directory path                [string] [required]
  -n, --name    Provide Output File name prefix     [string] [default: "global"]

```

```
Current Version Required configuration

$ sass-stylesheet --settings config.json

config.json

{
  "filterStr": ["placeholder", "variables", "mixins"],
  "filterType": ["scss"],
  "filterPlatform": ["desktop", "mobile"]
}
```