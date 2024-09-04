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
import { useForm } from 'react-hook-form';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { z } from 'zod';

import { UserDataWrapper } from 'common/wrappers/user-data-wrapper';

import { useImpersonateMutation } from 'services/x';
export const AdminSchema = z.object({
  userId: z.string().min(5),
  key: z.string().min(5),
});

export default function Admin() {
  const { toast } = useToast();

  const { mutate } = useImpersonateMutation({
    onSuccess: () => {
      toast({
        title: 'Success!',
        description:
          'Impersonate is done, use this feature with responsibility',
      });
    },
  });
  const form = useForm<z.infer<typeof AdminSchema>>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {},
  });

  const onSubmit = (values: { key: string; userId: string }) => {
    mutate(values);
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UserId</FormLabel>
                <FormControl>
                  <Input placeholder="User id" className="h-9" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input placeholder="Key" className="h-9" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

Admin.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <SessionAuth>
      <UserDataWrapper>{page}</UserDataWrapper>
    </SessionAuth>
  );
};
