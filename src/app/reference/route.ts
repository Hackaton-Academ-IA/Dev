import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  // @ts-ignore - If the types are broken but the code works
  spec: {
    url: "/openapi.json",
  },
});
