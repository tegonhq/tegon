/** Copyright (c) 2024, Tegon, all rights reserved. **/
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { AuthLayout } from 'layouts/auth-layout';

import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';

const signInSchema = z.object({
  email: z.string().email('This is not a valid email').min(2).max(50),
  password: z.string().min(4),
});

export default function SignIn() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log(values);
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-2xl font-semibold text-center mb-8">
          {' '}
          Welcome back{' '}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="elon@tesla.com" {...field} />
                  </FormControl>
                  <FormDescription>Your work email address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" full>
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}
