import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, Eye, MousePointerClick, DollarSign, BarChart3, Coins } from "lucide-react";
import { adCampaigns } from "@/lib/mock-data";

const Advertising = () => {
  const [campaigns, setCampaigns] = useState(adCampaigns);

  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const rewardPoolContribution = totalSpent * 0.7;

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Ad Manager</h1>
          <Button className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" /> Create Campaign
          </Button>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Coins className="h-4 w-4 text-primary" />
          <p className="text-xs text-foreground">
            <span className="font-semibold">70% of ad revenue</span> goes to the User Reward Pool. Your ads help pay fellow creators!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Spend", value: `$${totalSpent.toFixed(0)}`, icon: DollarSign, color: "text-foreground" },
            { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-primary" },
            { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-primary" },
            { label: "Reward Pool", value: `$${rewardPoolContribution.toFixed(0)}`, icon: TrendingUp, color: "text-earn" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campaigns */}
        <Tabs defaultValue="all">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-3 mt-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>
          <TabsContent value="active" className="space-y-3 mt-3">
            {campaigns.filter((c) => c.status === "active").map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>
          <TabsContent value="ended" className="space-y-3 mt-3">
            {campaigns.filter((c) => c.status === "ended").map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

const CampaignCard = ({ campaign }: { campaign: typeof adCampaigns[0] }) => {
  const spendProgress = (campaign.spent / campaign.budget) * 100;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{campaign.name}</h3>
            <p className="text-xs text-muted-foreground">{campaign.startDate} – {campaign.endDate}</p>
          </div>
          <Badge
            variant={campaign.status === "active" ? "default" : "secondary"}
            className={campaign.status === "active" ? "bg-primary text-primary-foreground" : ""}
          >
            {campaign.status}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{campaign.impressions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Impressions</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{campaign.clicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">{campaign.ctr}%</p>
            <p className="text-xs text-muted-foreground">CTR</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Budget: ${campaign.budget}</span>
            <span className="font-medium text-foreground">${campaign.spent.toFixed(2)} spent</span>
          </div>
          <Progress value={spendProgress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Advertising;
