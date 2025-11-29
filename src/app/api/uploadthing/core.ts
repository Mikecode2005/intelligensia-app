// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const f = createUploadthing();

export const ourFileRouter = {
  postAttachment: f({
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 5 
    },
    video: { 
      maxFileSize: "16MB", 
      maxFileCount: 1 
    }
  })
    .middleware(async ({ req }) => {
      console.log("🔄 UploadThing middleware running");
      
      const session = await getServerSession(authOptions);
      console.log("🔐 Session in middleware:", session ? "Authenticated" : "No session");

      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      return { 
        userId: session.user.id 
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete callback triggered!");
      console.log("📁 File data:", {
        name: file.name,
        url: file.url,
        key: file.key,
        size: file.size,
        type: file.type
      });
      console.log("👤 User ID:", metadata.userId);

      // Return the data that should be sent to the client
      return {
        name: file.name,
        url: file.url,
        size: file.size,
        type: file.type,
        key: file.key,
        uploadedBy: metadata.userId
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;