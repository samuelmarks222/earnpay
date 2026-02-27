-- Drop existing FK to auth.users and add FK to profiles for PostgREST join support
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE public.posts ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id);

ALTER TABLE public.stories DROP CONSTRAINT IF EXISTS stories_author_id_fkey;
ALTER TABLE public.stories ADD CONSTRAINT stories_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id);

ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
ALTER TABLE public.comments ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id);

ALTER TABLE public.reactions DROP CONSTRAINT IF EXISTS reactions_user_id_fkey;
ALTER TABLE public.reactions ADD CONSTRAINT reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.earning_transactions DROP CONSTRAINT IF EXISTS earning_transactions_user_id_fkey;
ALTER TABLE public.earning_transactions ADD CONSTRAINT earning_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_organizer_id_fkey;
ALTER TABLE public.events ADD CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.profiles(id);

ALTER TABLE public.event_attendees DROP CONSTRAINT IF EXISTS event_attendees_user_id_fkey;
ALTER TABLE public.event_attendees ADD CONSTRAINT event_attendees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.marketplace_listings DROP CONSTRAINT IF EXISTS marketplace_listings_seller_id_fkey;
ALTER TABLE public.marketplace_listings ADD CONSTRAINT marketplace_listings_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id);

ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS pages_creator_id_fkey;
ALTER TABLE public.pages ADD CONSTRAINT pages_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id);

ALTER TABLE public.groups DROP CONSTRAINT IF EXISTS groups_creator_id_fkey;
ALTER TABLE public.groups ADD CONSTRAINT groups_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id);

ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_user_id_fkey;
ALTER TABLE public.group_members ADD CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.ad_campaigns DROP CONSTRAINT IF EXISTS ad_campaigns_advertiser_id_fkey;
ALTER TABLE public.ad_campaigns ADD CONSTRAINT ad_campaigns_advertiser_id_fkey FOREIGN KEY (advertiser_id) REFERENCES public.profiles(id);

ALTER TABLE public.fraud_flags DROP CONSTRAINT IF EXISTS fraud_flags_user_id_fkey;
ALTER TABLE public.fraud_flags ADD CONSTRAINT fraud_flags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_profiles_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_profiles_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id);

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_profiles_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_receiver_id_profiles_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id);