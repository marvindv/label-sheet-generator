import { useEffect, useMemo, useState } from 'react';
import { IconCaretDownFilled, IconCaretUpFilled } from '@tabler/icons-react';
import deepEqual from 'deep-equal';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import {
  ActionIcon,
  Button,
  Card,
  Fieldset,
  Grid,
  Group,
  InputLabel,
  NumberInput,
  rem,
  Select,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  SHEET_PRESET_KEYS,
  SHEET_PRESETS,
  SHEET_PRESETS_NICE_NAMES,
  SheetConfig,
  sheetConfigSchema,
  SheetPresetKey,
} from '../Sheet/Sheet';
import classes from './SheetConfigForm.module.css';

export interface Props {
  initialValue: SheetConfig;
  onValueChange: (newValue: SheetConfig) => void;
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
  registerSetFormValue?: (callback: (newValue: SheetConfig) => void) => void;
}

type FormData = z.infer<typeof sheetConfigSchema>;

export function SheetConfigForm(props: Props) {
  const [currentFormValue, setCurrentFormValue] = useState<FormData>(props.initialValue);
  const form = useForm<FormData>({
    mode: 'uncontrolled',
    initialValues: {
      ...props.initialValue,
    },
    validate: zodResolver(sheetConfigSchema),
    onValuesChange(values) {
      setCurrentFormValue(values);
      props.onValueChange(values);
    },
  });

  useEffect(() => {
    props.registerSetFormValue?.((newValue) => {
      form.setValues(newValue);
      form.resetDirty(newValue);
    });
  }, []);

  const configNiceName = useMemo(() => {
    for (const presetKey of SHEET_PRESET_KEYS) {
      if (deepEqual(SHEET_PRESETS[presetKey], currentFormValue)) {
        return SHEET_PRESETS_NICE_NAMES[presetKey];
      }
    }

    return null;
  }, [currentFormValue]);

  const unit = form.getValues().unit;
  const [opened, { toggle }] = useDisclosure(false);
  const [loadPresetKey, setLoadPresetKey] = useState<string | null>(null);

  const handleLoadPresetClick = () => {
    const newValue = SHEET_PRESETS[loadPresetKey as SheetPresetKey];
    form.setValues(newValue);
    //props.onValueChange(newValue);
    setLoadPresetKey(null);
  };

  return (
    <form>
      <Card shadow="sm" radius="md" withBorder>
        <Card.Section
          withBorder={opened}
          inheritPadding
          mt="0"
          pb={opened ? 'var(--card-padding)' : undefined}
        >
          <Group justify="space-between">
            <Text fw={500}>
              Sheet configuration
              <Text c="dimmed" span>
                : {configNiceName || 'Custom'}
              </Text>
            </Text>
            <ActionIcon onClick={toggle} color="gray" variant="subtle">
              {opened && <IconCaretDownFilled style={{ width: rem(16), height: rem(16) }} />}
              {!opened && <IconCaretUpFilled style={{ width: rem(16), height: rem(16) }} />}
            </ActionIcon>
          </Group>
        </Card.Section>

        <Card.Section
          display={opened ? undefined : 'none'}
          inheritPadding
          withBorder
          pt="md"
          pb="lg"
        >
          <Select
            label="Load a sheet preset"
            placeholder="Pick preset"
            data={SHEET_PRESET_KEYS.map((key) => ({
              label: SHEET_PRESETS_NICE_NAMES[key],
              value: key,
            }))}
            value={loadPresetKey}
            onChange={setLoadPresetKey}
          />
          <Button mt="sm" disabled={!loadPresetKey} onClick={() => handleLoadPresetClick()}>
            Load
          </Button>
        </Card.Section>

        <Card.Section
          display={opened ? undefined : 'none'}
          inheritPadding
          withBorder
          pt="md"
          pb="lg"
        >
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
        <Card.Section
          display={opened ? undefined : 'none'}
          inheritPadding
          withBorder
          pt="md"
          pb="lg"
        >
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
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Cell base font size (in px)"
                      key={form.key('cellBaseFontSizePx')}
                      placeholder="Cell base font size (in px)"
                      min={1}
                      suffix="px"
                      {...form.getInputProps('cellBaseFontSizePx')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <NumberInput
                      label="Cell content gap"
                      key={form.key('cellContentGap')}
                      placeholder="Cell content gap"
                      min={1}
                      suffix={unit}
                      {...form.getInputProps('cellContentGap')}
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
