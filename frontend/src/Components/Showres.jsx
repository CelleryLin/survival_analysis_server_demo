import React from 'react'
import { FormLabel, Box, Grid } from '@mui/material';
import result_infos from '../config/result_info';

export default function Showres(props) {
  const sortedKeys = Object.keys(props.result).sort((a, b) => props.result[b] - props.result[a]);
  return (
    <Box
      component="form"
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
        <FormLabel component="legend">XGBoost Prediction Result (Sorted by the longest prediction)</FormLabel>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {sortedKeys.map((key, i) => (
            <Grid item xs={6}>
              <div>
                <p>{i+1}. {result_infos.filter((e) => e.Treatment === key)[0].Show_name}: <span style={{fontWeight: "bold"}}>{Math.round(parseFloat(props.result[key]) * 100) / 100}</span> month</p>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  )
}
