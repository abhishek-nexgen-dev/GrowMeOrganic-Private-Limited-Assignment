import { useState, forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import type { Artwork } from '../type/Artwork.type';

interface OverLayProps {
  currentPageData: Artwork[];
  maxRows: number;
  selectedRowIds: Set<number>;
  onBulkSelect: (items: Artwork[], newIds: Set<number>) => void;
}

const OverLay = forwardRef<OverlayPanel, OverLayProps>(
  ({ currentPageData,  selectedRowIds, onBulkSelect }, ref) => {
    const [bulkSelectCount, setBulkSelectCount] = useState<number | null>(0);

    const handleBulkSelect = () => {
      if (bulkSelectCount && bulkSelectCount > 0) {
        const count = Math.min(bulkSelectCount, currentPageData.length);
        const rowsToSelect = currentPageData.slice(0, count);
        const newSelectedIds = new Set<number>(selectedRowIds);

        for (let i = 0; i < count; i++) {
          newSelectedIds.add(i);
        }

        onBulkSelect(rowsToSelect, newSelectedIds);

        if (ref && 'current' in ref && ref.current) {
          ref.current.hide();
        }
      }
    };

    return (
      <OverlayPanel ref={ref as ForwardedRef<OverlayPanel>} showCloseIcon>
        <div className="p-3">
          <h5>Bulk Select Rows</h5>
          <div className="flex flex-column gap-2">
            <label htmlFor="bulk-select">Number of rows to select:</label>
            <InputNumber
              id="bulk-select"
              value={bulkSelectCount}
              onValueChange={(e: any) => setBulkSelectCount(e.value)}
              min={0}
              max={currentPageData.length}
            />
            <Button
              label="Submit"
              onClick={handleBulkSelect}
              className="p-button-sm mt-2"
            />
          </div>
        </div>
      </OverlayPanel>
    );
  }
);

OverLay.displayName = 'OverLay';

export default OverLay;