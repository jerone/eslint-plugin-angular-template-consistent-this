# ESLint Angular Template consistent this (`eslint-plugin-angular-template-consistent-this`)

Explicit/implicit prefix properties, variables and template references with `this.` in Angular HTML templates.

From what I understand there is no functional reason to start properties with `this`. It is solely aesthetic. But by giving developers the choose to use it or not, your code will look inconsistent.

Explicit means that properties, variables and template references start with `this.`, like: `<test *ngIf="this.foo">{{this.bar}}</test>`.

## Rule Details

This rule applies to the following types within Angular HTML templates:

* properties,
* inline defined variables,
* inline defined template references

Example of **incorrect** property code:

```html
<test *ngIf="foo">{{bar}}</test>
             ~~~    ~~~
```

Example of **correct** property code:

```html
<test *ngIf="this.foo">{{this.bar}}</test>
```


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

```html
<test *ngIf="foo">{{bar}}</test>
             ~~~    ~~~
```

Example of **correct** explicit property code:

```html
<test *ngIf="this.foo">{{this.bar}}</test>
```

### `"properties"` - implicit

Example of **incorrect** implicit property code:

```html
<test *ngIf="this.foo">{{this.bar}}</test>
             ~~~~~~~~    ~~~~~~~~
```

Example of **correct** implicit property code:

```html
<test *ngIf="foo">{{bar}}</test>
```


### `"variables"` - explicit

Example of **incorrect** explicit variable code:

```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{bar}}</test>
                                              ~~~
```

Example of **correct** explicit variable code:

```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{this.bar}}</test>
```

### `"variables"` - implicit

Example of **incorrect** implicit variable code:

```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{this.bar}}</test>
                                              ~~~~~~~~
```

Example of **correct** implicit variable code:

```html
<test *ngIf="this.foo as bar;">{{this.foo}} {{bar}}</test>
```


### `"templateReferences"` - explicit

Example of **incorrect** explicit template references code:

```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then thenBlock else elseBlock">{{this.foo}}</test>
                            ~~~~~~~~~      ~~~~~~~~~
```

Example of **correct** explicit template references code:

```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then this.thenBlock else this.elseBlock">{{this.foo}}</test>
```

### `"templateReferences"` - implicit

Example of **incorrect** implicit template references code:

```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then this.thenBlock else this.elseBlock">{{this.foo}}</test>
                            ~~~~~~~~~~~~~~      ~~~~~~~~~~~~~~
```

Example of **correct** implicit template references code:

```html
<ng-template #thenBlock>...</ng-template>
<ng-template #elseBlock>...</ng-template>
<test *ngIf="this.foo; then thenBlock else elseBlock">{{this.foo}}</test>
```


## Fixable

All types for both implicit and explicit are fixable. **Except for interpolation.**
Calculation of property/variable/template position within interpolation is not correct in some cases. You can also see that warning underline sometimes is not correct. Therefor, fixing code for interpolation is disabled. The [issue is known](https://github.com/angular-eslint/angular-eslint/issues/292).


## Notes

This plugin does not check the component TypeScript for existence of properties.
