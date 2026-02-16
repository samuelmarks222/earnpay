import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart, Plus, Filter, Coins } from "lucide-react";
import { marketplaceListings } from "@/lib/mock-data";

const categories = ["All", "Electronics", "Furniture", "Sports", "Clothing", "Gaming", "Music", "Vehicles"];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = marketplaceListings.filter((item) => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleSave = (id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Marketplace</h1>
          <Button className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" /> Sell Something
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              className="pl-9 bg-card border rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              className="shrink-0 rounded-full text-xs"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Coins className="h-4 w-4 text-primary" />
          <p className="text-xs text-foreground">
            <span className="font-semibold">Earn 20 SEP</span> for every listing you post! Successful sales earn bonus points.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                >
                  <Heart className={`h-4 w-4 ${savedItems.has(item.id) ? "fill-destructive text-destructive" : "text-foreground"}`} />
                </button>
              </div>
              <CardContent className="p-3">
                <p className="font-bold text-foreground text-base">${item.price}</p>
                <p className="text-sm text-foreground truncate mt-0.5">{item.title}</p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Marketplace;
