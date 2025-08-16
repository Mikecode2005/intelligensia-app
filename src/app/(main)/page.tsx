import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* Enhanced Welcome Header */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">Welcome to Intelligensia</h1>
              <p className="text-orange-100 text-lg mb-4">
                Connect with students worldwide, discover opportunities, and excel in your academic journey.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span>🌍</span>
                  <span>Global Community</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span>🎓</span>
                  <span>Academic Excellence</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span>🚀</span>
                  <span>Career Growth</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span>🤝</span>
                  <span>Collaboration</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="text-6xl">🎯</div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Editor */}
        <PostEditor />
        
        {/* Enhanced Feed Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Tabs defaultValue="for-you" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50 dark:bg-gray-700 rounded-t-2xl">
              <TabsTrigger 
                value="for-you" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium"
              >
                🔥 For You
              </TabsTrigger>
              <TabsTrigger 
                value="following"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium"
              >
                👥 Following
              </TabsTrigger>
            </TabsList>
            <div className="p-1">
              <TabsContent value="for-you" className="mt-0">
                <ForYouFeed />
              </TabsContent>
              <TabsContent value="following" className="mt-0">
                <FollowingFeed />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}