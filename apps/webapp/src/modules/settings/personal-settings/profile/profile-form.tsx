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
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateUserMutation, type UpdateUserParams } from 'services/users';

import { UserContext } from 'store/user-context';

import { ProfileSchema } from './profile.interface';

export function ProfileForm() {
  const { toast } = useToast();
  const userData = React.useContext(UserContext);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: userData.username,
      fullname: userData.fullname,
    },
  });

  const { mutate: updateUser } = useUpdateUserMutation({
    onSuccess: () => {
      toast({
        title: 'Saved!',
        description: 'Your user information has been updated',
      });
    },
  });

  const onSubmit = (values: UpdateUserParams) => {
    updateUser(values);
  };

  return (
    <div className="max-w-[250px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Tesla" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="elonmusk" {...field} />
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
