import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { safePartialUpdateUser } from "@/lib/stream-utils";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
  .middleware(async () => {
    const { user } = await validateRequest();
    if (!user) throw new UploadThingError("Unauthorized");
    return { user };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    const oldAvatarUrl = metadata.user.avatarUrl;

    // Delete old avatar if exists
    if (oldAvatarUrl) {
      try {
        const key = oldAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1];
        if (key) {
          await new UTApi().deleteFiles(key);
        }
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    const newAvatarUrl = file.url.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`);

    // Update database
    await prisma.user.update({
      where: { id: metadata.user.id },
      data: { avatarUrl: newAvatarUrl },
    });

    // Update Stream Chat safely
    await safePartialUpdateUser(metadata.user.id, {
      image: newAvatarUrl,
    });

    return { avatarUrl: newAvatarUrl };
  }),
  
  // ... rest of your file router
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;