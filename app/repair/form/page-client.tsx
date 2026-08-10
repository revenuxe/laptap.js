"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const issueCategories = {
  'Screen': ['Cracked Screen', 'Display Not Working', 'Dead Pixels', 'Flickering Display', 'Backlight Issue'],
  'Battery': ['Not Charging', 'Draining Fast', 'Battery Swelling', 'Not Holding Charge'],
  'Keyboard': ['Keys Not Working', 'Sticky Keys', 'Missing Keys', 'Keyboard Backlight Issue'],
  'Performance': ['Slow Performance', 'Overheating', 'Random Shutdowns', 'Boot Issues', 'Blue Screen'],
  'Hardware': ['Hard Drive Issue', 'RAM Issue', 'Fan Noise', 'Port Not Working', 'Hinge Broken'],
  'Software': ['OS Installation', 'Virus Removal', 'Data Recovery', 'Driver Issues'],
  'Other': ['Water Damage', 'Physical Damage', 'Other Issue']
};

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  model: z.string().min(2, 'Model is required'),
  issueCategory: z.string().min(1, 'Please select an issue category'),
  issueSubcategory: z.string().optional(),
  issueDetails: z.string().optional(),
  preferredDate: z.date().optional(),
});

export const PageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandId = searchParams.get('brand');
  const category = searchParams.get('category') || 'laptop';
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      model: '',
      issueCategory: '',
      issueSubcategory: '',
      issueDetails: '',
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        const currentPath = `/repair/form?brand=${brandId}&category=${category}`;
        router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }
      setAuthChecked(true);
      
      // Fetch user email to pre-fill
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile?.email) {
        form.setValue('email', profile.email);
      }
    };

    if (!brandId) {
      router.push('/repair/brands');
      return;
    }
    
    checkAuth();
    fetchBrand();
  }, [brandId, user]);

  const fetchBrand = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('name')
      .eq('id', brandId ?? '')
      .single();

    if (error || !data) {
      toast.error('Brand not found');
      router.push('/repair/brands');
    } else {
      setBrandName(data.name);
    }
  };

  const handleIssueCategoryChange = (category: string) => {
    form.setValue('issueCategory', category);
    form.setValue('issueSubcategory', '');
    setSubcategories(issueCategories[category as keyof typeof issueCategories] || []);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .insert([{
          user_id: user!.id,
          brand_id: brandId,
          model_name: values.model,
          customer_name: values.name,
          customer_email: values.email,
          customer_phone: values.phone,
          issue_category: values.issueCategory,
          issue_subcategory: values.issueSubcategory || null,
          issue_details: values.issueDetails || null,
          preferred_date: values.preferredDate?.toISOString() || null,
          status: 'pending',
        }] as any)
        .select()
        .single();

      if (error) throw error;

      toast.success('Repair request submitted successfully!');
      router.push(`/repair/thank-you?orderNumber=${data.order_number}`);
    } catch (error) {
      console.error('Error submitting repair request:', error);
      toast.error('Failed to submit repair request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12 md:py-20">
          {!authChecked ? (
            <div className="container max-w-2xl flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="container max-w-2xl">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-center">Book Repair Service</h1>
            <p className="mb-8 text-center text-muted-foreground">
              Fill in the details for your {brandName} {category} repair
            </p>

            <Card className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter 10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Name</FormLabel>
                        <FormControl>
                          <Input placeholder={`e.g., ${category === 'laptop' ? 'XPS 13, ThinkPad X1' : 'Optiplex, Precision'}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issueCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Category</FormLabel>
                        <Select
                          onValueChange={handleIssueCategoryChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select issue category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(issueCategories).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {subcategories.length > 0 && (
                    <FormField
                      control={form.control}
                      name="issueSubcategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Issue</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select specific issue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((subcategory) => (
                                <SelectItem key={subcategory} value={subcategory}>
                                  {subcategory}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="issueDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your issue in detail..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Preferred Service Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Book Now
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

