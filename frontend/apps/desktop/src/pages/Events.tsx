import { useEffect } from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, flexRender} from '@tanstack/react-table';

import { sampleData, Data } from '../data/eventsSampleData';

export default function Events() {
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
      data: sampleData,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    ///* CORS issues with the backend API (using sample API to test for now)
    useEffect(() => {
      const fetchData = async () => {
          fetch('https://catfact.ninja/fact')
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error("Error: ", error));
      };

      fetchData();
    }, []);
    //*/

    return(
      <div className="relative contentContainer ps-10 textColourDark">
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
      </div>
    )
}