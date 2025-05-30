
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, Post } from '@/types';

export const useDatabase = () => {
  const queryClient = useQueryClient();

  // Fetch user profile
  const useUserProfile = (userId?: string) => {
    return useQuery({
      queryKey: ['profile', userId],
      queryFn: async () => {
        if (!userId) return null;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data;
      },
      enabled: !!userId
    });
  };

  // Create user profile
  const createProfile = useMutation({
    mutationFn: async (profileData: {
      id: string;
      username: string;
      display_name: string;
      bio?: string;
      avatar?: string;
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  // Fetch posts
  const usePosts = () => {
    return useQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles!posts_author_id_fkey (
              id,
              username,
              display_name,
              avatar,
              is_verified,
              follower_count,
              following_count,
              created_at
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match our Post interface
        const transformedPosts: Post[] = data.map(post => ({
          id: post.id,
          content: post.content,
          mediaUrl: post.media_url || undefined,
          mediaType: post.media_type as 'image' | 'video' | undefined,
          upvotes: post.upvotes || 0,
          downvotes: post.downvotes || 0,
          commentCount: post.comment_count || 0,
          tipAmount: Number(post.tip_amount) || 0,
          createdAt: post.created_at,
          tags: [], // We'll fetch tags separately if needed
          author: {
            id: post.profiles.id,
            walletAddress: '', // Not stored in profiles table
            username: post.profiles.username,
            displayName: post.profiles.display_name,
            bio: undefined, // Not included in this query
            avatar: post.profiles.avatar || undefined,
            followerCount: post.profiles.follower_count || 0,
            followingCount: post.profiles.following_count || 0,
            isVerified: post.profiles.is_verified || false,
            createdAt: post.profiles.created_at
          }
        }));
        
        return transformedPosts;
      }
    });
  };

  // Search functionality
  const searchProfiles = async (query: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(10);
    
    if (error) throw error;
    return data;
  };

  const searchPosts = async (query: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_author_id_fkey (
          id,
          username,
          display_name,
          avatar,
          is_verified,
          follower_count,
          following_count,
          created_at
        )
      `)
      .textSearch('content', query)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    // Transform the data similar to usePosts
    const transformedPosts: Post[] = data.map(post => ({
      id: post.id,
      content: post.content,
      mediaUrl: post.media_url || undefined,
      mediaType: post.media_type as 'image' | 'video' | undefined,
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      commentCount: post.comment_count || 0,
      tipAmount: Number(post.tip_amount) || 0,
      createdAt: post.created_at,
      tags: [],
      author: {
        id: post.profiles.id,
        walletAddress: '',
        username: post.profiles.username,
        displayName: post.profiles.display_name,
        bio: undefined,
        avatar: post.profiles.avatar || undefined,
        followerCount: post.profiles.follower_count || 0,
        followingCount: post.profiles.following_count || 0,
        isVerified: post.profiles.is_verified || false,
        createdAt: post.profiles.created_at
      }
    }));
    
    return transformedPosts;
  };

  return {
    useUserProfile,
    createProfile,
    usePosts,
    searchProfiles,
    searchPosts
  };
};
