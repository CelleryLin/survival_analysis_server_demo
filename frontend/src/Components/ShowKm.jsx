import React, { useState, useEffect } from 'react'
import { FormControlLabel, Checkbox, Button, FormLabel, Box, ButtonGroup } from '@mui/material';
import Plot from 'react-plotly.js';
import result_infos from '../config/result_info';

export default function ShowKm(props) {
  const {kmc, setKmc} = props;

  const [style, setStyle] = useState({
    title: 'KM Curve',
    width: 0,
    height: 0,
    yaxis: {
      title: 'Probability',
      automargin: true,
    },
    xaxis: {
      title: 'Time (month)',
      automargin: true,
    },
    legend: {
      itemclick: false, // Disable legend click events
      itemdoubleclick: false,
    },
  })


  const [treatmentvis, setTreatmentvis] = useState(
    result_infos.reduce((acc, res) => {
      if (res.Treatment === "Best_support_care"){
        acc[res.Treatment] = true;
        acc[res.Treatment+"_ci"] = true;
      }
      else {
        acc[res.Treatment] = false;
        acc[res.Treatment+"_ci"] = false;
      }
      return acc;
    }, {})
  )

  useEffect( () => {
    setStyle((prev) => {
      prev.width = document.getElementById("chart_box").offsetWidth * 0.9;
      prev.height = prev.width * 0.7
      return prev;
    });
  }, [kmc]);

  useEffect( () => {
    // change visabillity of some data in kmc
    var prevkmc = [...kmc];
    Object.keys(treatmentvis).forEach( (tr) => {
      if (kmc.length >= 0){
        var this_ele_index = prevkmc.findIndex(e => e.name === tr);
        var this_ele_ci_index = prevkmc.findIndex(e => e.name === tr+"_ci");
        if (this_ele_index !== -1) {
          prevkmc[this_ele_index] = {
            ...prevkmc[this_ele_index],
            plotdata: {
              ...prevkmc[this_ele_index].plotdata,
              visible: treatmentvis[tr] ? true : 'legendonly'
            }
          };
        }
        if (this_ele_ci_index !== -1) {
          console.log("hihi")
          prevkmc[this_ele_ci_index] = {
            ...prevkmc[this_ele_ci_index],
            plotdata: {
              ...prevkmc[this_ele_ci_index].plotdata,
              visible: treatmentvis[tr+"_ci"] ? true : false
            }
          };
        }
      }
    })
    setKmc(prevkmc);
  }, [treatmentvis]);

  const handleLegendChange = (e) => {
    const { name, checked } = e.target;
    setTreatmentvis( (prev) => ({
      ...prev,
      [name]: checked,
      [name+"_ci"]: checked,
    }))
  }

  const handleSelectAll = () => {
    let tr = {...treatmentvis};
    Object.keys(tr).forEach((e) => {
      tr[e] = true;
    })
    setTreatmentvis(tr);
  }

  const handleSelectNone = () => {
    let tr = {...treatmentvis};
    Object.keys(tr).forEach((e) => {
      tr[e] = false;
    })
    setTreatmentvis(tr);
  }

  return (
    <Box
      id='chart_box'
      display="flex"
      gap={4}
      p={2}
      sx={{
        border: '1px solid #aeaeae',
        borderRadius: '10px',
        width: '100%'
      }}
      noValidate
      autoComplete="off"
    >
      <div className='output_container'>
        <FormLabel component="legend">Chart</FormLabel>
        <div className='chart_container' id='chart_container'>
          <Plot
            data={kmc.map( e => e.plotdata )}
            layout={style}
          />
        </div>
        <Box
          gap={4}
          p={2}
          sx={{
            border: '1px solid #aeaeae',
            borderRadius: '10px',
          }}
          noValidate
          autoComplete="off"
        >
          <ButtonGroup variant="outlined" aria-label="Basic button group" sx={{padding: '2px'}}>
            <Button onClick={handleSelectAll}>Select All</Button>
            <Button onClick={handleSelectNone}>Select None</Button>
          </ButtonGroup>
          <div>
            {
              result_infos.map((e) => {
                
                let co = e.Trace_color;
                let sh = e.Show_name;
                return (
                  <FormControlLabel
                      key={"legvis" + e.Treatment}
                      control={<Checkbox name={e.Treatment} style ={{ color: co }} size="small" onChange={handleLegendChange} checked={treatmentvis[e.Treatment]}/>}
                      label={sh}
                  />
                );
              })
            }
          </div>
        </Box>
      </div>
    </Box>
  )
}



// data={[
//   {
//     x: [1, 2, 3],
//     y: [2, 6, 3],
//     type: 'scatter',
//     mode: 'lines+markers',
//     marker: {color: 'red'},
//   },