import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const nav = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const generateRandomData = () => {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 10);
  };

  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [
      {
        data: generateRandomData(),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const pressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      setSearchValue(searchInput);
      if (searchInput.toLowerCase() == 'map'){
        nav('/map');
      }
      if (searchInput.toLowerCase() == 'events'){
        nav('/events');
      }
      if (searchInput.toLowerCase() == 'settings'){
        nav('/settings');
      }
    }
  };

  return (
    <div className="contentContainer textColourDark p-6">
      <div className="mx-auto">
        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          label="Go to page..."
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={pressEnter} 
        />
      </div>
      
      <div className="h-3 mt-6">
      </div>

      <div className="boxContainerWrapper">   
        <div className='boxContainer'>
            <h2>Events</h2>
            <p> list of events / favorite events? </p>
        </div>

        <div className='boxContainer'>
            <h2 style={{ textAlign: 'center' }}>Random chart</h2>
            <Doughnut data={data} />
        </div>

        <div className='boxContainer'>
            <h2 style = {{ textAlign:'center' }}>Other random chart</h2>
            <Bar data={data} />
        </div>
      </div>
    </div>
  );
}
