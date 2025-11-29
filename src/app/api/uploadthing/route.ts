// app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // Correct case: ourFileRouter not ourfileRouter

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter, // Correct case
});