import { useMemo, useRef, useState } from 'react';
import { IconBarcode, IconPrinter, IconTransferIn, IconTransferOut } from '@tabler/icons-react';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';
import { z } from 'zod';
import {
  Box,
  Button,
  Center,
  Container,
  FileButton,
  Flex,
  Group,
  Menu,
  Modal,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId, useDisclosure } from '@mantine/hooks';
import {
  QrCodeWithTextForm,
  QrCodeWithTextFormValue,
} from '@/components/QrCodeWithTextForm/QrCodeWithTextForm';
import Sheet, {
  CellContent,
  SHEET_PRESETS,
  SheetConfig,
  sheetConfigSchema,
} from '@/components/Sheet/Sheet';
import { SheetConfigForm } from '@/components/SheetConfigForm/SheetConfigForm';

const sheetConfigFormLocalStorageKey = 'label-sheet-generator/qrCodeWithText/form/sheetConfig';
const entriesFormLocalStorageKey = 'label-sheet-generator/qrCodeWithText/form/location';

const importSchema = z.object({
  qrCodeWithTextPage: z.object({
    sheetConfig: sheetConfigSchema,
    formValue: z.array(
      z.object({
        text: z.string(),
        qrCodeContent: z.string(),
        randomId: z.string(),
      })
    ),
  }),
});

function ASNForm(props: { onSubmit: (args: { startWith: number }) => void }) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      startWith: 1,
    },
    validate: {
      startWith: (val) => (Number.isInteger(val) && val >= 0 ? null : 'Invalid ASN'),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => props.onSubmit(values))}>
      <NumberInput
        withAsterisk
        label="Start with"
        key={form.key('startWith')}
        min={0}
        {...form.getInputProps('startWith')}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Generate</Button>
      </Group>
    </form>
  );
}

