import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { Grid, InputLabel, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SheetConfig } from '../Sheet/Sheet';

export interface Props {
  initialValue: SheetConfig;
  onValueChange: (newValue: SheetConfig) => void;
}

const schema = z.object({
  columns: z.number().min(1),
  rows: z.number().min(1),
  bodyPaddingTop: z.number().min(0),
  bodyPaddingRight: z.number().min(0),
  bodyPaddingBottom: z.number().min(0),
  bodyPaddingLeft: z.number().min(0),
  cellHorizontalGap: z.number().min(0),
  cellVerticalGap: z.number().min(0),
  cellWidth: z.number().min(1),
  cellHeight: z.number().min(1),
  cellPaddingTop: z.number().min(0),
  cellPaddingRight: z.number().min(0),
  cellPaddingBottom: z.number().min(0),
  cellPaddingLeft: z.number().min(0),
  pageWidth: z.number().min(1),
  pageHeight: z.number().min(1),
  unit: z.literal('mm'),
});
type FormData = z.infer<typeof schema>;

export function SheetConfigForm(props: Props) {
  const form = useForm<FormData>({
    mode: 'uncontrolled',
    initialValues: {
      ...props.initialValue,
    },
    validate: zodResolver(schema),
    onValuesChange(values) {
      props.onValueChange(values);
    },
  });

  return (
    <form>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Rows"
            key={form.key('rows')}
            placeholder="Number of rows"
            min={1}
            {...form.getInputProps('rows')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Columns"
            key={form.key('columns')}
            placeholder="Number of columns"
            min={1}
            {...form.getInputProps('columns')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputLabel>Body Padding</InputLabel>
          <Grid>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <NumberInput
                label="Top"
                key={form.key('bodyPaddingTop')}
                placeholder="Body Padding Top"
                min={1}
                {...form.getInputProps('bodyPaddingTop')}
              />
            </Grid.Col>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <NumberInput
                label="Left"
                key={form.key('bodyPaddingLeft')}
                placeholder="Body Padding Left"
                min={1}
                {...form.getInputProps('bodyPaddingLeft')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <div />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Right"
                key={form.key('bodyPaddingRight')}
                placeholder="Body Padding Right"
                min={1}
                {...form.getInputProps('bodyPaddingRight')}
              />
            </Grid.Col>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <NumberInput
                label="Bottom"
                key={form.key('bodyPaddingBottom')}
                placeholder="Body Padding Bottom"
                min={1}
                {...form.getInputProps('bodyPaddingBottom')}
              />
            </Grid.Col>
            <Grid.Col span={4} />
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputLabel>Cell Padding</InputLabel>
          <Grid>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <NumberInput
                label="Top"
                key={form.key('cellPaddingTop')}
                placeholder="Cell Padding Top"
                min={1}
                {...form.getInputProps('cellPaddingTop')}
              />
            </Grid.Col>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <NumberInput
                label="Left"
                key={form.key('cellPaddingLeft')}
                placeholder="Cell Padding Left"
                min={1}
                {...form.getInputProps('cellPaddingLeft')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <div />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Right"
                key={form.key('cellPaddingRight')}
                placeholder="Cell Padding Right"
                min={1}
                {...form.getInputProps('cellPaddingRight')}
              />
            </Grid.Col>
            <Grid.Col span={4} />
            <Grid.Col span={4}>
              <NumberInput
                label="Bottom"
                key={form.key('cellPaddingBottom')}
                placeholder="Cell Padding Bottom"
                min={1}
                {...form.getInputProps('cellPaddingBottom')}
              />
            </Grid.Col>
            <Grid.Col span={4} />
          </Grid>
        </Grid.Col>
      </Grid>
    </form>
  );
}
