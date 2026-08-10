"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

const ReferralCard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) generateReferralCode();
  }, [user]);

  const generateReferralCode = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: existingReferrals, error: fetchError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_user_id', user.id)
        .limit(1);

      if (fetchError) { console.error('Error fetching referral:', fetchError); return; }

      if (existingReferrals && existingReferrals.length > 0) {
        setReferralCode(existingReferrals[0].referral_code);
      } else {
        const code = `REF${user.id.substring(0, 8).toUpperCase()}`;
        setReferralCode(code);
        const { error: insertError } = await supabase.from('referrals').insert({
          referrer_user_id: user.id, referral_code: code, status: 'pending'
        });
        if (insertError) console.error('Error creating referral:', insertError);
      }
    } catch (error) {
      console.error('Error in generateReferralCode:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReferralLink = () => `https://www.laptap.in/auth?ref=${referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleRefer = () => {
    if (!user) { router.push('/auth'); return; }
    handleCopyLink();
  };

  return (
    <Card className="w-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 rounded-2xl overflow-hidden">
      <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6 pt-5 sm:pt-6">
        <div className="mx-auto mb-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <CardTitle className="text-lg sm:text-2xl">Refer a Friend, Earn â‚¹200</CardTitle>
        <CardDescription className="text-xs sm:text-base">
          Get rewarded for every successful laptop sale through your referral
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-5 sm:pb-6">
        {user && referralCode ? (
          <>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Your Referral Link</label>
              <div className="flex gap-2">
                <Input value={getReferralLink()} readOnly className="bg-background text-xs sm:text-sm" />
                <Button onClick={handleCopyLink} variant="outline" size="icon" className="shrink-0 h-9 w-9">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground text-center">
              Share your unique link with friends. When they sell their laptop, you earn â‚¹200!
            </div>
          </>
        ) : (
          <div className="text-center space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to get your unique referral link and start earning
            </p>
            <Button onClick={handleRefer} variant="cta" className="w-full h-10 sm:h-11 text-sm">
              Get Your Referral Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
