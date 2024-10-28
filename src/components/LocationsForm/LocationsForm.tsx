import { useEffect } from 'react';
import { IconCopy, IconPlus, IconTrash } from '@tabler/icons-react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { ActionIcon, Button, Group, Textarea, TextInput } from '@mantine/core';

export interface Props {
  defaultValue: FormValues['location'];
  onValueChange: (newValue: FormValues['location']) => void;
}

export type LocationsFormValue = {
  description?: string;
  url?: string;
}[];

type FormValues = {
  location?: LocationsFormValue;
};

export function LocationsForm(props: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      location: props.defaultValue,
    },
    mode: 'onBlur',
  });
  const formValue = useWatch({ control });
  // TODO: There is probably a more elegant way without an effect.
  useEffect(() => {
    props.onValueChange(formValue.location);
  }, [formValue]);
  const { fields, append, remove, insert } = useFieldArray({
    name: 'location',
    control,
  });
  return (
    <form>
      {fields.map((field, index) => {
        return (
          <Group key={field.id}>
            <Textarea
              flex={1}
              label="Description"
              placeholder="Description"
              {...register(`location.${index}.description` as const, {
                required: true,
              })}
              className={errors?.location?.[index]?.description ? 'error' : ''}
              autosize
            />
            <TextInput
              flex={1}
              style={{ alignSelf: 'end' }}
              label="URL"
              placeholder="URL"
              {...register(`location.${index}.url` as const, {
                required: true,
              })}
              className={errors?.location?.[index]?.url ? 'error' : ''}
            />
            <ActionIcon
              variant="light"
              aria-label="Duplicate"
              onClick={() =>
                insert(index + 1, {
                  description: formValue.location?.[index].description,
                  url: formValue.location?.[index].url,
                })
              }
              style={{ alignSelf: 'end' }}
              size="lg"
            >
              <IconCopy />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="red"
              aria-label="Trash"
              onClick={() => remove(index)}
              style={{ alignSelf: 'end' }}
              size="lg"
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        );
      })}

      <Button
        variant="light"
        mt="md"
        onClick={() =>
          append({
            description: '',
            url: '',
          })
        }
        leftSection={<IconPlus />}
      >
        Add next
      </Button>
    </form>
  );
}
