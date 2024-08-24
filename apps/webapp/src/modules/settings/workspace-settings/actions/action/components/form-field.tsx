import {
  FormControl,
  FormDescription,
  FormField as FormFieldC,
  FormItem,
  FormLabel,
  FormMessage,
} from '@tegonhq/ui/components/form';
import { Input } from '@tegonhq/ui/components/input';
import { type Control } from 'react-hook-form';

import { Array } from './inputs/array';
import { InputTypeEnum, type FieldConfig } from './types';

interface FormControllerProps {
  name: string;
  control: Control;
  config: FieldConfig;
}

export function FormField({ name, control, config }: FormControllerProps) {
  console.log(name, control, config);

  switch (config.type) {
    case InputTypeEnum.Text: {
      return (
        <FormFieldC
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="my-3">
              <FormLabel>{config.title}</FormLabel>
              {config.description && (
                <FormDescription>{config.description}</FormDescription>
              )}
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case InputTypeEnum.Number: {
      return (
        <FormFieldC
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="my-3">
              <FormLabel>{config.title}</FormLabel>
              {config.description && (
                <FormDescription>{config.description}</FormDescription>
              )}
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
  }

  return <Array name={name} control={control} config={config} />;
}
