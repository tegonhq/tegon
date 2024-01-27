/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
        router.replace(redirectToPath ? (redirectToPath as string) : '/teams');
      }
    },
  });

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    signinMutate(values);
  }

  return (
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
  );
}
