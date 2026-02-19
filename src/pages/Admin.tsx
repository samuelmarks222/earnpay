import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Users, FileText, Settings, TrendingUp, AlertTriangle, Loader2, Search, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  country: string | null;
  total_earnings: number | null;
  created_at: string;
}

interface EarningConfig {
  id: string;
  action_type: string;
  sep_amount: number;
  daily_limit: number | null;
  is_active: boolean;
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<ProfileData[]>([]);
  const [earningConfig, setEarningConfig] = useState<EarningConfig[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, totalEarnings: 0, activeCampaigns: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [configUpdating, setConfigUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user) checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').single();
    const isAdm = !!data;
    setIsAdmin(isAdm);
    if (isAdm) fetchAdminData();
    else setLoading(false);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    const [usersRes, configRes, postsRes, campaignsRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, avatar_url, username, country, total_earnings, created_at').order('created_at', { ascending: false }).limit(50),
      supabase.from('earning_config').select('*').order('sep_amount', { ascending: false }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('ad_campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    ]);

    setUsers((usersRes.data as unknown as ProfileData[]) ?? []);
    setEarningConfig(configRes.data ?? []);

    const totalEarn = (usersRes.data ?? []).reduce((s, u) => s + Number((u as any).total_earnings ?? 0), 0);
    setStats({
      totalUsers: usersRes.data?.length ?? 0,
      totalPosts: postsRes.count ?? 0,
      totalEarnings: totalEarn,
      activeCampaigns: campaignsRes.count ?? 0,
    });
    setLoading(false);
  };

  const updateConfig = async (id: string, field: 'sep_amount' | 'daily_limit', value: number | null) => {
    setConfigUpdating(id);
    const updateData: any = { [field]: value };
    await supabase.from('earning_config').update(updateData).eq('id', id);
    fetchAdminData();
    setConfigUpdating(null);
    toast({ title: "Config updated!" });
  };

  const toggleConfigActive = async (id: string, current: boolean) => {
    await supabase.from('earning_config').update({ is_active: !current }).eq('id', id);
    fetchAdminData();
  };

  const promoteToAdmin = async (userId: string) => {
    await supabase.from('user_roles').upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });
    toast({ title: "User promoted to admin!" });
  };

  if (isAdmin === null || loading) return (
    <MainLayout><div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div></MainLayout>
  );

  if (isAdmin === false) return <Navigate to="/" replace />;

  const filtered = users.filter(u => (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <MainLayout hideLeftSidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="gradient-earn h-12 w-12 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">SocialEarn platform management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-500" },
            { label: "Total Posts", value: stats.totalPosts.toLocaleString(), icon: FileText, color: "text-primary" },
            { label: "SEP Distributed", value: `${stats.totalEarnings.toFixed(0)}`, icon: TrendingUp, color: "text-yellow-500" },
            { label: "Active Campaigns", value: stats.activeCampaigns.toString(), icon: Settings, color: "text-purple-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-5 flex items-center gap-3">
                <Icon className={`h-8 w-8 ${color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="earning-config"><Settings className="h-4 w-4 mr-2" />Earning Config</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-12" />
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filtered.map(u => {
                    const name = u.full_name || 'Unknown';
                    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <div key={u.id} className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-11 w-11">
                            <AvatarImage src={u.avatar_url || ''} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{name}</p>
                            <p className="text-sm text-muted-foreground">{u.country || 'Unknown'} · {Number(u.total_earnings ?? 0).toFixed(1)} SEP</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => promoteToAdmin(u.id)} className="gap-1.5">
                          <Shield className="h-4 w-4" /> Promote
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earning-config">
            <Card>
              <CardHeader><CardTitle>Earning Rate Configuration</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {earningConfig.map(cfg => (
                    <div key={cfg.id} className="flex items-center justify-between px-5 py-4 gap-4">
                      <div className="flex-1">
                        <p className="font-semibold capitalize text-foreground">{cfg.action_type.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">Daily limit: {cfg.daily_limit ?? 'Unlimited'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            defaultValue={cfg.sep_amount}
                            className="w-24 h-9"
                            step="0.1"
                            onBlur={e => updateConfig(cfg.id, 'sep_amount', parseFloat(e.target.value))}
                          />
                          <span className="text-sm text-muted-foreground">SEP</span>
                        </div>
                        <Button
                          size="sm"
                          variant={cfg.is_active ? "default" : "outline"}
                          onClick={() => toggleConfigActive(cfg.id, cfg.is_active)}
                          className={cfg.is_active ? 'gradient-earn text-primary-foreground' : ''}
                        >
                          {cfg.is_active ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
