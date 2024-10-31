import React from 'react';
import QRCode from 'react-qr-code';
import { Group } from '@mantine/core';

export interface SheetConfig {
  columns: number;
  rows: number;
  bodyPaddingTop: number;
  bodyPaddingRight: number;
  bodyPaddingBottom: number;
  bodyPaddingLeft: number;
  cellHorizontalGap: number;
  cellVerticalGap: number;
  cellWidth: number;
  cellHeight: number;
  cellPaddingTop: number;
  cellPaddingRight: number;
  cellPaddingBottom: number;
  cellPaddingLeft: number;
  pageWidth: number;
  pageHeight: number;
  unit: 'mm';
}

export interface BaseCellContent {
  type: string;
  description: string;
}

export interface QrCodeDescriptionCellContent extends BaseCellContent {
  type: 'qr-code-with-description';
  qrCodeText: string;
  description: string;
}

export interface EmptyCellContent extends BaseCellContent {
  type: 'empty';
  description: '';
}

export type CellContent = QrCodeDescriptionCellContent | BaseCellContent | EmptyCellContent;

function SheetCell(props: {
  columnIndex: number;
  rowIndex: number;
  config: SheetConfig;
  showBorders: boolean;
  content: CellContent;
}) {
  const { columnIndex, rowIndex, config, showBorders, content } = props;
  const {
    cellWidth,
    cellHorizontalGap,
    cellHeight,
    cellPaddingTop,
    cellPaddingRight,
    cellPaddingBottom,
    cellPaddingLeft,
    unit,
  } = config;
  let inner;
  if (content.type === 'qr-code-with-description') {
    inner = (
      <Group preventGrowOverflow style={{ maxHeight: '100%', height: '100%' }}>
        <div style={{ flex: 0, height: '100%' }}>
          <QRCode
            size={256}
            viewBox="0 0 256 256"
            style={{ maxHeight: '100%', width: 'auto' }}
            value={content.qrCodeText}
          />
        </div>
        <div style={{ flex: 1, whiteSpace: 'break-spaces' }}>{content.description}</div>
      </Group>
    );
  } else {
    inner = <>{content.description}</>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc((${columnIndex} * ${cellWidth}${unit}) + (${columnIndex} * ${cellHorizontalGap}${unit}))`,
        top: `calc(${rowIndex} * ${cellHeight}${unit})`,
        //backgroundColor: 'rgba(200, 0, 0, 0.25)',
        width: `${cellWidth}${unit}`,
        height: `${cellHeight}${unit}`,
        //padding: cellPadding,
        padding: `${cellPaddingTop}${unit} ${cellPaddingRight}${unit} ${cellPaddingBottom}${unit} ${cellPaddingLeft}${unit}`,
        border: showBorders ? '1px solid black' : '0',
        borderRadius: '10px',
      }}
    >
      {inner}
    </div>
  );
}

export interface Props {
  config: SheetConfig;
  showBorders: boolean;
  elements: CellContent[];
}

export const Sheet = React.forwardRef((props: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { config, showBorders, elements } = props;
  const {
    bodyPaddingTop,
    bodyPaddingRight,
    bodyPaddingBottom,
    bodyPaddingLeft,
    pageWidth,
    pageHeight,
    unit,
  } = config;

  const style: React.CSSProperties = {
    margin: 0,
    padding: `${bodyPaddingTop}${unit} ${bodyPaddingRight}${unit} ${bodyPaddingBottom}${unit} ${bodyPaddingLeft}${unit}`,
    width: `${pageWidth}${unit}`,
    height: `${pageHeight}${unit}`,
    position: 'relative',
    border: showBorders ? '1px solid black' : '',
  };

  return (
    <div style={style} ref={ref}>
      <div style={{ position: 'relative' }}>
        {new Array(config.rows).fill(0).map((_, rowIndex) =>
          new Array(config.columns).fill(1).map((_, columnIndex) => {
            const index = rowIndex * config.columns + columnIndex;

            return (
              <SheetCell
                key={index}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                config={config}
                showBorders={showBorders}
                content={elements[index] ?? { type: 'empty', description: '' }}
              />
            );
          })
        )}
      </div>
    </div>
  );
});

export default Sheet;
