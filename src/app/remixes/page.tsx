// app/remixes/page.tsx
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import PostsFeed from "@/components/PostsFeed";

export default async function RemixesPage() {
  const { user } = await validateRequest();
  
  if (!user) {
    return <div>Please sign in to view remixes</div>;
  }

  const remixes = await prisma.post.findMany({
    where: {
      isRemix: true,
      OR: [
        { authorId: user.id }, // User's remixes
        { originalPost: { authorId: user.id } } // Remixes of user's posts
      ]
    },
    include: getPostDataInclude(user.id),
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Remixes</h1>
      <PostsFeed initialPosts={remixes} />
    </div>
  );
}