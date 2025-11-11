import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Referral {
  id: string;
  referral_code: string;
  status: string;
  reward_amount: number;
  created_at: string;
  referrer: {
    email: string;
    full_name: string;
  };
  referred: {
    email: string;
    full_name: string;
  } | null;
}

const ReferralsTab = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          id,
          referral_code,
          status,
          reward_amount,
          created_at,
          referrer_user_id,
          referred_user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setReferrals([]);
        return;
      }

      // Get all unique user IDs
      const userIds = new Set<string>();
      data.forEach(ref => {
        userIds.add(ref.referrer_user_id);
        if (ref.referred_user_id) userIds.add(ref.referred_user_id);
      });

      // Fetch all profiles in one query
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', Array.from(userIds));

      // Create a map for quick lookup
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Map referrals with profiles
      const referralsWithProfiles = data.map(referral => ({
        ...referral,
        referrer: profileMap.get(referral.referrer_user_id) || { email: 'Unknown', full_name: 'Unknown' },
        referred: referral.referred_user_id 
          ? profileMap.get(referral.referred_user_id) || null
          : null,
      }));

      setReferrals(referralsWithProfiles as any);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const updateReferralStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Referral marked as ${newStatus}`);
      fetchReferrals();
    } catch (error) {
      console.error('Error updating referral:', error);
      toast.error('Failed to update referral status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Management</CardTitle>
        <CardDescription>
          Manage user referrals and approve successful sales
        </CardDescription>
      </CardHeader>
      <CardContent>
        {referrals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No referrals yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referral Code</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Referred User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-mono">{referral.referral_code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{referral.referrer?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{referral.referrer?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {referral.referred ? (
                      <div>
                        <div className="font-medium">{referral.referred.full_name}</div>
                        <div className="text-sm text-muted-foreground">{referral.referred.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not used yet</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={referral.status === 'successful' ? 'default' : 'secondary'}
                    >
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{referral.reward_amount}</TableCell>
                  <TableCell>
                    {new Date(referral.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {referral.status === 'pending' && referral.referred && (
                      <Button
                        size="sm"
                        onClick={() => updateReferralStatus(referral.id, 'successful')}
                      >
                        Mark Successful
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralsTab;
