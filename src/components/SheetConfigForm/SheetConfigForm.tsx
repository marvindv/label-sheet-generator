import { IconDots, IconEye, IconFileZip, IconTrash } from '@tabler/icons-react';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import {
  ActionIcon,
  Card,
  Fieldset,
  Grid,
  Group,
  InputLabel,
  Menu,
  NumberInput,
  rem,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { SheetConfig } from '../Sheet/Sheet';
import classes from './SheetConfigForm.module.css';

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

  const unit = form.getValues().unit;

  return (
    <form>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={500}>Sheet configuration</Text>
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconFileZip style={{ width: rem(14), height: rem(14) }} />}
                >
                  Download zip
                </Menu.Item>
                <Menu.Item leftSection={<IconEye style={{ width: rem(14), height: rem(14) }} />}>
                  Preview all
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                  color="red"
                >
                  Delete all
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Card.Section>

        <Card.Section inheritPadding withBorder pt="md" pb="lg">
          <Fieldset legend="Sheet Format" variant="unstyled">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Page height"
                      key={form.key('pageHeight')}
                      placeholder="Page height"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('pageHeight')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Page width"
                      key={form.key('pageWidth')}
                      placeholder="Page width"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('pageWidth')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Rows"
                      key={form.key('rows')}
                      placeholder="Number of rows"
                      min={1}
                      {...form.getInputProps('rows')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Columns"
                      key={form.key('columns')}
                      placeholder="Number of columns"
                      min={1}
                      {...form.getInputProps('columns')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Horizontal cell gap"
                      key={form.key('cellHorizontalGap')}
                      placeholder="Horizontal cell gap"
                      min={0}
                      suffix={unit}
                      {...form.getInputProps('cellHorizontalGap')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Vertical cell gap"
                      key={form.key('cellVerticalGap')}
                      placeholder="Vertical cell gap"
                      min={0}
                      suffix={unit}
                      {...form.getInputProps('cellVerticalGap')}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Grid className={classes.topRightBottomLeftFields}>
                  <Grid.Col span={12} hiddenFrom="sm">
                    <InputLabel>Page Padding</InputLabel>
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Top"
                      key={form.key('bodyPaddingTop')}
                      placeholder="Body Padding Top"
                      aria-label="Body Padding Top"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('bodyPaddingTop')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Left"
                      key={form.key('bodyPaddingLeft')}
                      placeholder="Body Padding Left"
                      aria-label="Body Padding Left"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('bodyPaddingLeft')}
                    />
                  </Grid.Col>
                  <Grid.Col
                    aria-hidden
                    span={4}
                    visibleFrom="sm"
                    style={{ alignContent: 'center' }}
                  >
                    <InputLabel display="block">&nbsp;</InputLabel>
                    <InputLabel>Page Padding</InputLabel>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Right"
                      key={form.key('bodyPaddingRight')}
                      placeholder="Body Padding Right"
                      aria-label="Body Padding Right"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('bodyPaddingRight')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Bottom"
                      key={form.key('bodyPaddingBottom')}
                      placeholder="Body Padding Bottom"
                      aria-label="Body Padding Bottom"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('bodyPaddingBottom')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                </Grid>
              </Grid.Col>
            </Grid>
          </Fieldset>
        </Card.Section>
        <Card.Section inheritPadding withBorder pt="md" pb="lg">
          <Fieldset legend="Cell Format" variant="unstyled">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Cell height"
                      key={form.key('cellHeight')}
                      placeholder="Cell height"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('cellHeight')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Cell width"
                      key={form.key('cellWidth')}
                      placeholder="Cell width"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('cellWidth')}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Grid className={classes.topRightBottomLeftFields}>
                  <Grid.Col span={12} hiddenFrom="sm">
                    <InputLabel>Cell Padding</InputLabel>
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Top"
                      key={form.key('cellPaddingTop')}
                      placeholder="Cell Padding Top"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('cellPaddingTop')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Left"
                      key={form.key('cellPaddingLeft')}
                      placeholder="Cell Padding Left"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('cellPaddingLeft')}
                    />
                  </Grid.Col>
                  <Grid.Col
                    aria-hidden
                    span={4}
                    visibleFrom="sm"
                    style={{ alignContent: 'center' }}
                  >
                    <InputLabel display="block">&nbsp;</InputLabel>
                    <InputLabel>Cell Padding</InputLabel>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Right"
                      key={form.key('cellPaddingRight')}
                      placeholder="Cell Padding Right"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('cellPaddingRight')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NumberInput
                      label="Bottom"
                      key={form.key('cellPaddingBottom')}
                      placeholder="Cell Padding Bottom"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('cellPaddingBottom')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4} visibleFrom="sm" />
                </Grid>
              </Grid.Col>
            </Grid>
          </Fieldset>
        </Card.Section>
      </Card>
    </form>
  );
}
