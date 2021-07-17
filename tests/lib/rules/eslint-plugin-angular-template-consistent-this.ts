"use strict";

const rule = require("../../../lib/rules/eslint-plugin-angular-template-consistent-this.js");
const parsers = require("../../helpers/parsers.js");
const {
  convertAnnotatedSourceToFailureCase,
} = require("../../helpers/test-helpers.js");
const { RuleTester } = require("eslint");

const { RULE_NAME, MESSAGE_IDS } = rule;

const ruleTester = new RuleTester({
  parser: parsers.ANGULAR_ESLINT,
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    /**
     * Only properties should be prefixed, not values.
     */
    {
      // Explicit.
      code: `<test [bar]="123" [foo]="true">{{false}}</test>`,
      options: [
        {
          properties: "explicit",
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },
    {
      // Implicit.
      code: `<test [bar]="123" [foo]="true">{{false}}</test>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
    },

    /**
     * Databinding.
     */
    {
      // Explicit.
      code: `<test [bar]="this.foo">{{this.bar}}</test>`,
    },
    {
      // Implicit.
      code: `<test [bar]="foo">{{bar}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      code: `<test [bar]="this.foo">{{this.bar}}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * Interpolation.
     */
    {
      // Explicit.
      code: `<test bar="{{this.foo}}">{{this.bar}}</test>`,
    },
    {
      // Implicit.
      code: `<test bar="{{foo}}">{{bar}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      code: `<test bar="{{this.foo}}">{{this.bar}}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * Interpolation, with extra whitespaces and tabs.
     */
    {
      // Explicit.
      code: `<test bar="{{  this.foo  }}">{{		this.bar		}}</test>`,
    },
    {
      // Implicit.
      code: `<test bar="{{  foo  }}">{{		bar		}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      code: `<test bar="{{  this.foo  }}">{{		this.bar		}}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * Interpolation, with line-breaks.
     */
    {
      // Explicit.
      code: `<test bar="{{
        this.foo
      }}">{{
        this.bar
      }}</test>`,
    },
    {
      // Implicit.
      code: `<test bar="{{
        foo
      }}">{{
        bar
      }}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      code: `<test bar="{{
        this.foo
      }}">{{
        this.bar
      }}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * Databinding & interpolation with sub-properties.
     */
    {
      // Explicit.
      code: `<test [bar]="this.foo.bar.baz">{{this.foo.bar.baz}}</test>`,
    },
    {
      // Implicit.
      code: `<test [bar]="foo.bar.baz">{{foo.bar.baz}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      code: `<test [bar]="this.foo.bar.baz">{{this.foo.bar.baz}}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * NgIf directive `*ngIf`.
     */
    {
      // Explicit property.
      code: `<test *ngIf="this.foo"><item>{{this.foo}}</item></test>`,
    },
    {
      // Implicit property.
      code: `<test *ngIf="foo"><item>{{foo}}</item></test>`,
      options: [
        {
          properties: "implicit",
        },
      ],
    },
    {
      // Other options shouldn't affect result.
      code: `<test *ngIf="this.foo"><item>{{this.foo}}</item></test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * NgIf directive `[ngIf]`.
     */
    {
      // Explicit property.
      code: `<test [ngIf]="this.foo"><item>{{this.foo}}</item></test>`,
    },
    {
      // Implicit property.
      code: `<test [ngIf]="foo"><item>{{foo}}</item></test>`,
      options: [
        {
          properties: "implicit",
        },
      ],
    },
    {
      // Other options shouldn't affect result.
      code: `<test [ngIf]="this.foo"><item>{{this.foo}}</item></test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * NgIf directive `*ngIf` with "as variable".
     */
    {
      // Explicit variable.
      code: `<test *ngIf="this.foo as bar;"><item>{{this.foo}} {{this.bar}}</item></test>`,
      options: [
        {
          variables: "explicit",
        },
      ],
    },
    {
      // Implicit variable.
      code: `<test *ngIf="this.foo as bar;"><item>{{this.foo}} {{bar}}</item></test>`,
    },
    {
      // Other options shouldn't affect result.
      code: `<test *ngIf="this.foo as bar;"><item>{{this.foo}} {{bar}}</item></test>`,
      options: [
        {
          properties: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * NgIf directive `*ngIf` with "let variable".
     */
    {
      // Explicit variable.
      code: `<test *ngIf="this.foo; let bar;"><item>{{this.foo}} {{this.bar}}</item></test>`,
      options: [
        {
          variables: "explicit",
        },
      ],
    },
    {
      // Implicit variable.
      code: `<test *ngIf="this.foo; let bar;"><item>{{this.foo}} {{bar}}</item></test>`,
    },
    {
      // Other options shouldn't affect result.
      code: `<test *ngIf="this.foo; let bar;"><item>{{this.foo}} {{this.bar}}</item></test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * NgIf directive `*ngIf` with then & else references to
     * templates that are defined *after* property reading.
     */
    {
      // Explicit template references.
      code: `
        <test *ngIf="this.foo as bar; then this.thenBlock else this.elseBlock">{{bar}}</test>
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
      options: [
        {
          templateReferences: "explicit",
        },
      ],
    },
    {
      // Implicit template references.
      code: `
        <test *ngIf="this.foo as bar; then thenBlock else elseBlock">{{bar}}</test>
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
    },
    {
      // Other options shouldn't affect result.
      code: `
        <test *ngIf="foo as bar; then thenBlock else elseBlock">{{this.bar}}</test>
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
      options: [
        {
          properties: "implicit",
          variables: "explicit",
        },
      ],
    },

    /**
     * NgForOf directive `*ngFor` with exported values and trackBy option.
     */
    {
      // Explicit.
      code: `
        <li *ngFor="let item of this.items; index as i; trackBy: this.trackByFn">
          <test>{{this.i}} {{this.item}}</test>
        </li>`,
      options: [
        {
          properties: "explicit",
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },
    {
      // Implicit.
      code: `
        <li *ngFor="let item of items; index as i; trackBy: trackByFn">
          <test>{{i}} {{item}}</test>
        </li>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
    },

    /**
     * NgForOf directive `[ngForOf]` with exported values and trackBy option.
     */
    {
      // Explicit.
      code: `
        <ng-template ngFor let-item [ngForOf]="this.items" let-i="index" [ngForTrackBy]="this.trackByFn">
          <li>
            <test>{{this.i}} {{this.item}}</test>
          </li>
        </ng-template>`,
      options: [
        {
          properties: "explicit",
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },
    {
      // Implicit.
      code: `
        <ng-template ngFor let-item [ngForOf]="items" let-i="index" [ngForTrackBy]="trackByFn">
          <li>
            <test>{{i}} {{item}}</test>
          </li>
        </ng-template>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
    },

    /**
     * NgTemplateOutlet directive `*ngTemplateOutlet` with context and
     * templates that are defined *after* property reading.
     */
    // TODO: template before property reading.
    {
      /* See https://angular.io/api/common/NgTemplateOutlet#example
        ```
        export class NgTemplateOutletExample {
          public myContext = { $implicit: 'contactpersoon', firstName: 'Jeroen' };
        }
        ```
      */
      code: `
        <ng-container *ngTemplateOutlet="greetings; context: this.myContext"></ng-container>
        <ng-template #greetings let-person="firstName"><span>Beste {{person}}</span></ng-template>`,
    },
    {
      // Explicit.
      code: `
        <ng-container *ngTemplateOutlet="this.greetings; context: this.myContext"></ng-container>
        <ng-template #greetings let-person="firstName"><span>Beste {{this.person}}</span></ng-template>`,
      options: [
        {
          properties: "explicit",
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },
    {
      // Implicit.
      code: `
        <ng-container *ngTemplateOutlet="greetings; context: myContext"></ng-container>
        <ng-template #greetings let-person="firstName"><span>Beste {{person}}</span></ng-template>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
    },

    /**
     * EventEmitter $event.
     */
    {
      code: `<test (bar)="this.foo($event)"></test>`,
    },
  ],

  invalid: [
    /**
     * Databinding.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with databinding implicit property where it should be an explicit property",
      annotatedSource: `\
        <test [bar]="foo">{{this.bar}}</test>
                     ~~~`,
      messageId: MESSAGE_IDS.properties.explicit,
      annotatedOutput: `\
        <test [bar]="this.foo">{{this.bar}}</test>
                     ~~~`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with databinding explicit property where it should be an implicit property",
      annotatedSource: `\
        <test [bar]="this.foo">{{bar}}</test>
                     ~~~~~~~~`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      annotatedOutput: `\
        <test [bar]="foo">{{bar}}</test>
                     ~~~~~~~~`,
    }),

    /**
     * Interpolation.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with interpolation implicit property where it should be an explicit property",
      annotatedSource: `\
        <test bar="{{foo}}">{{this.bar}}</test>
                     ~~~`,
      messageId: MESSAGE_IDS.properties.explicit,
      annotatedOutput: `\
        <test bar="{{this.foo}}">{{this.bar}}</test>
                     ~~~`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with interpolation explicit property where it should be an implicit property",
      annotatedSource: `\
        <test bar="{{this.foo}}">{{bar}}</test>
                     ~~~~~~~~`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      annotatedOutput: `\
        <test bar="{{foo}}">{{bar}}</test>
                     ~~~~~~~~`,
    }),

    /**
     * Interpolation, with extra whitespaces and tabs.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with implicit property where it should be an explicit property, no matter of whitespaces and tabs",
      annotatedSource: `\
        <test bar="{{  foo  }}">{{		bar		}}</test>
                       ~~~        		^^^`,
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.explicit,
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.explicit,
        },
      ],
      annotatedOutput: `\
        <test bar="{{  this.foo  }}">{{		this.bar		}}</test>
                       ~~~        		^^^`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with explicit property where it should be an implicit property, no matter of whitespaces and tabs",
      annotatedSource: `\
        <test bar="{{  this.foo  }}">{{		this.bar		}}</test>
                       ~~~~~~~~        		^^^^^^^^`,
      options: [{ properties: "implicit" }],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.implicit,
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.implicit,
        },
      ],
      annotatedOutput: `\
        <test bar="{{  foo  }}">{{		bar		}}</test>
                       ~~~~~~~~        		^^^^^^^^`,
    }),

    /**
     * Interpolation, with line-breaks.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with implicit property where it should be an explicit property, no matter of line-breaks",
      annotatedSource: `
        test {{
          pagination
          ~~~~~~~~~~
        }}`,
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.explicit,
        },
      ],
      annotatedOutput: `
        test {{
          this.pagination
          ~~~~~~~~~~
        }}`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with explicit property where it should be an implicit property, no matter of line-breaks",
      annotatedSource: `
test {{
  this.pagination
  ~~~~~~~~~~~~~~~
}}
      `,
      options: [{ properties: "implicit" }],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.implicit,
        },
      ],
      annotatedOutput: `
test {{
  pagination
  ~~~~~~~~~~~~~~~
}}
      `,
    }),

    /**
     * Databinding & interpolation with sub-properties.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with implicit property where it should be an explicit property, ignoring sub-properties",
      annotatedSource: `\
        <test2 bar="{{ foo.bar.baz }}">{{ this.foo.bar.baz }}</test2>
                       ~~~`,
      messageId: MESSAGE_IDS.properties.explicit,
      annotatedOutput: `\
        <test2 bar="{{ this.foo.bar.baz }}">{{ this.foo.bar.baz }}</test2>
                       ~~~`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with explicit property where it should be an implicit property, ignoring sub-properties",
      annotatedSource: `\
        <test3 bar="{{ this.foo.bar.baz }}">{{ foo.bar.baz }}</test3>
                       ~~~~~~~~`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      annotatedOutput: `\
        <test3 bar="{{ foo.bar.baz }}">{{ foo.bar.baz }}</test3>
                       ~~~~~~~~`,
    }),

    /**
     * NgIf directive `*ngIf` with "as variable" and then & else
     * references to templates that are defined *after* property reading.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with implicit properties & variables & template references where it should be explicit properties & variables & template references inside NgIf directive",
      annotatedSource: `
        <test4 *ngIf="foo as bar; then thenBlock else elseBlock">{{bar}}</test4>
                      ~~~              ^^^^^^^^^      @@@@@@@@@    !!!
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
      options: [
        {
          properties: "explicit",
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.explicit,
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.templateReferences.explicit,
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.templateReferences.explicit,
        },
        {
          char: "!",
          messageId: MESSAGE_IDS.variables.explicit,
        },
      ],
      annotatedOutput: `
        <test4 *ngIf="this.foo as bar; then this.thenBlock else this.elseBlock">{{this.bar}}</test4>
                      ~~~              ^^^^^^^^^      @@@@@@@@@    !!!
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with explicit properties & variables & template references where it should be implicit properties & variables & template references inside NgIf directive",
      annotatedSource: `
        <test *ngIf="this.foo as bar; then this.thenBlock else this.elseBlock">{{this.bar}}</test>
                     ~~~~~~~~              ^^^^^^^^^^^^^^      @@@@@@@@@@@@@@    !!!!!!!!
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.implicit,
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.templateReferences.implicit,
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.templateReferences.implicit,
        },
        {
          char: "!",
          messageId: MESSAGE_IDS.variables.implicit,
        },
      ],
      annotatedOutput: `
        <test *ngIf="foo as bar; then thenBlock else elseBlock">{{bar}}</test>
                     ~~~~~~~~              ^^^^^^^^^^^^^^      @@@@@@@@@@@@@@    !!!!!!!!
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
    }),

    /**
     * NgForOf directive `*ngFor` with exported values and trackBy option.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with implicit properties & variables where it should be explicit properties & variables inside NgFor directive",
      annotatedSource: `
        <li *ngFor="let item of items; index as i; trackBy: trackByFn">
                                ~~~~~                       ^^^^^^^^^
          <test>{{i}} {{item}}</test>
                  @     !!!!
        </li>`,
      options: [
        {
          properties: "explicit",
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.explicit,
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.explicit,
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.variables.explicit,
        },
        {
          char: "!",
          messageId: MESSAGE_IDS.variables.explicit,
        },
      ],
      annotatedOutput: `
        <li *ngFor="let item of this.items; index as i; trackBy: this.trackByFn">
                                ~~~~~                       ^^^^^^^^^
          <test>{{this.i}} {{this.item}}</test>
                  @     !!!!
        </li>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "it fails with implicit properties & variables where it should be explicit properties & variables inside NgFor directive",
      annotatedSource: `
        <li *ngFor="let item of this.items; index as i; trackBy: this.trackByFn">
                                ~~~~~~~~~~                       ^^^^^^^^^^^^^^
          <test>{{this.i}} {{this.item}}</test>
                  @@@@@@     !!!!!!!!!
        </li>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.implicit,
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.implicit,
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.variables.implicit,
        },
        {
          char: "!",
          messageId: MESSAGE_IDS.variables.implicit,
        },
      ],
      annotatedOutput: `
        <li *ngFor="let item of items; index as i; trackBy: trackByFn">
                                ~~~~~~~~~~                       ^^^^^^^^^^^^^^
          <test>{{i}} {{item}}</test>
                  @@@@@@     !!!!!!!!!
        </li>`,
    }),
  ],
});
