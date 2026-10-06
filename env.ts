// env.ts
import { defineConfig } from "@julr/vite-plugin-validate-env";
import { z } from "zod";

export const schema = {
  VITE_APP_URL: z
    .string()
    .url("Invalid URL format!")
    .transform((value) => {
      // if ends with / remove it
      if (value.endsWith("/")) {
        return value.slice(0, -1);
      }
      return value;
    }), // You can also add transformations
  // Google Places autocomplete for address fields
  VITE_GOOGLE_MAPS_API_KEY: z.string().optional(),
};

export default defineConfig({
  validator: "standard",
  schema: schema,
});
