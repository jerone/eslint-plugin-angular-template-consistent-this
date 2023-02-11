# ESLint Angular Template consistent this <br>`eslint-plugin-angular-template-consistent-this`

[![npm](https://img.shields.io/npm/v/eslint-plugin-angular-template-consistent-this)](https://www.npmjs.com/package/eslint-plugin-angular-template-consistent-this)
[![GitHub Action: CI](https://img.shields.io/github/actions/workflow/status/jerone/eslint-plugin-angular-template-consistent-this/.github/workflows/ci.yml?branch=master&label=CI&logo=github)](https://github.com/jerone/eslint-plugin-angular-template-consistent-this/actions/workflows/ci.yml)
[![GitHub Action: Security](https://img.shields.io/github/actions/workflow/status/jerone/eslint-plugin-angular-template-consistent-this/.github/workflows/security.yml?branch=master&label=Security&logo=github)](https://github.com/jerone/eslint-plugin-angular-template-consistent-this/actions/workflows/security.yml)
[![Codecov](https://codecov.io/gh/jerone/eslint-plugin-angular-template-consistent-this/branch/master/graph/badge.svg?token=BTJRO49LZT)](https://codecov.io/gh/jerone/eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Coverage](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=coverage)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Security Rating](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Bugs](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=bugs)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![SonarCloud: Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=jerone_eslint-plugin-angular-template-consistent-this&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=jerone_eslint-plugin-angular-template-consistent-this)
[![Snyk vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/jerone/eslint-plugin-angular-template-consistent-this?logo=snyk)](https://snyk.io/test/github/jerone/eslint-plugin-angular-template-consistent-this)
[![GitHub issues](https://img.shields.io/github/issues/jerone/eslint-plugin-angular-template-consistent-this?logo=github)](https://github.com/jerone/eslint-plugin-angular-template-consistent-this)
[![MIT license](https://img.shields.io/github/license/jerone/eslint-plugin-angular-template-consistent-this)](https://opensource.org/licenses/MIT)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat&logo=prettier)](https://github.com/prettier/prettier)

Explicit/implicit prefix properties, variables and template references with `this.` in Angular HTML templates.

There is no functional reason to start properties with `this`. It is solely aesthetic. But by giving developers the choice to apply it or not, the code will look inconsistent.

Explicit means that properties, variables and template references start with `this.`, like: `<test *ngIf="this.foo">{{this.bar}}</test>`.

Read more about this rule [in the documentation](https://github.com/jerone/eslint-plugin-angular-template-consistent-this/blob/master/docs/rules/eslint-plugin-angular-template-consistent-this.md).

## Requirements

You'll need to have an Angular project with the following packages installed:

- [ESLint](https://eslint.org/) - version 7 and 8 are tested.
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint) - version 13, 14 & 15 are tested.

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
        "plugin:@angular-eslint/template/recommended"
      ],
+     "plugins": ["angular-template-consistent-this"],
      "rules": {
        // ...
      }
    }
  ]
}
```

Then configure the rules you want to use under the rules section. The recommended configuration is:

```diff
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    // ...
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended"
      ],
      "plugins": ["angular-template-consistent-this"],
      "rules": {
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

<br/>
<br/>

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)
