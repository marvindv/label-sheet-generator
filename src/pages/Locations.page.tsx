import { useMemo, useRef, useState } from 'react';
import { IconPrinter } from '@tabler/icons-react';
import { useReactToPrint } from 'react-to-print';
import { Button, Center, Container, Modal, Stack, Text, Title } from '@mantine/core';
import { LocationsForm, LocationsFormValue } from '@/components/LocationsForm/LocationsForm';
import Sheet, { CellContent, SheetConfig } from '@/components/Sheet/Sheet';

const herma5076: SheetConfig = {
  columns: 2,
  rows: 7,
  // As advertised:
  // bodyPadding: '15.15mm 4.67mm 15.15mm 4.67mm',
  // As measured:
  bodyPadding: '16mm 4.67mm 16mm 4.67mm',
  // The cell margin of every cell:not(:first-of-type)
  // cellMargin: "0mm 0mm 0mm 2.54mm",
  cellHorizontalGap: '2.54mm',
  cellVerticalGap: '0mm',
  cellWidth: '99.06mm',
  cellHeight: '38.1mm',
  cellPadding: '5mm 5mm 5mm 5mm',
  pageWidth: '210mm',
  pageHeight: '297mm',
};

const locationsFormLocalStorageKey = 'homebox-label-sheet-generator/locations/form/location';

export function LocationsPage() {
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(herma5076);
  const [showBorders, setShowBorders] = useState(true);

  const sheetRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef: sheetRef });

  const [formValue, setFormValue] = useState<LocationsFormValue | undefined>(undefined);
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

  const handleLocationFormValueChange = (newValue: LocationsFormValue | undefined) => {
    localStorage.setItem(locationsFormLocalStorageKey, JSON.stringify(newValue || []));
    setFormValue(newValue);
  };

  return (
    <Container>
      <Title order={1}>Description and URLs</Title>
      <Text mb="lg" c="gray" size="lg">
        Generate a sheet containing a number of stickers that show a multiline description and an qr
        code leading to the specified link.
      </Text>
      <LocationsForm
        defaultValue={JSON.parse(localStorage.getItem(locationsFormLocalStorageKey) || '[]')}
        onValueChange={handleLocationFormValueChange}
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
