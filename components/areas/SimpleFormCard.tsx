"use client";

import { useState } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import SimpleForm from '@/components/SimpleForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SimpleFormCard() {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <button type="button" className="area-service-card area-simple-form">
        <div><FileText aria-hidden="true" /></div>
        <h2>Simple Form</h2>
        <p>Share your details. We’ll call you back.</p>
        <span>Get a callback <ArrowRight aria-hidden="true" /></span>
      </button>
    </DialogTrigger>
    <DialogContent className="max-h-[85dvh] overflow-y-auto">
      <DialogHeader><DialogTitle>Get a callback</DialogTitle><DialogDescription>Tell us about your device and our team will contact you to discuss the next steps.</DialogDescription></DialogHeader>
      <SimpleForm onSuccess={() => setOpen(false)} />
    </DialogContent>
  </Dialog>;
}
