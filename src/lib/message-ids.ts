import type { MessageIdKeys } from "./types";

/**
 * List of message identifiers.
 */
export const MESSAGE_IDS: MessageIdKeys = {
  properties: {
    explicit: "explicitThisProperties",
    implicit: "implicitThisProperties",
  },
  variables: {
    explicit: "explicitThisVariables",
    implicit: "implicitThisVariables",
  },
  templateReferences: {
    explicit: "explicitThisTemplateReferences",
    implicit: "implicitThisTemplateReferences",
  },
};
