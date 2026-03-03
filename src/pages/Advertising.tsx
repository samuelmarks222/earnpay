import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Eye, MousePointerClick, DollarSign, Coins, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Advertising = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", content: "", budget: "", target_url: "", media_url: "" });

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data } = await supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false });
    setCampaigns(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const createCampaign = async () => {
    if (!user || !form.name.trim() || !form.content.trim() || !form.budget) return;
    setCreating(true);
    const { error } = await supabase.from("ad_campaigns").insert({
      name: form.name.trim(),
      content: form.content.trim(),
      budget: parseFloat(form.budget),
      target_url: form.target_url.trim(),
      media_url: form.media_url.trim(),
      advertiser_id: user.id,
    });
    if (!error) {
      toast({ title: "Campaign created! 📊" });
      setCreateOpen(false);
      setForm({ name: "", content: "", budget: "", target_url: "", media_url: "" });
      fetchCampaigns();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setCreating(false);
  };

  const totalSpent = campaigns.reduce((s, c) => s + (c.spent || 0), 0);
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((s, c) => s + (c.clicks || 0), 0);
  const rewardPool = totalSpent * 0.7;

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Ad Manager</h1>
          <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Create Campaign</Button>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Coins className="h-4 w-4 text-primary" />
          <p className="text-xs text-foreground"><span className="font-semibold">70% of ad revenue</span> goes to the User Reward Pool.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Spend", value: `$${totalSpent.toFixed(0)}`, icon: DollarSign },
            { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye },
            { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick },
            { label: "Reward Pool", value: `$${rewardPool.toFixed(0)}`, icon: Coins },
          ].map(stat => (
            <Card key={stat.label}><CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1"><stat.icon className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">{stat.label}</span></div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </CardContent></Card>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>
            {["all", "active", "ended"].map(tab => (
              <TabsContent key={tab} value={tab} className="space-y-3 mt-3">
                {campaigns.filter(c => tab === "all" || c.status === tab).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">No campaigns.</div>
                ) : campaigns.filter(c => tab === "all" || c.status === tab).map(campaign => (
                  <Card key={campaign.id}><CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-xs text-muted-foreground">{campaign.ad_type} · CPM ${campaign.cpm}</p>
                      </div>
                      <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                      <div><p className="text-lg font-bold text-foreground">{(campaign.impressions || 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Impressions</p></div>
                      <div><p className="text-lg font-bold text-foreground">{(campaign.clicks || 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Clicks</p></div>
                      <div><p className="text-lg font-bold text-primary">{campaign.impressions ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : 0}%</p><p className="text-xs text-muted-foreground">CTR</p></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Budget: ${campaign.budget}</span>
                        <span className="font-medium text-foreground">${(campaign.spent || 0).toFixed(2)} spent</span>
                      </div>
                      <Progress value={campaign.budget ? ((campaign.spent || 0) / campaign.budget) * 100 : 0} className="h-2" />
                    </div>
                  </CardContent></Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Ad Campaign</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Campaign Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Campaign name" /></div>
            <div><Label>Ad Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your ad copy..." /></div>
            <div><Label>Budget ($)</Label><Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="100" /></div>
            <div><Label>Target URL</Label><Input value={form.target_url} onChange={e => setForm(f => ({ ...f, target_url: e.target.value }))} placeholder="https://..." /></div>
            <div><Label>Media URL (optional)</Label><Input value={form.media_url} onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))} placeholder="https://..." /></div>
            <Button className="w-full" onClick={createCampaign} disabled={creating || !form.name.trim() || !form.content.trim() || !form.budget}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Campaign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Advertising;
