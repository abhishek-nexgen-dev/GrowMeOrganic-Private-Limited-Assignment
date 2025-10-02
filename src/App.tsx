import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import axios from 'axios';

import type { Artwork } from './type/Artwork.type';
import OverLay from './Components/OverLay';

const App: React.FC = () => {
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [currentPageData, setCurrentPageData] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [selectedRowPositions, setSelectedRowPositions] = useState<Set<number>>(new Set());

  const overlayPanel = useRef<OverlayPanel>(null);

  const fetchData = async (page: number) => {
    try {
      const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`);
      const { data, pagination } = res.data;
      setCurrentPageData(data);
      setTotalRecords(pagination.total);
      applySelectionsByPosition(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const applySelectionsByPosition = (data: Artwork[]) => {
    if (!selectedRowPositions.size) {
      setSelectedRows([]);
      return;
    }
    setSelectedRows(data.filter((_, idx) => selectedRowPositions.has(idx)));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const onPageChange = (event: { first: number; rows: number; page?: number }) => {
    const newPage = Math.floor(event.first / event.rows) + 1;
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelection = e.value;
    setSelectedRows(newSelection);
    
    const newPositions = new Set<number>();
    currentPageData.forEach((item, idx) => {
      if (newSelection.some(row => row.id === item.id)) {
        newPositions.add(idx);
      }
    });
    
    setSelectedRowPositions(newPositions);
  };

  const handleBulkSelect = (items: Artwork[], newIds: Set<number>) => {
    setSelectedRowPositions(newIds);
    setSelectedRows(items);
  };

  const titleHeader = (
    <div className="flex align-items-center justify-content-between">
      <Button
        icon="pi pi-chevron-down"
        className="p-button-text p-button-sm"
        onClick={e => overlayPanel.current?.toggle(e)}
      />
      Title
    </div>
  );

  return (
    <div className="p-12 bg-gray-500">
      <DataTable
        value={currentPageData}
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        selectionMode="multiple"
        className="rounded-lg overflow-hidden shadow-lg mb-4 bg-white"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header={titleHeader} />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 20]}
      />

      <OverLay
        ref={overlayPanel}
        currentPageData={currentPageData}
        maxRows={rows}
        selectedRowIds={selectedRowPositions}
        onBulkSelect={handleBulkSelect}
      />
    </div>
  );
};

export default App;