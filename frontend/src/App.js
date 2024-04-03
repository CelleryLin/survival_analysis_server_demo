import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './Components/Form';
import Showres from './Components/Showres';
import ShowKm from './Components/ShowKm';
import result_info from './config/result_info';
import create_plot_data from './Components/create_plot_data';

function App() {
  const [result, setResult] = useState(
    result_info.reduce((acc, res) => {
      acc[res.Treatment] = 0;
      return acc;
    }, {})
  );

  const [kmc, setKmc] = useState([]);

  useEffect(() => {
    const kmc_data = create_plot_data(result, kmc);
    setKmc(kmc_data);
    // sort result
  }, [result])

  return (
    <div className="App">
      <header className="App-header">
        <p>肝癌存活分析</p>
        <p style={{fontSize: 14, color: "#fffffff0"}}>中山大學 醫療機電實驗室</p>
      </header>
      <div className='App-container'>
        <div className='forms'>
          <Form setResult={setResult} />
        </div>
        <div className='results'>
          <Showres result={result} />
          <div style={{ margin: "20px" }}></div>
          <ShowKm kmc={kmc} setKmc={setKmc}/>
        </div>
      </div>
    </div>
  );
}

export default App;
