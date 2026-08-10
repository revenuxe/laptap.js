"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Eye, Gift, Copy, Check } from "lucide-react";
import { toast } from 'sonner';

export const PageClient = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sellRequests, setSellRequests] = useState<any[]>([]);
  const [repairRequests, setRepairRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?redirect=/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSellRequests();
      fetchRepairRequests();
      fetchReferralData();
    }
  }, [user]);

  const fetchSellRequests = async () => {
    const { data, error } = await supabase
      .from('sell_requests')
      .select(`
        *,
        models (
          name,
          series (
            name,
            brands (name)
          )
        )
      `)
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load requests');
      console.error(error);
    } else {
      setSellRequests(data || []);
    }
    setLoading(false);
  };

  const fetchRepairRequests = async () => {
    const { data, error } = await supabase
      .from('repair_requests')
      .select(`
        *,
        brands (name)
      `)
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load repair requests:', error);
    } else {
      setRepairRequests(data || []);
    }
  };

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Get or create referral code - check if ANY referral exists for this user
      const { data: existingReferrals, error: fetchError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_user_id', user.id)
        .limit(1);

      if (fetchError) {
        console.error('Error fetching referrals:', fetchError);
        return;
      }

      if (existingReferrals && existingReferrals.length > 0) {
        setReferralCode(existingReferrals[0].referral_code);
      } else {
        // Create a new referral entry for this user
        const code = `REF${user.id.substring(0, 8).toUpperCase()}`;
        const { error: insertError } = await supabase.from('referrals').insert({
          referrer_user_id: user.id,
          referral_code: code,
          status: 'pending'
        });
        
        if (!insertError) {
          setReferralCode(code);
        } else {
          console.error('Error creating referral:', insertError);
        }
      }

      // Fetch all referrals where this user is the referrer AND someone has used the code
      const { data: referralData, error: refDataError } = await supabase
        .from('referrals')
        .select('id, status, reward_amount, created_at, referred_user_id')
        .eq('referrer_user_id', user.id)
        .not('referred_user_id', 'is', null);

      if (refDataError) {
        console.error('Error fetching referral data:', refDataError);
        setReferrals([]);
        return;
      }

      if (referralData && referralData.length > 0) {
        // Get all referred user IDs
        const referredUserIds = referralData
          .map(r => r.referred_user_id)
          .filter((id): id is string => !!id);

        if (referredUserIds.length > 0) {
          // Fetch all profiles in one query
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', referredUserIds);

          if (profileError) {
            console.error('Error fetching profiles:', profileError);
          }

          // Create a map for quick lookup
          const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

          // Map referrals with profile data
          const referralsWithProfiles = referralData.map(ref => ({
            ...ref,
            referred: ref.referred_user_id ? profileMap.get(ref.referred_user_id) : null,
          }));

          setReferrals(referralsWithProfiles);
        } else {
          setReferrals(referralData.map(ref => ({ ...ref, referred: null })));
        }
      } else {
        setReferrals([]);
      }
    } catch (error) {
      console.error('Error in fetchReferralData:', error);
      setReferrals([]);
    }
  };

  const handleCopyReferralLink = async () => {
    const link = `https://www.laptap.in/auth?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <>
      
      
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">My Dashboard</h1>

          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Active Sell Requests</h2>
              {sellRequests.length > 0 ? (
                <div className="space-y-4">
                  {sellRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-semibold">
                          {request.models?.series?.brands?.name} {request.models?.series?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.models?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Request ID: {request.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-primary">Ã¢â€šÂ¹{request.estimated_price.toLocaleString()}</p>
                          <Badge>{getStatusLabel(request.status)}</Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/track/${request.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active sell requests</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Active Repair Requests</h2>
              {repairRequests.length > 0 ? (
                <div className="space-y-4">
                  {repairRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-semibold">
                          {request.brands?.name} - {request.model_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issue: {request.issue_category} {request.issue_subcategory && `- ${request.issue_subcategory}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Order #: {request.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge>{getStatusLabel(request.status)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active repair requests</p>
                </div>
              )}
            </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">History</h2>
                <p className="text-muted-foreground">No past transactions</p>
              </Card>

              <div className="mt-8 text-center">
                <Button variant="cta" size="lg" onClick={() => router.push("/sell")}>
                  Sell Another Device
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="referrals">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <CardTitle>Your Referral Program</CardTitle>
                  </div>
                  <CardDescription>
                    Earn Ã¢â€šÂ¹200 for every successful laptop sale through your referral
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Referral Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`https://www.laptap.in/auth?ref=${referralCode}`}
                        readOnly
                        className="flex-1 px-3 py-2 rounded-md border bg-background"
                      />
                      <Button
                        onClick={handleCopyReferralLink}
                        variant="outline"
                        size="icon"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Your Referrals</h3>
                      <Badge variant="outline">{referrals.length} Total</Badge>
                    </div>

                    {referrals.length > 0 ? (
                      <div className="space-y-3">
                        {referrals.map((ref) => (
                          <div
                            key={ref.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-background border"
                          >
                            <div className="space-y-1">
                              <p className="font-medium">
                                {ref.referred?.full_name || 'New User'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {ref.referred?.email || 'Email not available'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Joined: {new Date(ref.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={ref.status === 'successful' ? 'default' : 'secondary'}
                                className="mb-1"
                              >
                                {ref.status}
                              </Badge>
                              {ref.status === 'successful' && (
                                <p className="text-sm font-semibold text-green-600">
                                  +Ã¢â€šÂ¹{ref.reward_amount}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-muted/30">
                        <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No referrals yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Share your link to start earning!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
};

