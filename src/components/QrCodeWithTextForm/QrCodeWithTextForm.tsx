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
  registerSetFormValue?: (setFormValue: (newValue: FormValues['entries']) => void) => void;
  defaultValue: FormValues['entries'];
  onValueChange: (newValue: FormValues['entries']) => void;
}

export type QrCodeWithTextFormValue = {
  text?: string;
  qrCodeContent?: string;
  randomId: string;
}[];

type FormValues = {
  entries?: QrCodeWithTextFormValue;
};

export function QrCodeWithTextForm(props: Props) {
  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      entries: props.defaultValue,
    },
    onValuesChange(values) {
      props.onValueChange(values.entries);
    },
  });

  useEffect(() => {
    props.registerSetFormValue?.((newValue) => {
      form.setValues({ entries: newValue });
      form.resetDirty({ entries: newValue });
    });
  }, []);

  const fields = form.getValues().entries?.map((item, index) => (
    <Group key={item.randomId} mt="sm">
      <Textarea
        flex={1}
        label="Text"
        placeholder="Text"
        key={form.key(`entries.${index}.text`)}
        {...form.getInputProps(`entries.${index}.text`)}
        autosize
      />
      <TextInput
        flex={1}
        style={{ alignSelf: 'end' }}
        label="QR Code Content"
        placeholder="QR Code Content"
        key={form.key(`entries.${index}.qrCodeContent`)}
        {...form.getInputProps(`entries.${index}.qrCodeContent`)}
      />
      <ActionIcon
        variant="light"
        aria-label="Duplicate"
        onClick={() =>
          form.insertListItem(
            'entries',
            {
              text: form.getValues().entries?.[index].text,
              qrCodeContent: form.getValues().entries?.[index].qrCodeContent,
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
        onClick={() => form.removeListItem('entries', index)}
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
          form.insertListItem('entries', {
            text: '',
            qrCodeContent: '',
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
