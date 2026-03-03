import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Plus, Clock, Star, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [attendingIds, setAttendingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_date: "", location: "", cover_url: "" });

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    setEvents(data || []);
    if (user) {
      const { data: att } = await supabase.from("event_attendees").select("event_id").eq("user_id", user.id);
      setAttendingIds(new Set((att || []).map((a: any) => a.event_id)));
    }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [user]);

  const toggleGoing = async (eventId: string) => {
    if (!user) return;
    if (attendingIds.has(eventId)) {
      await supabase.from("event_attendees").delete().eq("event_id", eventId).eq("user_id", user.id);
      setAttendingIds(prev => { const n = new Set(prev); n.delete(eventId); return n; });
    } else {
      await supabase.from("event_attendees").insert({ event_id: eventId, user_id: user.id, status: "going" });
      setAttendingIds(prev => new Set(prev).add(eventId));
      toast({ title: "You're going! 🎉" });
    }
  };

  const createEvent = async () => {
    if (!user || !form.title.trim() || !form.event_date) return;
    setCreating(true);
    const { error } = await supabase.from("events").insert({
      title: form.title.trim(),
      description: form.description.trim(),
      event_date: new Date(form.event_date).toISOString(),
      location: form.location.trim(),
      cover_url: form.cover_url || "",
      organizer_id: user.id,
    });
    if (!error) {
      toast({ title: "Event created! 📅" });
      setCreateOpen(false);
      setForm({ title: "", description: "", event_date: "", location: "", cover_url: "" });
      fetchEvents();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setCreating(false);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Create Event</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No events yet. Create one!</div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={event.cover_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop"} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge className="bg-primary/90 border-0 text-primary-foreground mb-2">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {format(new Date(event.event_date), "MMM d, yyyy")}
                    </Badge>
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  {event.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /><span>{event.location}</span>
                    </div>
                  )}
                  {event.description && <p className="text-sm text-foreground">{event.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.attendees_count || 0} going</span>
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {event.interested_count || 0} interested</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full text-xs"
                    variant={attendingIds.has(event.id) ? "default" : "outline"}
                    onClick={() => toggleGoing(event.id)}
                  >
                    {attendingIds.has(event.id) ? "✓ Going" : "Going"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Event Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event name" /></div>
            <div><Label>Date & Time</Label><Input type="datetime-local" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Venue or address" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What's the event about?" /></div>
            <div><Label>Cover Image URL</Label><Input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." /></div>
            <Button className="w-full" onClick={createEvent} disabled={creating || !form.title.trim() || !form.event_date}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Events;
