import { useState, useEffect } from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, flexRender} from '@tanstack/react-table';
import { FiPlus, FiRotateCw } from "react-icons/fi";

import { sampleData, Data } from '../data/DataFormat';

export default function Events() {
    const [data, setData] = useState<Data[]>([]);
    const [refreshKey, setRefreshKey] = useState(false);  // Can be any datatype, just used to trigger a refresh

    const columns: ColumnDef<Data>[] = [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'start_date',
        header: 'Start Date',
      },
      {
        accessorKey: 'end_date',
        header: 'End Date',
      },
    ];
    
    const table = useReactTable({
      data: data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
      const fetchData = async () => {
          fetch('http://57.153.210.131:3000/events')
          .then(response => response.json())
          .then(data => setData(data))
          .then(() => console.log("Data refresh"))
          .catch(error => console.error("Error: ", error));
      };

      fetchData();
    }, [refreshKey]);

    const addEvent = () => {
      console.log("Add event");
    };

    const refreshTable = () => {
      setRefreshKey(!refreshKey);
    };

    return(
      <div className="relative contentContainer ps-10 textColourDark flex flex-col bg-green-500">
          <table className='w-full'>
              <thead className='text-xl'>
                  {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                          <th key={header.id} className='text-center'>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                      ))}
                      </tr>
                  ))}
              </thead>
              <tbody>
                  {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className='hover:text-gray-500 cursor-pointer'>
                      {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className='text-center'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                      ))}
                      </tr>
                  ))}
              </tbody>
          </table>
          <div className='w-full h-10 flex justify-center gap-10 mt-5 overflow-hidden'>
              <button className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 textColourLight' onClick={addEvent}>
                <FiPlus />
              </button>
              <button className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 textColourLight' onClick={refreshTable}>
                <FiRotateCw />
              </button>
          </div>
      </div>
    )
}