export function TextQrCodePage() {
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => {
    const existingValue = localStorage.getItem(sheetConfigFormLocalStorageKey);
    if (existingValue) {
      return JSON.parse(existingValue);
    }

    return SHEET_PRESETS.herma5076;
  });
  const [showBorders, setShowBorders] = useState(true);
  const [isGenerateASNModalOpen, { open: openGenerateASNModal, close: closeGenerateASNModal }] =
    useDisclosure(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: sheetRef });

  const initialEntriesFormValue = useMemo(
    () => JSON.parse(localStorage.getItem(entriesFormLocalStorageKey) || '[]'),
    []
  );
  const [formValue, setFormValue] = useState<QrCodeWithTextFormValue | undefined>(
    initialEntriesFormValue
  );
  const elements = useMemo<CellContent[]>(
    () =>
      formValue?.map((el) => ({
        type: 'qr-code-with-description',
        description: el.text || '',
        qrCodeText: el.qrCodeContent || '',
      })) ?? [],
    [formValue]
  );

  const [previewModelOpened, setPreviewModelOpened] = useState(false);

  // Will be updated by a SheetConfigForm callback to allow setting the SheetConfirgForm form
  // value directly.
  const [updateSheetConfigFormValue, setUpdateSheetConfigFormValue] = useState<
    ((newValue: SheetConfig) => void) | null
  >(null);
  // Will be updated by a QrCodeWithTextForm callback to allow setting the QrCodeWithTextForm form
  // value directly.
  const [updateEntriesFormValue, setUpdateEntriesFormValue] = useState<
    ((newValue: QrCodeWithTextFormValue) => void) | null
  >(null);

  const handleImport = async (payload: File | null) => {
    if (!payload) {
      return;
    }

    const jsonStr = await payload.text();
    const json = JSON.parse(jsonStr);
    const parsed = importSchema.parse(json);
    // sheetConfig and formValue will be updated by the respective components after these calls are
    // made to update their form values.
    updateSheetConfigFormValue?.(parsed.qrCodeWithTextPage.sheetConfig);
    updateEntriesFormValue?.(parsed.qrCodeWithTextPage.formValue);
  };

  const handleExportClick = () => {
    const content = JSON.stringify(
      {
        locationsPage: {
          sheetConfig,
          formValue,
        },
      },
      null,
      2
    );
    const blob = new Blob([content], { type: 'application/json' });
    saveAs(blob, 'qrCodeWithTextLabelSheet.json');
  };

  const handleSheetConfigFormValueChange = (newValue: SheetConfig) => {
    localStorage.setItem(sheetConfigFormLocalStorageKey, JSON.stringify(newValue));
    setSheetConfig(newValue);
  };

  const handleLocationsFormValueChange = (newValue: QrCodeWithTextFormValue | undefined) => {
    localStorage.setItem(entriesFormLocalStorageKey, JSON.stringify(newValue || []));
    setFormValue(newValue);
  };

  return (
    <>
      <Modal
        opened={isGenerateASNModalOpen}
        onClose={closeGenerateASNModal}
        title="Generate ASN Entries"
      >
        <Text c="dimmed" mb="md">
          Generate as many ASNs (short for <i>Archive Serial Numbers</i>) as fit on the sheet,
          starting with the given ASN.
        </Text>
        <ASNForm
          onSubmit={({ startWith }) => {
            closeGenerateASNModal();
            const num = sheetConfig.rows * sheetConfig.columns;
            const newEntries: QrCodeWithTextFormValue = [];
            for (let i = startWith; i < startWith + num; i++) {
              // Format: ASN00001
              const content = `ASN${i.toString().padStart(5, '0')}`;
              newEntries.push({
                text: content,
                qrCodeContent: content,
                randomId: randomId(),
              });
            }

            updateEntriesFormValue?.(newEntries);
          }}
        />
      </Modal>

      <Container>
        <Title order={1}>QR Code with Text</Title>
        <Text mb="lg" c="gray" size="lg">
          Generate a sheet containing a number of stickers that show a multiline markdown enabled
          text and a QR code containing arbitrary content like text or a url.
        </Text>
        <Flex justify="space-between">
          <Menu shadow="md" width={200} position="bottom-start">
            <Menu.Target>
              <Button variant="light">Generate Entries</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Paperless-ngx</Menu.Label>
              <Menu.Item leftSection={<IconBarcode size={14} />} onClick={openGenerateASNModal}>
                ASNs
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Flex justify="flex-end" mb="lg">
            <FileButton onChange={handleImport} accept="application/json">
              {(props) => (
                <Button
                  {...props}
                  mr="md"
                  variant="default"
                  leftSection={<IconTransferIn size="1rem" stroke={1.5} />}
                >
                  Import
                </Button>
              )}
            </FileButton>

            <Button
              variant="default"
              leftSection={<IconTransferOut size="1rem" stroke={1.5} />}
              onClick={handleExportClick}
            >
              Export
            </Button>
          </Flex>
        </Flex>
        <SheetConfigForm
          initialValue={sheetConfig}
          onValueChange={handleSheetConfigFormValueChange}
          registerSetFormValue={(cb) => setUpdateSheetConfigFormValue(() => cb)}
        />

        <Box mt="lg">
          <QrCodeWithTextForm
            defaultValue={initialEntriesFormValue}
            onValueChange={handleLocationsFormValueChange}
            registerSetFormValue={(setFormValue) => {
              setUpdateEntriesFormValue(() => setFormValue);
            }}
          />
        </Box>

        {/* Hidden div that contains the rendered sheet to print. */}
        <div style={{ display: 'none' }}>
          <Sheet ref={sheetRef} config={sheetConfig} showBorders={false} elements={elements} />
        </div>

        <Center>
          <Stack>
            <Button
              size="compact-sm"
              variant="transparent"
              onClick={() => setPreviewModelOpened(true)}
            >
              Show Preview &hellip;
            </Button>
            <Button size="xl" leftSection={<IconPrinter />} onClick={() => reactToPrintFn()}>
              Print
            </Button>
          </Stack>
        </Center>

        <Modal
          opened={previewModelOpened}
          onClose={() => setPreviewModelOpened(false)}
          title="Preview"
          size="full"
        >
          <Center>
            <Sheet config={sheetConfig} showBorders={showBorders} elements={elements} />
          </Center>
          <Center mt="md">
            <Button size="xl" leftSection={<IconPrinter />} onClick={() => reactToPrintFn()}>
              Print
            </Button>
          </Center>
        </Modal>
      </Container>
    </>
  );
}
