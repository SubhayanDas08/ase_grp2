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

    return(
        <div className="relative secondaryColour rounded-lg ps-10">
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
                        <tr key={row.id}>
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