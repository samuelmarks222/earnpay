import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Users, Plus, Clock, Star, Coins } from "lucide-react";
import { events } from "@/lib/mock-data";

const Events = () => {
  const [eventsState, setEvents] = useState(events);

  const toggleGoing = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? { ...ev, isGoing: !ev.isGoing, attendeesCount: ev.isGoing ? ev.attendeesCount - 1 : ev.attendeesCount + 1 }
          : ev
      )
    );
  };

  const toggleInterested = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? { ...ev, isInterested: !ev.isInterested, interestedCount: ev.isInterested ? ev.interestedCount - 1 : ev.interestedCount + 1 }
          : ev
      )
    );
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Events</h1>
          <Button className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" /> Create Event
          </Button>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Coins className="h-4 w-4 text-primary" />
          <p className="text-xs text-foreground">
            <span className="font-semibold">Earn 15 SEP</span> for creating events and <span className="font-semibold">2 SEP</span> for each RSVP!
          </p>
        </div>

        <div className="space-y-4">
          {eventsState.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img src={event.cover} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge className="bg-primary/90 border-0 text-primary-foreground mb-2">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {event.date}
                  </Badge>
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground">{event.description}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={event.organizer.avatar} />
                    <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">by <span className="font-medium text-foreground">{event.organizer.name}</span></span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.attendeesCount} going</span>
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {event.interestedCount} interested</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className={`flex-1 text-xs ${event.isGoing ? "bg-primary text-primary-foreground" : ""}`}
                    variant={event.isGoing ? "default" : "outline"}
                    onClick={() => toggleGoing(event.id)}
                  >
                    {event.isGoing ? "✓ Going" : "Going"}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    variant={event.isInterested ? "default" : "secondary"}
                    onClick={() => toggleInterested(event.id)}
                  >
                    {event.isInterested ? "★ Interested" : "Interested"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;
