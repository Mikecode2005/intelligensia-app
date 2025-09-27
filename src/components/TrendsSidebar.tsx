import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<TrendsSkeleton />}>
        <WhoToFollow />
        <Topics />
      </Suspense>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <Loader2 className="mx-auto animate-spin" size={24} />
    </div>
  );
}

async function WhoToFollow() {
  try {
    const { user } = await validateRequest();

    if (!user) return null;

    const usersToFollow = await prisma.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
        followers: {
          none: {
            followerId: user.id,
          },
        },
      },
      select: getUserDataSelect(user.id),
      take: 5,
    });

    if (usersToFollow.length === 0) return null;

    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Who to follow</div>
        {usersToFollow.map((user) => (
          <div key={user.id} className="flex items-center justify-between gap-3">
            <UserTooltip user={user}>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3"
              >
                <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                <div>
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </UserTooltip>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error in WhoToFollow:", error);
    return null;
  }
}

const getTopics = unstable_cache(
  async () => {
    try {
      console.log("Fetching trending topics...");
      
      // Method 1: Try with different table names
      let result;
      
      try {
        // Try with "Post" (with quotes)
        result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
          SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
          FROM "Post"
          WHERE content LIKE '%#%'
          GROUP BY hashtag
          ORDER BY count DESC, hashtag ASC
          LIMIT 5
        `;
      } catch (error) {
        console.log("Method 1 failed, trying method 2...");
        
        // Method 2: Try without quotes
        result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
          SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
          FROM Post
          WHERE content LIKE '%#%'
          GROUP BY hashtag
          ORDER BY count DESC, hashtag ASC
          LIMIT 5
        `;
      }

      console.log("Topics result:", result);
      
      return result.map((row) => ({
        hashtag: row.hashtag,
        count: Number(row.count),
      }));
    } catch (error) {
      console.error("Error fetching topics:", error);
      
      // Fallback: Return some dummy data for testing
      return [
        { hashtag: "#test", count: 1 },
        { hashtag: "#example", count: 1 },
      ];
    }
  },
  ["_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function Topics() {
  try {
    const topics = await getTopics();
    
    console.log("Rendering topics:", topics);

    if (!topics || topics.length === 0) {
      return (
        <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
          <div className="text-xl font-bold">Trending topics</div>
          <p className="text-muted-foreground">No trending topics yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Trending topics</div>
        {topics.map(({ hashtag, count }) => {
          // Remove the # if it's included twice
          const cleanHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
          const title = cleanHashtag.startsWith('#') ? cleanHashtag.slice(1) : cleanHashtag;

          return (
            <Link key={hashtag} href={`/hashtag/${title}`} className="block">
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={cleanHashtag}
              >
                {cleanHashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Error in Topics component:", error);
    return null;
  }
}