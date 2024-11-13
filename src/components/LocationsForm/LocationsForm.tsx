import { useEffect } from 'react';
import { IconCopy, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Button, Group, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';

export interface Props {
  className?: string;
  /**
   * Even though it feels and probably is pretty illegal, this offers the parent a way to update
   * the form value of this component imperatively. If the parent passes this prop, it will be
   * called on mount with a function that can be called to set the form value.
   *
   * When storing the setFormValue function in a useState, remember to do it like so:
   *   setCallback(() => setFormValue)
   * instead of
   *   setCallback(setFormValue)
   * because in the latter case the setFormValue callback would just be called immediately.
   *
   * @param setFormValue
   * @returns
   */
  registerSetFormValue?: (setFormValue: (newValue: FormValues['locations']) => void) => void;
  defaultValue: FormValues['locations'];
  onValueChange: (newValue: FormValues['locations']) => void;
}

export type LocationsFormValue = {
  description?: string;
  url?: string;
  randomId: string;
}[];

type FormValues = {
  locations?: LocationsFormValue;
};

export function LocationsForm(props: Props) {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      locations: props.defaultValue,
    },
    onValuesChange(values) {
      props.onValueChange(values.locations);
    },
  });

  useEffect(() => {
    props.registerSetFormValue?.((newValue) => {
      form.setValues({ locations: newValue });
      form.resetDirty({ locations: newValue });
    });
  }, []);

  const fields = form.getValues().locations?.map((item, index) => (
    <Group key={item.randomId} mt="sm">
      <Textarea
        flex={1}
        label="Description"
        placeholder="Description"
        key={form.key(`locations.${index}.description`)}
        {...form.getInputProps(`locations.${index}.description`)}
        autosize
      />
      <TextInput
        flex={1}
        style={{ alignSelf: 'end' }}
        label="URL"
        placeholder="URL"
        key={form.key(`locations.${index}.url`)}
        {...form.getInputProps(`locations.${index}.url`)}
      />
      <ActionIcon
        variant="light"
        aria-label="Duplicate"
        onClick={() =>
          form.insertListItem(
            'locations',
            {
              description: form.getValues().locations?.[index].description,
              url: form.getValues().locations?.[index].url,
              randomId: randomId(),
            },
            index + 1
          )
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
        onClick={() => form.removeListItem('locations', index)}
        style={{ alignSelf: 'end' }}
        size="lg"
      >
        <IconTrash />
      </ActionIcon>
    </Group>
  ));

  return (
    <form className={props.className}>
      {fields}

      <Button
        variant="light"
        mt="md"
        onClick={() =>
          form.insertListItem('locations', {
            description: '',
            url: '',
            randomId: randomId(),
          })
        }
        leftSection={<IconPlus />}
      >
        Add next
      </Button>
    </form>
  );
}
