/** Copyright (c) 2024, Tegon, all rights reserved. **/
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
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
import { useToast } from 'components/ui/use-toast';

import {
  useChangePasswordMutation,
  type ChangePasswordParams,
} from 'services/users';

import { SecuritySchema } from './security-interface';

export function SecurityForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const { mutate: updatePassword } = useChangePasswordMutation({
    onSuccess: () => {
      toast({
        title: 'Saved!',
        description: 'Your user password has been updated',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: 'Wrong password',
      });
    },
  });

  const onSubmit = (values: ChangePasswordParams) => {
    form.reset();
    updatePassword(values);
  };

  return (
    <div className="max-w-[250px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <Input placeholder="old password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input placeholder="new password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="secondary"
            isLoading={form.formState.isSubmitting}
          >
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}
