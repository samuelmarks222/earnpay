import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Heart, Plus, Filter, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Electronics", "Furniture", "Sports", "Clothing", "Gaming", "Music", "Vehicles"];

const Marketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", price: "", description: "", category: "Electronics", location: "", image_url: "" });

  const fetchListings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketplace_listings")
      .select("*, profiles!marketplace_listings_seller_id_fkey(full_name, avatar_url)")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    setListings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const createListing = async () => {
    if (!user || !form.title.trim() || !form.price) return;
    setCreating(true);
    const { error } = await supabase.from("marketplace_listings").insert({
      title: form.title.trim(),
      price: parseFloat(form.price),
      description: form.description.trim(),
      category: form.category,
      location: form.location.trim(),
      image_urls: form.image_url ? [form.image_url] : [],
      seller_id: user.id,
    });
    if (!error) {
      toast({ title: "Listing posted! 🛒" });
      setCreateOpen(false);
      setForm({ title: "", price: "", description: "", category: "Electronics", location: "", image_url: "" });
      fetchListings();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setCreating(false);
  };

  const filtered = listings.filter(item => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleSave = (id: string) => {
    setSavedItems(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Sell Something</Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search marketplace..." className="pl-9 bg-card border rounded-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "secondary"} size="sm" className="shrink-0 rounded-full text-xs" onClick={() => setActiveCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(item => (
              <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
                <div className="relative aspect-square overflow-hidden">
                  <img src={item.image_urls?.[0] || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button onClick={e => { e.stopPropagation(); toggleSave(item.id); }} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                    <Heart className={`h-4 w-4 ${savedItems.has(item.id) ? "fill-destructive text-destructive" : "text-foreground"}`} />
                  </button>
                </div>
                <CardContent className="p-3">
                  <p className="font-bold text-foreground text-base">${item.price}</p>
                  <p className="text-sm text-foreground truncate mt-0.5">{item.title}</p>
                  {item.location && <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /><span>{item.location}</span></div>}
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && <div className="col-span-full text-center py-16 text-muted-foreground">No listings found.</div>}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Sell Something</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="What are you selling?" /></div>
            <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" /></div>
            <div><Label>Category</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the item..." /></div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." /></div>
            <Button className="w-full" onClick={createListing} disabled={creating || !form.title.trim() || !form.price}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post Listing"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Marketplace;
