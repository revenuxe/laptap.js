# Laptap — Tech Resale & Repair Platform

India's most trusted platform for selling used laptops, desktops, and mobile phones with instant cash payment and free doorstep pickup. Built with Next.js 14, React 18, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, SSR)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN/UI](https://ui.shadcn.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **State & Data**: React Query (TanStack), React Hook Form, Zod

## Getting Started

### Environment Setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Use the same variables in your hosting environment before building. Only `sb_publishable_` keys are accepted; legacy anon keys and `sb_secret_` keys must not be used here. The publishable key is intentionally visible in browser JavaScript. Protect data with Supabase RLS and server-side authorization.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
npm run start
```
