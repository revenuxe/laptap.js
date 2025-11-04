import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ReferralCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      generateReferralCode();
    }
  }, [user]);

  const generateReferralCode = async () => {
    if (!user) return;

    try {
      // Check if user already has a referral code
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_user_id', user.id)
        .single();

      if (existingReferral) {
        setReferralCode(existingReferral.referral_code);
      } else {
        // Generate new unique code
        const code = `REF${user.id.substring(0, 8).toUpperCase()}`;
        setReferralCode(code);
        
        // Create referral record
        await supabase.from('referrals').insert({
          referrer_user_id: user.id,
          referral_code: code,
        });
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  const getReferralLink = () => {
    return `https://www.laptap.in/auth?ref=${referralCode}`;
  };

  const handleCopyLink = async () => {
    const link = getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleRefer = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    handleCopyLink();
  };

  return (
    <Card className="w-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Refer a Friend, Earn ₹200</CardTitle>
        <CardDescription className="text-base">
          Get rewarded for every successful laptop sale through your referral
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user && referralCode ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Referral Link</label>
              <div className="flex gap-2">
                <Input
                  value={getReferralLink()}
                  readOnly
                  className="bg-background"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              Share your unique link with friends. When they sell their laptop, you earn ₹200!
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign in to get your unique referral link and start earning
            </p>
            <Button onClick={handleRefer} variant="cta" className="w-full">
              Get Your Referral Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
