import { useMemo, useRef, useState } from 'react';
import { IconPrinter } from '@tabler/icons-react';
import { useReactToPrint } from 'react-to-print';
import { Box, Button, Center, Container, Modal, Stack, Text, Title } from '@mantine/core';
import { LocationsForm, LocationsFormValue } from '@/components/LocationsForm/LocationsForm';
import Sheet, { CellContent, SHEET_PRESETS, SheetConfig } from '@/components/Sheet/Sheet';
import { SheetConfigForm } from '@/components/SheetConfigForm/SheetConfigForm';

const sheetConfigFormLocalStorageKey = 'homebox-label-sheet-generator/locations/form/sheetConfig';
const locationsFormLocalStorageKey = 'homebox-label-sheet-generator/locations/form/location';

export function LocationsPage() {
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => {
    console.log('loadItem');
    const existingValue = localStorage.getItem(sheetConfigFormLocalStorageKey);
    if (existingValue) {
      console.log('existingValue');
      return JSON.parse(existingValue);
    }

    return SHEET_PRESETS.herma5076;
  });
  const [showBorders, setShowBorders] = useState(true);

  const sheetRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: sheetRef });

  const initialLocationsFormValue = useMemo(
    () => JSON.parse(localStorage.getItem(locationsFormLocalStorageKey) || '[]'),
    []
  );
  const [formValue, setFormValue] = useState<LocationsFormValue | undefined>(
    initialLocationsFormValue
  );
  const elements = useMemo(
    () =>
      formValue?.map((el) => ({
        type: 'qr-code-with-description' as string,
        description: el.description || '',
        qrCodeText: el.url || '',
      })) ?? ([] as CellContent[]),
    [formValue]
  );

  const [previewModelOpened, setPreviewModelOpened] = useState(false);

  const handleSheetConfigFormValueChange = (newValue: SheetConfig) => {
    console.log('setItem');
    localStorage.setItem(sheetConfigFormLocalStorageKey, JSON.stringify(newValue));
    setSheetConfig(newValue);
  };

  const handleLocationsFormValueChange = (newValue: LocationsFormValue | undefined) => {
    localStorage.setItem(locationsFormLocalStorageKey, JSON.stringify(newValue || []));
    setFormValue(newValue);
  };

  return (
    <Container>
      <Title order={1}>Description and URLs</Title>
      <Text mb="lg" c="gray" size="lg">
        Generate a sheet containing a number of stickers that show a multiline description and an qr
        code leading to a configured link.
      </Text>
      <SheetConfigForm
        initialValue={sheetConfig}
        onValueChange={handleSheetConfigFormValueChange}
      />
      <Box mt="lg">
        <LocationsForm
          defaultValue={initialLocationsFormValue}
          onValueChange={handleLocationsFormValueChange}
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
  );
}
