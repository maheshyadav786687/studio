
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GanttChartSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push('/admin/dashboard');
    } else {
      // Handle error
      console.error('Login failed');
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="flex items-center justify-center gap-2">
              <GanttChartSquare className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline">ContractorBabu</h1>
            </div>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email and password to login.
              </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              </form>
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginBg && (
            <Image
                src={loginBg.imageUrl}
                alt={loginBg.description}
                fill
                className="object-cover"
                data-ai-hint={loginBg.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-10 left-10 text-primary-foreground">
            <h2 className="text-4xl font-bold font-headline">Manage projects with precision.</h2>
            <p className="mt-2 text-lg max-w-lg">The ultimate admin panel for tracking contractor progress and ensuring project success.</p>
        </div>
      </div>
    </div>
  );
}
