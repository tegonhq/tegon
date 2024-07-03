/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from 'common/lib/utils';

import { Button, buttonVariants } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';

import { SignInSchema, useSignInMutation } from 'services/auth';

export function SignForm() {
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
        router.replace(redirectToPath ? (redirectToPath as string) : '/');
      }
    },
  });

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    signinMutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="my-3">
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
                <Input placeholder="XÆA-12Musk" type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Link
          href="/auth/forgot-password"
          className={cn(buttonVariants({ variant: 'ghost' }), 'mb-3 mt-1')}
        >
          Forgot password?
        </Link>

        <div className="flex flex-col gap-2 justify-end">
          <Button type="submit" size="lg" full isLoading={isLoading}>
            Continue
          </Button>

          <a
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'lg', full: true }),
            )}
            href="/auth/signup"
          >
            Create a new account
          </a>
        </div>
      </form>
    </Form>
  );
}
