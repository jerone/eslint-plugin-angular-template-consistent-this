# ESLint Angular Template consistent this (`eslint-plugin-angular-template-consistent-this`)

Explicit/implicit prefix properties, variables and template references with `this.` in Angular HTML templates.

There is no functional reason to start properties with `this`. It is solely aesthetic. But by giving developers the choice to apply it or not, the code will look inconsistent.

Explicit means that properties, variables and template references start with `this.`, like: `<test *ngIf="this.foo">{{this.bar}}</test>`.

## Rule Details

This rule applies to the following types within Angular HTML templates:

- properties,
- inline defined variables,
- inline defined template references

Example of **incorrect** property code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="foo">{{bar}}</test>
             ~~~    ~~~
```
<!-- prettier-ignore-end -->

Example of **correct** property code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="this.foo">{{this.bar}}</test>
```
<!-- prettier-ignore-end -->

## Options

Per type it's possible to specify if you want to explicit of implicit prefix the type with `this.`.

This plugin uses the following scheme:

```json
{
  "type": "object",
  "properties": {
    "properties": {
      "type": "string",
      "enum": ["explicit", "implicit"],
      "default": "explicit"
    },
    "variables": {
      "type": "string",
      "enum": ["explicit", "implicit"],
      "default": "implicit"
    },
    "templateReferences": {
      "type": "string",
      "enum": ["explicit", "implicit"],
      "default": "implicit"
    }
  }
}
```

Use in your ESLint config file:

```js
{
  "angular-template-consistent-this/eslint-plugin-angular-template-consistent-this": "warn"
}
```

Or with all available options:

```js
{
  "angular-template-consistent-this/eslint-plugin-angular-template-consistent-this": [
    "warn",
    {
      "properties": "explicit",
      "variables": "implicit",
      "templateReferences": "implicit"
    }
  ]
}
```

The default for variables and template references is implicit.
The default for properties is explicit.
The reason behind this is that properties are defined in the components back-end, where the prefix is required. Variables and template references are (mostly) only defined in the template and don't leak outside.

### `"properties"` - explicit

Example of **incorrect** explicit property code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="foo">{{bar}}</test>
             ~~~    ~~~
```
<!-- prettier-ignore-end -->

Example of **correct** explicit property code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="this.foo">{{this.bar}}</test>
```
<!-- prettier-ignore-end -->

### `"properties"` - implicit

Example of **incorrect** implicit property code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="this.foo">{{this.bar}}</test>
             ~~~~~~~~    ~~~~~~~~
```
<!-- prettier-ignore-end -->

Example of **correct** implicit property code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="foo">{{bar}}</test>
```
<!-- prettier-ignore-end -->

### `"variables"` - explicit

Example of **incorrect** explicit variable code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{bar}}</test>
                                              ~~~
```
<!-- prettier-ignore-end -->

Example of **correct** explicit variable code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{this.bar}}</test>
```
<!-- prettier-ignore-end -->

### `"variables"` - implicit

Example of **incorrect** implicit variable code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{this.bar}}</test>
                                              ~~~~~~~~
```
<!-- prettier-ignore-end -->

Example of **correct** implicit variable code:

<!-- prettier-ignore-start -->
```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{bar}}</test>
```
<!-- prettier-ignore-end -->

### `"templateReferences"` - explicit

Example of **incorrect** explicit template references code:

<!-- prettier-ignore-start -->
```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then thenBlock else elseBlock">{{this.foo}}</test>
                            ~~~~~~~~~      ~~~~~~~~~
```
<!-- prettier-ignore-end -->

Example of **correct** explicit template references code:

<!-- prettier-ignore-start -->
```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then this.thenBlock else this.elseBlock">{{this.foo}}</test>
```
<!-- prettier-ignore-end -->

### `"templateReferences"` - implicit

Example of **incorrect** implicit template references code:

<!-- prettier-ignore-start -->
```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then this.thenBlock else this.elseBlock">{{this.foo}}</test>
                            ~~~~~~~~~~~~~~      ~~~~~~~~~~~~~~
```
<!-- prettier-ignore-end -->

Example of **correct** implicit template references code:

<!-- prettier-ignore-start -->
```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then thenBlock else elseBlock">{{this.foo}}</test>
```
<!-- prettier-ignore-end -->

## Fixable

All types for both implicit and explicit are fixable.

There are however edge-cases where the **property/variable/template position within data-binding** is incorrect calculated. You can see that warning underline sometimes is not correct (one character to the right or left for example). When that happens, the fixer will try to fix it on the wrong location. This results in incorrect syntax, which requires an manual change to fix correctly and then this rule will correctly ignore the warning. The [issue is known](https://github.com/angular-eslint/angular-eslint/issues/384).

## Notes

This plugin does not check the component TypeScript for existence of properties.
