import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { contactType } from "./contactType";
import { informationType } from "./informationType";
import { postType } from "./postType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, postType, contactType, informationType],
};
