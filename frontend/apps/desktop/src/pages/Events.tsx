import { useState, useEffect } from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, flexRender} from '@tanstack/react-table';
import { FiPlus, FiRotateCw } from "react-icons/fi";

import { sampleData, Data } from '../data/DataFormat';
import EventCard from '../../../../shared/components/weather-map/EventCard';
import '../../../../shared/components/weather-map/EventCard.module.css';

export default function Events() {
    const [data, setData] = useState<Data[]>([]);
    const [refreshKey, setRefreshKey] = useState(false);  // Can be any datatype, just used to trigger a refresh
    const [showPopup, setshowPopup] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
    });

    const columns: ColumnDef<Data>[] = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'start_date', header: 'Start Date' },
      { accessorKey: 'end_date', header: 'End Date' }
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

    const displayPopup = () => {
      setshowPopup(true);
    };

    const handleClose = () => {
        setshowPopup(false);
        setFormData({ name: '', start_date: '', end_date: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });  // Spread operator to create a shallow copy, then appends the new value
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://57.153.210.131:3000/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setshowPopup(false);
                setFormData({ name: '', start_date: '', end_date: '' });
            } else {
                console.error("Failed to create event");
            }
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    const refreshTable = () => {
      setRefreshKey(!refreshKey);
    };

    // return(
    //   <div className="relative contentContainer ps-10 textColourDark flex flex-col bg-green-500">
    //       <table className='w-full'>
    //           <thead className='text-xl'>
    //               {table.getHeaderGroups().map((headerGroup) => (
    //                   <tr key={headerGroup.id}>
    //                   {headerGroup.headers.map((header) => (
    //                       <th key={header.id} className='text-center'>
    //                       {flexRender(header.column.columnDef.header, header.getContext())}
    //                       </th>
    //                   ))}
    //                   </tr>
    //               ))}
    //           </thead>
    //           <tbody>
    //               {table.getRowModel().rows.map((row) => (
    //                   <tr key={row.id} className='hover:text-gray-500 cursor-pointer'>
    //                   {row.getVisibleCells().map((cell) => (
    //                       <td key={cell.id} className='text-center'>
    //                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //                       </td>
    //                   ))}
    //                   </tr>
    //               ))}
    //           </tbody>
    //       </table>


    //         <div>
    //         <EventCard
    //             eventTitle="Lightning strike in Hamilton Gardens"
    //             eventDescription="Burning houses, People crying"
    //             eventTime="16:00"
    //         />
    //         <EventCard
    //             eventTitle="Chain Reaction Collision"
    //             eventDescription="approx. 100 cars and 3 buses involved"
    //             eventTime="17:00"
    //         />
    //         </div>

    //       <div className='w-full h-10 flex justify-center gap-10 mt-5 overflow-hidden'>
    //           <button className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 textColourLight' onClick={displayPopup}>
    //             <FiPlus />
    //           </button>
    //           <button className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 textColourLight' onClick={refreshTable}>
    //             <FiRotateCw />
    //           </button>
    //       </div>
    //       {showPopup && (
    //             <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    //                 <div className="bg-white p-5 rounded shadow-lg w-96">
    //                     <h2 className="text-lg font-bold mb-4">Add New Event</h2>
    //                     <form onSubmit={handleSubmit}>
    //                         <div className="mb-4">
    //                             <label className="block text-sm font-medium">Name</label>
    //                             <input
    //                                 type="text"
    //                                 name="name"
    //                                 value={formData.name}
    //                                 onChange={handleInputChange}
    //                                 className="w-full border px-2 py-1 rounded"
    //                                 required
    //                             />
    //                         </div>
    //                         <div className="mb-4">
    //                             <label className="block text-sm font-medium">Start Date</label>
    //                             <input
    //                                 type="date"
    //                                 name="start_date"
    //                                 value={formData.start_date}
    //                                 onChange={handleInputChange}
    //                                 className="w-full border px-2 py-1 rounded"
    //                                 required
    //                             />
    //                         </div>
    //                         <div className="mb-4">
    //                             <label className="block text-sm font-medium">End Date</label>
    //                             <input
    //                                 type="date"
    //                                 name="end_date"
    //                                 value={formData.end_date}
    //                                 onChange={handleInputChange}
    //                                 className="w-full border px-2 py-1 rounded"
    //                                 required
    //                             />
    //                         </div>
    //                         <div className="flex justify-end gap-2">
    //                             <button
    //                                 type="button"
    //                                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    //                                 onClick={handleClose}
    //                             >
    //                                 Cancel
    //                             </button>
    //                             <button
    //                                 type="submit"
    //                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    //                             >
    //                                 Save
    //                             </button>
    //                         </div>
    //                     </form>
    //                 </div>
    //             </div>
    //         )}
    //   </div>
    // )

    return(
        <div>
              <EventCard
                  eventTitle="Lightning strike in Hamilton Gardens"
                  eventDescription="Burning houses, People crying"
                  eventTime="16:00"
              />
              <EventCard
                  eventTitle="Chain Reaction Collision"
                  eventDescription="approx. 100 cars and 3 buses involved"
                  eventTime="17:00"
              />
              </div>
      )
}