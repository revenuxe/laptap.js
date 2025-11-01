import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AIBlogGeneratorProps {
  onSuccess: (blog: any) => void;
}

export const AIBlogGenerator = ({ onSuccess }: AIBlogGeneratorProps) => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  const handleGenerate = async () => {
    if (!topic || !keywords || !category) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    setProgress('Initializing AI blog generator...');

    try {
      const keywordArray = keywords.split(',').map(k => k.trim());

      setProgress('Generating blog content with AI (2500-2700 words)...');
      
      const { data, error } = await supabase.functions.invoke('generate-blog', {
        body: {
          topic,
          keywords: keywordArray,
          category,
        },
      });

      if (error) throw error;

      setProgress(`Generated ${data.wordCount} words. Creating images...`);

      // Save to database
      setProgress('Saving blog to database...');
      const { data: savedBlog, error: saveError } = await supabase
        .from('blogs')
        .insert({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          category: data.category,
          images: data.images,
          keywords: data.keywords,
          published: false,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setProgress('Blog generated successfully!');
      toast.success(`Blog generated! Word count: ${data.wordCount}`);
      
      setTimeout(() => {
        onSuccess(savedBlog);
      }, 1000);

    } catch (error: any) {
      console.error('Error generating blog:', error);
      toast.error(error.message || 'Failed to generate blog');
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="topic">Blog Topic</Label>
        <Input
          id="topic"
          placeholder="e.g., Best Ways to Sell Your Old Laptop in 2024"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      <div>
        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
        <Textarea
          id="keywords"
          placeholder="e.g., sell laptop, second hand laptop, laptop buyback, laptop trade-in"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          disabled={isGenerating}
          rows={3}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Include long-tail, intent-based keywords that match user search queries
        </p>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          placeholder="e.g., Laptop Selling Tips"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      {progress && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm">{progress}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
        <p className="text-sm font-semibold">AI Will Generate:</p>
        <ul className="text-xs space-y-1 ml-4 list-disc">
          <li>2500-2700 word blog post (human-like writing)</li>
          <li>Proper H2 structure with bullet points and lists</li>
          <li>3-4 AI-generated images placed throughout</li>
          <li>Real expertise, case studies, and examples</li>
          <li>Natural keyword integration (SEO-optimized)</li>
          <li>Emotional meta title and description</li>
          <li>12-year-old reading level (clear and simple)</li>
        </ul>
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating AI Blog...
          </>
        ) : (
          'Generate Blog with AI'
        )}
      </Button>
    </div>
  );
};
