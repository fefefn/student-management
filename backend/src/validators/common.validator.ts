import { z } from "zod";
import { OBJECT_ID_REGEX } from "../utils/helpers";

export const objectIdSchema = z.string().regex(OBJECT_ID_REGEX, "Invalid ID format");

export const idParamSchema = z.object({
  id: objectIdSchema,
});
