import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  RequestForgotPasswordSchema,
  useRequestForgotPasswordMutation,
} from 'services/auth';
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
import { useForm } from 'react-hook-form';

import { AuthLayout } from 'common/layouts/auth-layout';
import { AuthGuard } from 'common/wrappers/auth-guard';

export function RequestForgotPassword() {
  const form = useForm<z.infer<typeof RequestForgotPasswordSchema>>({
    resolver: zodResolver(RequestForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  const { toast } = useToast();
  const { mutate: requestForgotPassword, isLoading } =
    useRequestForgotPasswordMutation({
      onSuccess: () => {
        toast({
          title: 'Forgot Password',
          description:
            'We have sent the details to reset yout password to your email',
        });
      },

      onError: (message: string) => {
        toast({
          title: 'Forgot Password',
          variant: 'destructive',
          description: message,
        });
      },
    });

  function onSubmit(values: z.infer<typeof RequestForgotPasswordSchema>) {
    requestForgotPassword({
      email: values.email,
    });
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-[360px]">
        <h1 className="text-2xl font-semibold text-left">Forgot password</h1>
        <div className="text-sm text-left text-muted-foreground mt-1 mb-4">
          No worries! We’ll get you rolling again in no time.
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

            <Button type="submit" full isLoading={isLoading}>
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}

RequestForgotPassword.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthGuard>{page}</AuthGuard>;
};
