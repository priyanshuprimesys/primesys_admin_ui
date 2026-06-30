/* eslint-disable @typescript-eslint/no-unused-vars */
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // Augment the ColumnMeta interface to include custom properties
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'number' | 'range';
  }
}