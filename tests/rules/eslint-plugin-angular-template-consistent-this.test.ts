import { RuleTester } from "../rule-tester";
import { MESSAGE_IDS } from "../../src/lib/message-ids";
import { RULE_NAME } from "../../src/lib/rules/eslint-plugin-angular-template-consistent-this";
import { convertAnnotatedSourceToFailureCase } from "../external/test-helpers";
// import { convertAnnotatedSourceToFailureCase } from "@angular-eslint/utils";
import { rules } from "../../src/index";

// eslint-disable-next-line security/detect-object-injection
const rule = rules[RULE_NAME];

const ruleTester = new RuleTester({
  parser: "@angular-eslint/template-parser",
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    /**
     * Only properties should be prefixed, not values.
     * Just an sanity check.
     */
    {
      // Explicit.
      name: "Only properties should be prefixed, not values. Explicit.",
      code: `<test [bar]="123" [foo]="true">{{'test'}}</test>`,
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
      name: "Only properties should be prefixed, not values. Implicit.",
      code: `<test [bar]="123" [foo]="true">{{'test'}}</test>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
    },

    /**
     * Data-binding.
     */
    {
      // Explicit.
      name: "Data-binding. Explicit.",
      code: `<test [bar]="this.foo">{{this.bar}}</test>`,
    },
    {
      // Implicit.
      name: "Data-binding. Implicit.",
      code: `<test [bar]="foo">{{bar}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Data-binding. Other options shouldn't affect result.",
      code: `<test [bar]="this.foo">{{this.bar}}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * Data-binding, with extra whitespaces and tabs.
     */
    {
      // Explicit.
      name: "Data-binding, with extra whitespaces and tabs. Explicit.",
      code: `<test [bar]="  this.foo  ">{{		this.bar		}}</test>`,
    },
    {
      // Implicit.
      name: "Data-binding, with extra whitespaces and tabs. Implicit.",
      code: `<test [bar]="  foo  ">{{		bar		}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Data-binding, with extra whitespaces and tabs. Other options shouldn't affect result.",
      code: `<test [bar]="  this.foo  ">{{		this.bar		}}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * Data-binding, with line-breaks.
     */
    {
      // Explicit.
      name: "Data-binding, with line-breaks. Explicit.",
      code: `<test [bar]="
  this.foo
">{{
  this.bar
}}</test>`,
    },
    {
      // Implicit.
      name: "Data-binding, with line-breaks. Implicit.",
      code: `<test [bar]="
  foo
">{{
  bar
}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Data-binding, with line-breaks. Other options shouldn't affect result.",
      code: `<test [bar]="
  this.foo
">{{
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
     * Interpolation.
     */
    {
      // Explicit.
      name: "Interpolation. Explicit.",
      code: `<test bar="{{this.foo}}">{{this.bar}}</test>`,
    },
    {
      // Implicit.
      name: "Interpolation. Implicit.",
      code: `<test bar="{{foo}}">{{bar}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Interpolation. Other options shouldn't affect result.",
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
      name: "Interpolation, with extra whitespaces and tabs. Explicit.",
      code: `<test bar="{{  this.foo  }}">{{		this.bar		}}</test>`,
    },
    {
      // Implicit.
      name: "Interpolation, with extra whitespaces and tabs. Implicit.",
      code: `<test bar="{{  foo  }}">{{		bar		}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Interpolation, with extra whitespaces and tabs. Other options shouldn't affect result.",
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
      name: "Interpolation, with line-breaks. Explicit.",
      code: `<test bar="{{
        this.foo
      }}">{{
        this.bar
      }}</test>`,
    },
    {
      // Implicit.
      name: "Interpolation, with line-breaks. Implicit.",
      code: `<test bar="{{
        foo
      }}">{{
        bar
      }}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Interpolation, with line-breaks. Other options shouldn't affect result.",
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
     * Interpolation, with pipes.
     */
    {
      // Explicit.
      name: "Interpolation, with pipes. Explicit.",
      code: `<test bar="{{this.foo | json}}">{{this.bar | json}}</test>`,
    },
    {
      // Implicit.
      name: "Interpolation, with pipes. Implicit.",
      code: `<test bar="{{foo | json}}">{{bar | json}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Interpolation, with pipes. Other options shouldn't affect result.",
      code: `<test bar="{{this.foo | json}}">{{this.bar | json}}</test>`,
      options: [
        {
          variables: "explicit",
          templateReferences: "explicit",
        },
      ],
    },

    /**
     * Data-binding & interpolation with sub-properties.
     */
    {
      // Explicit.
      name: "Data-binding & interpolation with sub-properties. Explicit.",
      code: `<test [bar]="this.foo.bar.baz">{{this.foo.bar.baz}}</test>`,
    },
    {
      // Implicit.
      name: "Data-binding & interpolation with sub-properties. Implicit.",
      code: `<test [bar]="foo.bar.baz">{{foo.bar.baz}}</test>`,
      options: [{ properties: "implicit" }],
    },
    {
      // Other options shouldn't affect result.
      name: "Data-binding & interpolation with sub-properties. Other options shouldn't affect result.",
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
      name: "NgIf directive `*ngIf`. Explicit property.",
      code: `<test *ngIf="this.foo"><item>{{this.foo}}</item></test>`,
    },
    {
      // Implicit property.
      name: "NgIf directive `*ngIf`. Implicit property.",
      code: `<test *ngIf="foo"><item>{{foo}}</item></test>`,
      options: [
        {
          properties: "implicit",
        },
      ],
    },
    {
      // Other options shouldn't affect result.
      name: "NgIf directive `*ngIf`. Other options shouldn't affect result.",
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
      name: "NgIf directive `[ngIf]`. Explicit property.",
      code: `<test [ngIf]="this.foo"><item>{{this.foo}}</item></test>`,
    },
    {
      // Implicit property.
      name: "NgIf directive `[ngIf]`. Implicit property.",
      code: `<test [ngIf]="foo"><item>{{foo}}</item></test>`,
      options: [
        {
          properties: "implicit",
        },
      ],
    },
    {
      // Other options shouldn't affect result.
      name: "NgIf directive `[ngIf]`. Other options shouldn't affect result.",
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
      name: 'NgIf directive `*ngIf` with "as variable". Explicit variable.',
      code: `<test *ngIf="this.foo as bar;"><item>{{this.foo}} {{this.bar}}</item></test>`,
      options: [
        {
          variables: "explicit",
        },
      ],
    },
    {
      // Implicit variable.
      name: 'NgIf directive `*ngIf` with "as variable". Implicit variable.',
      code: `<test *ngIf="this.foo as bar;"><item>{{this.foo}} {{bar}}</item></test>`,
    },
    {
      // Other options shouldn't affect result.
      name: 'NgIf directive `*ngIf` with "as variable". Other options shouldn\'t affect result.',
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
      name: 'NgIf directive `*ngIf` with "let variable". Explicit variable.',
      code: `<test *ngIf="this.foo; let bar;"><item>{{this.foo}} {{this.bar}}</item></test>`,
      options: [
        {
          variables: "explicit",
        },
      ],
    },
    {
      // Implicit variable.
      name: 'NgIf directive `*ngIf` with "let variable". Implicit variable.',
      code: `<test *ngIf="this.foo; let bar;"><item>{{this.foo}} {{bar}}</item></test>`,
    },
    {
      // Other options shouldn't affect result.
      name: 'NgIf directive `*ngIf` with "let variable". Other options shouldn\'t affect result.',
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
      name: "NgIf directive `*ngIf` with then & else references to templates that are defined *after* property reading. Explicit template references.",
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
      name: "NgIf directive `*ngIf` with then & else references to templates that are defined *after* property reading. Implicit template references.",
      code: `
        <test *ngIf="this.foo as bar; then thenBlock else elseBlock">{{bar}}</test>
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
    },
    {
      // Other options shouldn't affect result.
      name: "NgIf directive `*ngIf` with then & else references to templates that are defined *after* property reading. Other options shouldn't affect result.",
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
      name: "NgForOf directive `*ngFor` with exported values and trackBy option. Explicit.",
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
      name: "NgForOf directive `*ngFor` with exported values and trackBy option. Implicit.",
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
      name: "NgForOf directive `[ngForOf]` with exported values and trackBy option. Explicit.",
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
      name: "NgForOf directive `[ngForOf]` with exported values and trackBy option. Implicit.",
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
     *
     * See https://angular.io/api/common/NgTemplateOutlet#example
     *  ```
     *  export class NgTemplateOutletExample {
     *    public myContext = { $implicit: 'customer', firstName: 'Jeroen' };
     *  }
     *  ```
     */
    {
      // Default options.
      name: "NgTemplateOutlet directive `*ngTemplateOutlet` with context and templates that are defined *after* property reading. Default options.",
      code: `
        <ng-container *ngTemplateOutlet="greetings; context: this.myContext"></ng-container>
        <ng-template #greetings let-person="firstName"><span>Dear {{person}}</span></ng-template>`,
    },
    {
      // Explicit.
      name: "NgTemplateOutlet directive `*ngTemplateOutlet` with context and templates that are defined *after* property reading. Explicit.",
      code: `
        <ng-container *ngTemplateOutlet="this.greetings; context: this.myContext"></ng-container>
        <ng-template #greetings let-person="firstName"><span>Dear {{this.person}}</span></ng-template>`,
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
      name: "NgTemplateOutlet directive `*ngTemplateOutlet` with context and templates that are defined *after* property reading. Implicit.",
      code: `
        <ng-container *ngTemplateOutlet="greetings; context: myContext"></ng-container>
        <ng-template #greetings let-person="firstName"><span>Dear {{person}}</span></ng-template>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
    },

    /**
     * Template *reference* variable (`#template`) accessed via data-binding.
     */
    {
      // Default options.
      name: "Template *reference* variable (`#template`) accessed via data-binding. Default options.",
      code: `
        <test-elm-with-id #test_identifier>
          <test-elm-child [prop]="test_identifier.property"></test-elm-child>
        </test-elm-with-id>`,
    },
    {
      // Explicit.
      name: "Template *reference* variable (`#template`) accessed via data-binding. Explicit.",
      code: `
        <test-elm-with-id #test_identifier>
          <test-elm-child [prop]="this.test_identifier.property"></test-elm-child>
        </test-elm-with-id>`,
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
      name: "Template *reference* variable (`#template`) accessed via data-binding. Implicit.",
      code: `
        <test-elm-with-id #test_identifier>
          <test-elm-child [prop]="test_identifier.property"></test-elm-child>
        </test-elm-with-id>`,
      options: [
        {
          properties: "implicit",
          variables: "implicit",
          templateReferences: "implicit",
        },
      ],
    },

    /**
     * Template *reference* variable (`#template`) accessed via interpolation.
     */
    {
      // Default options.
      name: "Template *reference* variable (`#template`) accessed via interpolation. Default options.",
      code: `
        <test-elm-with-id #test_identifier>
          {{ test_identifier.property }}
        </test-elm-with-id>`,
    },
    {
      // Explicit.
      name: "Template *reference* variable (`#template`) accessed via interpolation. Explicit.",
      code: `
        <test-elm-with-id #test_identifier>
          {{ this.test_identifier.property }}
        </test-elm-with-id>`,
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
      name: "Template *reference* variable (`#template`) accessed via interpolation. Implicit.",
      code: `
        <test-elm-with-id #test_identifier>
          {{ test_identifier.property }}
        </test-elm-with-id>`,
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
      // Default options.
      name: "EventEmitter $event.",
      code: `<test (bar)="this.foo($event)"></test>`,
    },
  ],

  invalid: [
    /**
     * Data-binding.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding implicit property where it should be an explicit property.",
      annotatedSource: `\
        <test [bar]="foo">{{this.bar}}</test>
                     ~~~`,
      messageId: MESSAGE_IDS.properties.explicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test [bar]="this.foo">{{this.bar}}</test>
                     ~~~`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding explicit property where it should be an implicit property.",
      annotatedSource: `\
        <test [bar]="this.foo">{{bar}}</test>
                     ~~~~~~~~`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test [bar]="foo">{{bar}}</test>
                     ~~~~~~~~`,
    }),

    /**
     * Data-binding, with extra whitespaces and tabs.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding implicit property where it should be an explicit property, no matter of whitespaces and tabs.",
      annotatedSource: `\
        <test [bar]="  		foo  		">{{this.bar}}</test>
                       		~~~`,
      messageId: MESSAGE_IDS.properties.explicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test [bar]="  		this.foo  		">{{this.bar}}</test>
                       		~~~`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding explicit property where it should be an implicit property, no matter of whitespaces and tabs.",
      annotatedSource: `\
        <test [bar]="  		this.foo  		">{{bar}}</test>
                       		~~~~~~~~`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test [bar]="  		foo  		">{{bar}}</test>
                       		~~~~~~~~`,
    }),

    /**
     * Data-binding, with line-breaks.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding implicit property where it should be an explicit property, no matter of line-breaks.",
      annotatedSource: `\
        <test [bar]="
          
          foo
          ~~~
        ">{{this.bar}}</test>`,
      messageId: MESSAGE_IDS.properties.explicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test [bar]="
          
          this.foo
          ~~~
        ">{{this.bar}}</test>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding explicit property where it should be an implicit property, no matter of line-breaks.",
      annotatedSource: `\
        <test [bar]="
          
          this.foo
          ~~~~~~~~
        ">{{bar}}</test>`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test [bar]="
          
          foo
          ~~~~~~~~
        ">{{bar}}</test>`,
    }),

    /**
     * Interpolation.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation implicit property where it should be an explicit property.",
      annotatedSource: `\
        <test bar="{{foo}}">{{this.bar}}</test>
                     ~~~`,
      messageId: MESSAGE_IDS.properties.explicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test bar="{{this.foo}}">{{this.bar}}</test>
                     ~~~`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation explicit property where it should be an implicit property.",
      annotatedSource: `\
        <test bar="{{this.foo}}">{{bar}}</test>
                     ~~~~~~~~`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test bar="{{foo}}">{{bar}}</test>
                     ~~~~~~~~`,
    }),

    /**
     * Interpolation, with extra whitespaces and tabs.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation implicit property where it should be an explicit property, no matter of whitespaces and tabs.",
      annotatedSource: `\
        <test bar="{{  foo  }}">{{		bar		}}</test>
                       ~~~        		^^^.`,
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.explicit,
          data: { prop: "foo" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.explicit,
          data: { prop: "bar" },
        },
      ],
      annotatedOutput: `\
        <test bar="{{  this.foo  }}">{{		this.bar		}}</test>
                                  		.`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation explicit property where it should be an implicit property, no matter of whitespaces and tabs.",
      annotatedSource: `\
        <test bar="{{  this.foo  }}">{{		this.bar		}}</test>
                       ~~~~~~~~        		^^^^^^^^.`,
      options: [{ properties: "implicit" }],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.implicit,
          data: { prop: "foo" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.implicit,
          data: { prop: "bar" },
        },
      ],
      annotatedOutput: `\
        <test bar="{{  foo  }}">{{		bar		}}</test>
                                       		.`,
    }),

    /**
     * Interpolation, with line-breaks.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation implicit property where it should be an explicit property, no matter of line-breaks.",
      annotatedSource: `
        test {{
          pagination
          ~~~~~~~~~~
        }}`,
      messageId: MESSAGE_IDS.properties.explicit,
      data: { prop: "pagination" },
      annotatedOutput: `
        test {{
          this.pagination
          ~~~~~~~~~~
        }}`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation explicit property where it should be an implicit property, no matter of line-breaks.",
      annotatedSource: `
test {{
  this.pagination
  ~~~~~~~~~~~~~~~
}}
      `,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      data: { prop: "pagination" },
      annotatedOutput: `
test {{
  pagination
  ~~~~~~~~~~~~~~~
}}
      `,
    }),

    /**
     * Interpolation, with pipes.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation implicit property where it should be an explicit property, with pipes.",
      annotatedSource: `\
        <test bar="{{foo | json}}">{{this.bar | json}}</test>
                     ~~~`,
      messageId: MESSAGE_IDS.properties.explicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test bar="{{this.foo | json}}">{{this.bar | json}}</test>
                     ~~~`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation explicit property where it should be an implicit property, with pipes.",
      annotatedSource: `\
        <test bar="{{this.foo | json}}">{{bar | json}}</test>
                     ~~~~~~~~`,
      options: [{ properties: "implicit" }],
      messageId: MESSAGE_IDS.properties.implicit,
      data: { prop: "foo" },
      annotatedOutput: `\
        <test bar="{{foo | json}}">{{bar | json}}</test>
                     ~~~~~~~~`,
    }),

    /**
     * Data-binding & interpolation with sub-properties.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding & interpolation implicit property where it should be an explicit property, ignoring sub-properties.",
      annotatedSource: `\
        <test2 [bar]="foo.bar.baz">{{ foo.bar.baz }}</test2>
                      ~~~             ^^^.`,
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.explicit,
          data: { prop: "foo" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.explicit,
          data: { prop: "foo" },
        },
      ],
      annotatedOutput: `\
        <test2 [bar]="this.foo.bar.baz">{{ this.foo.bar.baz }}</test2>
                                      .`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding & interpolation explicit property where it should be an implicit property, ignoring sub-properties.",
      annotatedSource: `\
        <test3 [bar]="this.foo.bar.baz">{{ this.foo.bar.baz }}</test3>
                      ~~~~~~~~             ^^^^^^^^.`,
      options: [{ properties: "implicit" }],
      messages: [
        {
          char: "~",
          messageId: MESSAGE_IDS.properties.implicit,
          data: { prop: "foo" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.implicit,
          data: { prop: "foo" },
        },
      ],
      annotatedOutput: `\
        <test3 [bar]="foo.bar.baz">{{ foo.bar.baz }}</test3>
                                           .`,
    }),

    /**
     * Template *reference* variable (`#template`) accessed via data-binding.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding implicit template reference variable via data-binding where it should be explicit.",
      annotatedSource: `\
        <test-elm-with-id #test_identifier>
          <test-elm-child [prop]="test_identifier.property"></test-elm-child>
                                  ~~~~~~~~~~~~~~~
        </test-elm-with-id>`,
      options: [{ templateReferences: "explicit" }],
      messageId: MESSAGE_IDS.templateReferences.explicit,
      data: { prop: "test_identifier" },
      annotatedOutput: `\
        <test-elm-with-id #test_identifier>
          <test-elm-child [prop]="this.test_identifier.property"></test-elm-child>
                                  
        </test-elm-with-id>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding explicit template reference variable via data-binding where it should be implicit.",
      annotatedSource: `\
        <test-elm-with-id #test_identifier>
          <test-elm-child [prop]="this.test_identifier.property"></test-elm-child>
                                  ~~~~~~~~~~~~~~~~~~~~
        </test-elm-with-id>`,
      options: [{ templateReferences: "implicit" }],
      messageId: MESSAGE_IDS.templateReferences.implicit,
      data: { prop: "test_identifier" },
      annotatedOutput: `\
        <test-elm-with-id #test_identifier>
          <test-elm-child [prop]="test_identifier.property"></test-elm-child>
                                  
        </test-elm-with-id>`,
    }),

    /**
     * Template *reference* variable (`#template`) accessed via interpolation.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation implicit template reference variable via interpolation where it should be explicit.",
      annotatedSource: `\
        <test-elm-with-id #test_identifier>
          {{ test_identifier.property }}
             ~~~~~~~~~~~~~~~
        </test-elm-with-id>`,
      options: [{ templateReferences: "explicit" }],
      messageId: MESSAGE_IDS.templateReferences.explicit,
      data: { prop: "test_identifier" },
      annotatedOutput: `\
        <test-elm-with-id #test_identifier>
          {{ this.test_identifier.property }}
             
        </test-elm-with-id>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with interpolation explicit template reference variable via interpolation where it should be implicit.",
      annotatedSource: `\
        <test-elm-with-id #test_identifier>
          {{ this.test_identifier.property }}
             ~~~~~~~~~~~~~~~~~~~~
        </test-elm-with-id>`,
      options: [{ templateReferences: "implicit" }],
      messageId: MESSAGE_IDS.templateReferences.implicit,
      data: { prop: "test_identifier" },
      annotatedOutput: `\
        <test-elm-with-id #test_identifier>
          {{ test_identifier.property }}
             
        </test-elm-with-id>`,
    }),

    /**
     * NgIf directive `*ngIf` with "as variable" and then & else
     * references to templates that are defined *after* property reading.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with implicit properties & variables & template references where it should be explicit properties & variables & template references inside NgIf directive.",
      annotatedSource: `
        <test4 *ngIf="foo as bar; then thenBlock else elseBlock">{{bar}}</test4>
                      ~~~              ^^^^^^^^^      @@@@@@@@@    %%%.
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
          data: { prop: "foo" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.templateReferences.explicit,
          data: { prop: "thenBlock" },
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.templateReferences.explicit,
          data: { prop: "elseBlock" },
        },
        {
          char: "%",
          messageId: MESSAGE_IDS.variables.explicit,
          data: { prop: "bar" },
        },
      ],
      annotatedOutput: `
        <test4 *ngIf="this.foo as bar; then this.thenBlock else this.elseBlock">{{this.bar}}</test4>
                                                                   .
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with explicit properties & variables & template references where it should be implicit properties & variables & template references inside NgIf directive.",
      annotatedSource: `
        <test *ngIf="this.foo as bar; then this.thenBlock else this.elseBlock">{{this.bar}}</test>
                     ~~~~~~~~              ^^^^^^^^^^^^^^      @@@@@@@@@@@@@@    %%%%%%%%.
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
          data: { prop: "foo" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.templateReferences.implicit,
          data: { prop: "thenBlock" },
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.templateReferences.implicit,
          data: { prop: "elseBlock" },
        },
        {
          char: "%",
          messageId: MESSAGE_IDS.variables.implicit,
          data: { prop: "bar" },
        },
      ],
      annotatedOutput: `
        <test *ngIf="foo as bar; then thenBlock else elseBlock">{{bar}}</test>
                                                                                 .
        <ng-template #thenBlock>...</ng-template>
        <ng-template #elseBlock>...</ng-template>`,
    }),

    /**
     * NgForOf directive `*ngFor` with exported values and trackBy option.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with implicit properties & variables where it should be explicit properties & variables inside NgFor directive.",
      annotatedSource: `
        <li *ngFor="let item of items; index as i; trackBy: trackByFn">
                                ~~~~~                       ^^^^^^^^^.
          <test>{{i}} {{item}}</test>
                  @     %%%%.
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
          data: { prop: "items" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.explicit,
          data: { prop: "trackByFn" },
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.variables.explicit,
          data: { prop: "i" },
        },
        {
          char: "%",
          messageId: MESSAGE_IDS.variables.explicit,
          data: { prop: "item" },
        },
      ],
      annotatedOutput: `
        <li *ngFor="let item of this.items; index as i; trackBy: this.trackByFn">
                                                                     .
          <test>{{this.i}} {{this.item}}</test>
                        .
        </li>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with explicit properties & variables where it should be implicit properties & variables inside NgFor directive.",
      annotatedSource: `
        <li *ngFor="let item of this.items; index as i; trackBy: this.trackByFn">
                                ~~~~~~~~~~                       ^^^^^^^^^^^^^^.
          <test-ng-for>{{this.i}} {{this.item}}</test-ng-for>
                         @@@@@@     %%%%%%%%%.
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
          data: { prop: "items" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.implicit,
          data: { prop: "trackByFn" },
        },
        {
          char: "@",
          messageId: MESSAGE_IDS.variables.implicit,
          data: { prop: "i" },
        },
        {
          char: "%",
          messageId: MESSAGE_IDS.variables.implicit,
          data: { prop: "item" },
        },
      ],
      annotatedOutput: `
        <li *ngFor="let item of items; index as i; trackBy: trackByFn">
                                                                               .
          <test-ng-for>{{i}} {{item}}</test-ng-for>
                                    .
        </li>`,
    }),

    /**
     * Data-binding, with weird indentation.
     */
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding implicit property where it should be an explicit property, with weird indentation.",
      annotatedSource: `\
					<test
						*ngIf="
								foo.bar.baz !== null &&
								~~~
											foo.bar.baz.length > 0
											^^^;
						">
						</test>`,
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
          data: { prop: "foo" },
        },
        {
          char: "^",
          messageId: MESSAGE_IDS.properties.explicit,
          data: { prop: "foo" },
        },
      ],
      annotatedOutput: `\
					<test
						*ngIf="
								this.foo.bar.baz !== null &&
								   
											this.foo.bar.baz.length > 0
											;
						">
						</test>`,
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "It fails with data-binding explicit property where it should be an implicit property, with weird indentation.",
      annotatedSource: `\
					<test
						*ngIf="
								foo2.bar2.baz2
								~~~~;
						">
						</test>`,
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
          data: { prop: "foo2" },
        },
      ],
      annotatedOutput: `\
					<test
						*ngIf="
								this.foo2.bar2.baz2
								;
						">
						</test>`,
    }),
  ],
});
