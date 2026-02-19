
-- POSTS
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text,
  post_type text NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'photo', 'video', 'reel')),
  media_urls text[] DEFAULT '{}',
  privacy text NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'friends', 'private')),
  is_sponsored boolean DEFAULT false,
  sponsor_name text,
  reactions_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  sep_earned numeric DEFAULT 0,
  group_id uuid,
  page_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (privacy = 'public' OR auth.uid() = author_id);

CREATE POLICY "Users can create own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- REACTIONS
CREATE TABLE public.reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  reaction_type text NOT NULL DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry', 'care')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)
);

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are viewable by everyone" ON public.reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reactions" ON public.reactions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- COMMENTS
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  reactions_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id);

-- GROUPS
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_url text,
  avatar_url text,
  privacy text NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
  creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  members_count integer DEFAULT 1,
  posts_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public groups are viewable by everyone" ON public.groups
  FOR SELECT USING (privacy = 'public' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Group creators can update groups" ON public.groups
  FOR UPDATE USING (auth.uid() = creator_id);

-- GROUP MEMBERS
CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  is_pinned boolean DEFAULT false,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members are viewable by everyone" ON public.group_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE USING (auth.uid() = user_id);

-- PAGES (brand/creator pages)
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_url text,
  avatar_url text,
  category text,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  followers_count integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are viewable by everyone" ON public.pages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create pages" ON public.pages
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Page creators can update pages" ON public.pages
  FOR UPDATE USING (auth.uid() = creator_id);

-- PAGE FOLLOWERS
CREATE TABLE public.page_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  followed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (page_id, user_id)
);

ALTER TABLE public.page_followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page followers viewable by everyone" ON public.page_followers
  FOR SELECT USING (true);

CREATE POLICY "Users can follow pages" ON public.page_followers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow pages" ON public.page_followers
  FOR DELETE USING (auth.uid() = user_id);

-- MARKETPLACE LISTINGS
CREATE TABLE public.marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  location text,
  image_urls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),
  views_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Marketplace listings viewable by everyone" ON public.marketplace_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings" ON public.marketplace_listings
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own listings" ON public.marketplace_listings
  FOR DELETE USING (auth.uid() = seller_id);

-- EVENTS
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  cover_url text,
  location text,
  event_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  is_online boolean DEFAULT false,
  online_url text,
  attendees_count integer DEFAULT 0,
  interested_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events viewable by everyone" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update events" ON public.events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- EVENT ATTENDEES
CREATE TABLE public.event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event attendees viewable by everyone" ON public.event_attendees
  FOR SELECT USING (true);

CREATE POLICY "Users can manage event attendance" ON public.event_attendees
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- EARNING TRANSACTIONS
CREATE TABLE public.earning_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('post_created', 'reaction_received', 'comment_received', 'reel_created', 'reel_watched', 'ad_watched', 'daily_login', 'referral', 'share_received')),
  sep_amount numeric NOT NULL DEFAULT 0,
  reference_id uuid,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.earning_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own earnings" ON public.earning_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert earnings" ON public.earning_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- EARNING CONFIG (admin-configurable rates)
CREATE TABLE public.earning_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL UNIQUE,
  sep_amount numeric NOT NULL DEFAULT 0,
  daily_limit integer,
  is_active boolean DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.earning_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Earning config viewable by everyone" ON public.earning_config
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage earning config" ON public.earning_config
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- AD CAMPAIGNS
CREATE TABLE public.ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  ad_type text NOT NULL DEFAULT 'feed' CHECK (ad_type IN ('feed', 'reel', 'sidebar')),
  content text NOT NULL,
  media_url text,
  target_url text,
  target_countries text[] DEFAULT '{}',
  target_age_min integer DEFAULT 13,
  target_age_max integer DEFAULT 99,
  target_gender text DEFAULT 'all',
  budget numeric NOT NULL DEFAULT 0,
  spent numeric DEFAULT 0,
  cpm numeric DEFAULT 5.0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  start_date date,
  end_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advertisers can view own campaigns" ON public.ad_campaigns
  FOR SELECT USING (auth.uid() = advertiser_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create campaigns" ON public.ad_campaigns
  FOR INSERT WITH CHECK (auth.uid() = advertiser_id);

CREATE POLICY "Advertisers can update own campaigns" ON public.ad_campaigns
  FOR UPDATE USING (auth.uid() = advertiser_id);

-- STORIES
CREATE TABLE public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  views_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stories viewable by authenticated users" ON public.stories
  FOR SELECT USING (auth.uid() IS NOT NULL AND expires_at > now());

CREATE POLICY "Users can create own stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own stories" ON public.stories
  FOR DELETE USING (auth.uid() = author_id);

-- FRAUD FLAGS
CREATE TABLE public.fraud_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  flagged_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone
);

ALTER TABLE public.fraud_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage fraud flags" ON public.fraud_flags
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default earning rates
INSERT INTO public.earning_config (action_type, sep_amount, daily_limit) VALUES
  ('post_created', 5.0, 10),
  ('reaction_received', 0.5, 100),
  ('comment_received', 1.0, 50),
  ('reel_created', 10.0, 5),
  ('reel_watched', 0.2, 50),
  ('ad_watched', 1.0, 20),
  ('daily_login', 2.0, 1),
  ('referral', 25.0, NULL),
  ('share_received', 0.5, 50);

-- Triggers for updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_updated_at BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON public.ad_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.earning_transactions;
