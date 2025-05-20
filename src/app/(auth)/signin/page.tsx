'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getSession, signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import {  Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: 'Login Failed',
        description: result.error === 'CredentialsSignin'
          ? 'Incorrect username or password'
          : result.error,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    } else {
      router.replace('/Home');
      toast({
        title: 'Login Successful',
        description: 'Redirecting to home page',
        variant: 'default',
      });
    }

    const session = await getSession();
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    }

    router.refresh();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f8fafc] to-[#dbeafe] px-4">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight mb-3 animate-fade-in">
            TweetConnect
          </h1>
          <p className="text-gray-600 text-sm animate-slide-in">Connect. Express. Stay Updated.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-fade-in-up">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">Email or Username</FormLabel>
                  <Input
                    {...field}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="you@example.com"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <div
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-transform transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Not a member yet?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}