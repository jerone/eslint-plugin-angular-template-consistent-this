// https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/src/rules/no-call-expression.ts

/**
 * FROM CODELYZER
 */
const escapeRegexp = (value) => value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
/**
 * FROM CODELYZER
 *
 * When testing a failure, we also test to see if the linter will report the correct place where
 * the source code doesn't match the rule.
 *
 * For example, if you use a private property in your template, the linter should report _where_
 * did it happen. Because it's tedious to supply actual line/column number in the spec, we use
 * some custom syntax with "underlining" the problematic part with tildes:
 *
 * ```
 * template: '{{ foo }}'
 *               ~~~
 * ```
 *
 * When giving a spec which we expect to fail, we give it "source code" such as above, with tildes.
 * We call this kind of source code "annotated". This source code cannot be compiled (and thus
 * cannot be linted/tested), so we use this function to get rid of tildes, but maintain the
 * information about where the linter is supposed to catch error.
 *
 * The result of the function contains "cleaned" source (`.source`) and a `.failure` object which
 * contains the `.startPosition` and `.endPosition` of the tildes.
 *
 * @param source The annotated source code with tildes.
 * @param message Passed to the result's `.failure.message` property.
 * @param specialChar The character to look for; in the above example that's ~.
 * @param otherChars All other characters which should be ignored. Used when asserting multiple
 *                   failures where there are multiple invalid characters.
 * @returns {{source: string, failure: {message: string, startPosition: null, endPosition: any}}}
 */
const parseInvalidSource = (
  source,
  message,
  specialChar = "~",
  otherChars = []
) => {
  let replacedSource;
  if (otherChars.length === 0) {
    replacedSource = source;
  } else {
    const patternAsStr = `[${otherChars.map(escapeRegexp).join("")}]`;
    const pattern = new RegExp(patternAsStr, "g");
    replacedSource = source.replace(pattern, " ");
  }
  let col = 0;
  let line = 0;
  let lastCol = 0;
  let lastLine = 0;
  let startPosition;
  for (const currentChar of replacedSource) {
    if (currentChar === "\n") {
      col = 0;
      line++;
      continue;
    }
    col++;
    if (currentChar !== specialChar) continue;
    if (!startPosition) {
      startPosition = {
        character: col - 1,
        line: line - 1,
      };
    }
    lastCol = col;
    lastLine = line - 1;
  }
  const endPosition = {
    character: lastCol,
    line: lastLine,
  };
  if (specialChar)
    replacedSource = replacedSource.replace(
      new RegExp(escapeRegexp(specialChar), "g"),
      " "
    );
  return {
    failure: {
      endPosition,
      message,
      startPosition: startPosition,
    },
    source: replacedSource,
  };
};

function convertAnnotatedSourceToFailureCase({
  // eslint-disable-next-line no-unused-vars
  description: _,
  annotatedSource,
  messageId,
  messages = [],
  data,
  options = [],
  annotatedOutput,
}) {
  if (!messageId && (!messages || !messages.length)) {
    throw new Error(
      "Either `messageId` or `messages` is required when configuring a failure case"
    );
  }
  if (messageId) {
    messages = [
      {
        char: "~",
        messageId,
      },
    ];
  }
  let parsedSource = "";
  const otherChars = messages.map(({ char }) => char);
  const errors = messages.map(({ char: currentValueChar, messageId }) => {
    const parsedForChar = parseInvalidSource(
      annotatedSource,
      "",
      currentValueChar,
      otherChars.filter((char) => char !== currentValueChar)
    );

    const endPosition = parsedForChar.failure.endPosition,
      startPosition = parsedForChar.failure.startPosition;
    parsedSource = parsedForChar.source;

    if (!endPosition || !startPosition) {
      throw Error(
        `Char '${currentValueChar}' has been specified in \`messages\`, however it is not present in the source of the failure case`
      );
    }

    const error = {
      messageId,
      line: startPosition.line + 1,
      column: startPosition.character + 1,
      endLine: endPosition.line + 1,
      endColumn: endPosition.character + 1,
    };
    if (data) {
      // TODO: Make .data writable in @typescript-eslint/experimental-utils types
      error.data = data;
    }
    return error;
  });
  const invalidTestCase = {
    code: parsedSource,
    options,
    errors,
  };
  if (annotatedOutput) {
    // TODO: Make .output writable in @typescript-eslint/experimental-utils types
    invalidTestCase.output = parseInvalidSource(
      annotatedOutput,
      "",
      otherChars.join(""),
      otherChars
    ).source;
  }
  return invalidTestCase;
}

module.exports = {
  parseInvalidSource,
  convertAnnotatedSourceToFailureCase,
};
