import type { Artwork } from "./Artwork.type";

export interface OverLayProps {
    currentPageData: Artwork[];
    maxRows: number;
    selectedRowIds: Set<number>;
    onBulkSelect: (selectedItems: Artwork[], newSelectedIds: Set<number>) => void;
  }