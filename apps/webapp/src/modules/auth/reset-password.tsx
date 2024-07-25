import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@tegonhq/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@tegonhq/ui/components/form';
import { Input } from '@tegonhq/ui/components/input';
import { useToast } from '@tegonhq/ui/components/use-toast';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { AuthLayout } from 'common/layouts/auth-layout';
import { AuthGuard } from 'common/wrappers/auth-guard';

import { ResetPasswordSchema, useResetPasswordMutation } from 'services/auth';

export function ResetPassword() {
  const {
    query: { token },
    push,
  } = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
    },
  });
  const { toast } = useToast();
  const { mutate: requestForgotPassword, isLoading } = useResetPasswordMutation(
    {
      onSuccess: () => {
        toast({
          title: 'Reset Password',
          description: 'We have reset your password.',
        });
        push('/auth/signin');
      },
      onError: (message: string) => {
        toast({
          title: 'Reset Password',
          description: message,
          variant: 'destructive',
        });
      },
    },
  );

  function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    requestForgotPassword({
      password: values.password,
      token: token as string,
    });
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-2xl font-semibold text-left">Reset password</h1>
        <div className="text-sm text-left text-muted-foreground mt-1 mb-4">
          Kindly enter the new password
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="XÆA-12Musk"
                      type="password"
                      {...field}
                    />
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
      </div>
    </AuthLayout>
  );
}

ResetPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthGuard>{page}</AuthGuard>;
};
