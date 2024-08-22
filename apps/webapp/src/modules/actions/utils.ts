import { ActionStatusEnum } from '@tegonhq/types';
import { z } from 'zod';

import { InputTypeEnum, type FormSchema } from './components/types';

// Generate Zod schema based on JSON schema
export const generateZodSchema = (schema: FormSchema) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape: any = {};

  for (const [key, value] of Object.entries(schema.properties)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fieldSchema: any;
    switch (value.type) {
      case InputTypeEnum.Text:
        fieldSchema = z.string();
        if (value.validation.required) {
          fieldSchema = fieldSchema.nonempty('This field is required');
        }
        if (value.validation.minLength) {
          fieldSchema = fieldSchema.min(value.validation.minLength);
        }
        if (value.validation.maxLength) {
          fieldSchema = fieldSchema.max(value.validation.maxLength);
        }
        break;

      case InputTypeEnum.Number:
        fieldSchema = z.number();
        if (value.validation.required) {
          fieldSchema = fieldSchema.min(0);
        }
        if (value.validation.min !== undefined) {
          fieldSchema = fieldSchema.min(value.validation.min);
        }
        if (value.validation.max !== undefined) {
          fieldSchema = fieldSchema.max(value.validation.max);
        }
        break;

      case InputTypeEnum.Array:
        fieldSchema = z.array(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          generateZodSchema({ properties: value.items.properties } as any)
            .shape,
        );
        break;

      default:
        fieldSchema = z.any(); // fallback, should be more refined
    }

    shape[key] = fieldSchema;
  }

  console.log(shape);
  return z.object(shape);
};

// Function to generate default values based on the schema
export const generateDefaultValues = (schema: FormSchema) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultValues: any = {};

  for (const [key, value] of Object.entries(schema.properties)) {
    switch (value.type) {
      case InputTypeEnum.Text:
        defaultValues[key] = value.default || '';
        break;
      case InputTypeEnum.Number:
        defaultValues[key] = value.default || 0;
        break;
      case InputTypeEnum.Array:
        // Assuming we want at least one empty item in the array by default
        defaultValues[key] = value.default || [{}];
        break;
    }
  }

  return defaultValues;
};

export const StatusMapping = {
  [ActionStatusEnum.ACTIVE]: 'Active',
  [ActionStatusEnum.INSTALLED]: 'Installed',
  [ActionStatusEnum.NEEDS_CONFIGURATION]: 'Needs configuration',
  [ActionStatusEnum.SUSPENDED]: 'Suspended',
  [ActionStatusEnum.DEPLOYING]: 'Deploying',
  [ActionStatusEnum.ERRORED]: 'Errored',
};
