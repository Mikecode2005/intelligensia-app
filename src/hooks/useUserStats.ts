// src/hooks/useUserStats.ts - IMPROVED VERSION
import { useSession } from "@/app/(main)/SessionProvider";
import { useQuery } from "@tanstack/react-query";

export interface UserStats {
  followers: number;
  following: number;
  posts: number;
  classes: number;
  achievements: number;
  streak: number;
  totalLikes: number;
  totalComments: number;
  totalRemixes: number;
  engagementRate: number;
  weeklyActivity: number;
}

export function useUserStats() {
  const { user } = useSession();

  return useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async (): Promise<UserStats> => {
      if (!user) throw new Error('User not authenticated');

      console.log('🔄 Fetching user stats...');
      
      const response = await fetch('/api/users/stats');
      
      console.log('📊 API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Stats data received:', data);
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000,
    retry: 2, // Retry failed requests
  });
}