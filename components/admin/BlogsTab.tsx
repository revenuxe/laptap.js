"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Plus, Wand2, Eye, Edit, Trash2 } from 'lucide-react';
import { AIBlogGenerator } from './AIBlogGenerator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export const BlogsTab = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Blog deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    },
    onError: (error) => {
      toast.error('Failed to delete blog');
      console.error(error);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from('blogs')
        .update({ published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Blog updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    },
    onError: (error) => {
      toast.error('Failed to update blog');
      console.error(error);
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async (blog: any) => {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          meta_title: blog.meta_title,
          meta_description: blog.meta_description,
          category: blog.category,
        })
        .eq('id', blog.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Blog updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setIsEditing(false);
      setSelectedBlog(null);
    },
    onError: (error) => {
      toast.error('Failed to update blog');
      console.error(error);
    },
  });

  const handleBlogGenerated = (blog: any) => {
    setIsGenerating(false);
    queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
    toast.success('Blog generated and saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
          <DialogTrigger asChild>
            <Button>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate AI Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Blog with AI</DialogTitle>
            </DialogHeader>
            <AIBlogGenerator onSuccess={handleBlogGenerated} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Blogs</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {blogs?.map((blog) => (
            <Card key={blog.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <Switch
                      checked={!!blog.published}
                      onCheckedChange={(checked) =>
                        togglePublishMutation.mutate({ id: blog.id, published: checked })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Category: {blog.category}</span>
                    <span>Created: {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setIsEditing(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBlogMutation.mutate(blog.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {blogs?.filter(b => b.published).map((blog) => (
            <Card key={blog.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setIsEditing(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {blogs?.filter(b => !b.published).map((blog) => (
            <Card key={blog.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublishMutation.mutate({ id: blog.id, published: true })}
                  >
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setIsEditing(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={selectedBlog.title}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea
                  value={selectedBlog.excerpt}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={selectedBlog.content}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, content: e.target.value })}
                  rows={15}
                />
              </div>
              <div>
                <Label>Meta Title</Label>
                <Input
                  value={selectedBlog.meta_title}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, meta_title: e.target.value })}
                />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={selectedBlog.meta_description}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, meta_description: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={selectedBlog.category}
                  onChange={(e) => setSelectedBlog({ ...selectedBlog, category: e.target.value })}
                />
              </div>
              <Button onClick={() => updateBlogMutation.mutate(selectedBlog)}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
