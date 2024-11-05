import { useMemo, useRef, useState } from 'react';
import { IconPrinter } from '@tabler/icons-react';
import { useReactToPrint } from 'react-to-print';
import { Button, Center, Container, Modal, Stack, Text, Title } from '@mantine/core';
import { LocationsForm, LocationsFormValue } from '@/components/LocationsForm/LocationsForm';
import Sheet, { CellContent, SheetConfig } from '@/components/Sheet/Sheet';
import { SheetConfigForm } from '@/components/SheetConfigForm/SheetConfigForm';

const herma5076: SheetConfig = {
  columns: 2,
  rows: 7,
  bodyPaddingTop: 15.15,
  bodyPaddingRight: 4.67,
  bodyPaddingBottom: 15.15,
  bodyPaddingLeft: 4.67,
  cellHorizontalGap: 2.54,
  cellVerticalGap: 0,
  cellWidth: 99.06,
  cellHeight: 38.1,
  cellPaddingTop: 5,
  cellPaddingRight: 5,
  cellPaddingBottom: 5,
  cellPaddingLeft: 5,
  pageWidth: 210,
  pageHeight: 297,
  unit: 'mm',
};

const locationsFormLocalStorageKey = 'homebox-label-sheet-generator/locations/form/location';

export function LocationsPage() {
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(herma5076);
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
      <SheetConfigForm initialValue={herma5076} onValueChange={(val) => setSheetConfig(val)} />
      <LocationsForm
        defaultValue={initialLocationsFormValue}
        onValueChange={handleLocationsFormValueChange}
      />

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
