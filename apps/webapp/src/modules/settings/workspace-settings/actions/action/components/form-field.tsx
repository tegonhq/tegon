import {
  FormControl,
  FormDescription,
  FormField as FormFieldC,
  FormItem,
  FormLabel,
  FormMessage,
} from '@tegonhq/ui/components/form';
import { Input } from '@tegonhq/ui/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@tegonhq/ui/components/select';
import { type Control } from 'react-hook-form';

import { Array } from './inputs/array';
import {
  InputTypeEnum,
  type ArrayFieldConfig,
  type FieldConfig,
} from './types';

interface FormControllerProps {
  name: string;
  control: Control;
  config: FieldConfig;
}

export function FormField({ name, control, config }: FormControllerProps) {
  switch (config.type) {
    case InputTypeEnum.Array: {
      return (
        <Array
          name={name}
          control={control}
          config={config as ArrayFieldConfig}
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

    case InputTypeEnum.Select: {
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
                <Select {...field}>
                  <SelectTrigger className="h-7 py-1 flex gap-1 items-center">
                    <SelectValue placeholder={config.title} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {config.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
  }

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
