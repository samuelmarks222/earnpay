import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type EarningAction = 
  | 'post_created' 
  | 'reaction_received' 
  | 'comment_received' 
  | 'reel_created' 
  | 'reel_watched' 
  | 'ad_watched' 
  | 'daily_login' 
  | 'referral' 
  | 'share_received';

const DEFAULT_RATES: Record<EarningAction, number> = {
  post_created: 5.0,
  reaction_received: 0.5,
  comment_received: 1.0,
  reel_created: 10.0,
  reel_watched: 0.2,
  ad_watched: 1.0,
  daily_login: 2.0,
  referral: 25.0,
  share_received: 0.5,
};

export const useEarnings = () => {
  const { user } = useAuth();

  const awardSEP = useCallback(async (
    action: EarningAction,
    referenceId?: string,
    description?: string
  ) => {
    if (!user) return null;

    try {
      // Get the configured rate
      const { data: config } = await supabase
        .from('earning_config')
        .select('sep_amount, is_active, daily_limit')
        .eq('action_type', action)
        .single();

      if (config && !config.is_active) return null;

      const sepAmount = config?.sep_amount ?? DEFAULT_RATES[action];

      if (config?.daily_limit) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count } = await supabase
          .from('earning_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('action_type', action)
          .gte('created_at', today.toISOString());

        if ((count ?? 0) >= config.daily_limit) return null;
      }

      const { data, error } = await supabase
        .from('earning_transactions')
        .insert({
          user_id: user.id,
          action_type: action,
          sep_amount: sepAmount,
          reference_id: referenceId,
          description: description ?? `Earned SEP for ${action.replace(/_/g, ' ')}`,
        })
        .select()
        .single();

      if (error) throw error;

      // Update profile total_earnings
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_earnings')
        .eq('id', user.id)
        .single();
      if (profile) {
        await supabase.from('profiles')
          .update({ total_earnings: (profile.total_earnings ?? 0) + sepAmount })
          .eq('id', user.id);
      }

      return data;
    } catch (err) {
      console.error('Error awarding SEP:', err);
      return null;
    }
  }, [user]);

  const getTotalEarnings = useCallback(async () => {
    if (!user) return 0;
    const { data } = await supabase
      .from('profiles')
      .select('total_earnings')
      .eq('id', user.id)
      .single();
    return data?.total_earnings ?? 0;
  }, [user]);

  const getEarningHistory = useCallback(async (limit = 20) => {
    if (!user) return [];
    const { data } = await supabase
      .from('earning_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data ?? [];
  }, [user]);

  return { awardSEP, getTotalEarnings, getEarningHistory };
};
