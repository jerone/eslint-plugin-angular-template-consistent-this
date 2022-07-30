# ESLint Angular Template consistent this (`eslint-plugin-angular-template-consistent-this`)

Explicit/implicit prefix properties, variables and template references with `this.` in Angular HTML templates.

There is no functional reason to start properties with `this`. It is solely aesthetic. But by giving developers the choice to apply it or not, the code will look inconsistent.

Explicit means that properties, variables and template references start with `this.`, like: `<test *ngIf="this.foo">{{this.bar}}</test>`.

## Requirements

You'll need to have an Angular project with the following packages installed:

- [ESLint](https://eslint.org/)
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint)

## Installation

Install `eslint-plugin-angular-template-consistent-this`:

```sh
npm install eslint-plugin-angular-template-consistent-this --save-dev
```

## Usage

Add `eslint-plugin-angular-template-consistent-this` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```diff
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    // ...
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
+       "plugin:angular-template-consistent-this/eslint-plugin-angular-template-consistent-this"
      ],
      "rules": {
        // ...
      }
    }
  ]
}
```

Then configure the rules you want to use under the rules section.

```diff
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    // ...
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:angular-template-consistent-this/eslint-plugin-angular-template-consistent-this"
      ],
      "rules": {
        // ...

+       // Prepend properties with `this`.
+       "angular-template-consistent-this/eslint-plugin-angular-template-consistent-this": [
+         "error",
+         {
+           "properties": "explicit",
+           "variables": "implicit",
+           "templateReferences": "implicit"
+         }
+       ]
      }
    }
  ]
}
```
