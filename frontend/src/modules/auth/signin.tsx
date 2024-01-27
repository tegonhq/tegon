/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { AuthLayout } from 'layouts/auth-layout';

import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';

import { useSignInMutation, SignInSchema } from 'services/auth';

export function SignIn() {
  const router = useRouter();
  const {
    query: { redirectToPath },
  } = router;

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signinMutate, isLoading } = useSignInMutation({
    onSuccess: (data) => {
      if (data.status !== 'OK') {
        form.setError(
          'email',
          {
            message: 'Not valid credentials',
          },
          { shouldFocus: true },
        );
      } else {
        router.replace(redirectToPath ? (redirectToPath as string) : '/teams');
      }
    },
  });

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    signinMutate(values);
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        <div className="text-sm text-center text-muted-foreground mt-1 mb-8">
          to continue to Tegon
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="elon@tesla.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="XÆA-12Musk" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" full isLoading={isLoading}>
              Continue
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </div>
    </AuthLayout>
  );
}
