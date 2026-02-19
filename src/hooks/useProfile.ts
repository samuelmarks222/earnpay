import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  location: string | null;
  work: string | null;
  country: string | null;
  gender: string | null;
  date_of_birth: string | null;
  followers_count: number | null;
  friends_count: number | null;
  total_earnings: number | null;
  is_online: boolean | null;
}

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetId = userId ?? user?.id;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) { setLoading(false); return; }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [targetId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (!error && data) setProfile(data);
    return { data, error };
  };

  return { profile, loading, updateProfile };
};
