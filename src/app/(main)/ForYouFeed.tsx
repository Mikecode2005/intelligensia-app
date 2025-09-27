"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import AdCarousel from "@/components/AdCarousel";

// Sample ads data
const sampleAds = [
  {
    id: "ad1",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Boost Your Career with Advanced Courses",
    description: "Enroll in our specialized courses designed for university students and young professionals.",
    ctaText: "Explore Courses",
    ctaUrl: "/courses",
    sponsorName: "EduTech Solutions",
    sponsorLogo: "https://placehold.co/100x100?text=ET"
  },
  {
    id: "ad2",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Student Discount on Premium Software",
    description: "Get 50% off on all professional software subscriptions with your student ID.",
    ctaText: "Claim Discount",
    ctaUrl: "/discounts",
    sponsorName: "TechEdu Partners",
    sponsorLogo: "https://placehold.co/100x100?text=TP"
  },
  {
    id: "ad3",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Internship Opportunities for Students",
    description: "Connect with top companies offering internships in your field of study.",
    ctaText: "Apply Now",
    ctaUrl: "/internships",
    sponsorName: "Career Connect",
    sponsorLogo: "https://placehold.co/100x100?text=CC"
  }
];

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has posted anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  // Insert ad after every 5 posts
  const postsWithAds = [];
  let adIndex = 0;
  
  posts.forEach((post, index) => {
    postsWithAds.push(
      <Post key={post.id} post={post} />
    );
    
    // Insert ad after every 5 posts
    if ((index + 1) % 5 === 0 && sampleAds.length > 0) {
      postsWithAds.push(
        <AdCarousel 
          key={`ad-${index}`} 
          ads={[sampleAds[adIndex % sampleAds.length]]} 
          className="my-5"
        />
      );
      adIndex++;
    }
  });

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {/* Show ad carousel at the top */}
      <AdCarousel ads={sampleAds} className="mb-5" />
      
      {/* Posts with ads interspersed */}
      {postsWithAds}
      
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}