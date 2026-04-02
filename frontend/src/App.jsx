import React from 'react'
import axios from 'axios'


const App = () => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/data/fetchData`, { withCredentials: true });
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  return (
    <div>
      button to fetch data 
      <button
      className='text white font-bold' 
       onClick={fetchData}>Fetch Data</button>
    </div>
  )
}

export default App