import React from 'react'
import { TextField, FormControlLabel, Checkbox, MenuItem } from '@mui/material';

export default function InputComponent(props) {
    const field = props.field;
    // console.log(field.name)
    if (field.type === 'boolean'){
        
        return (
            <FormControlLabel
                key={field.name}
                control={<Checkbox name={field.name} checked={props.formData[field.name]} onChange={props.handleChange} />}
                label={field.showname}
            />
        );
    }
    if (field.type === 'select'){
        return (
            <TextField
                required={field.required !== 0}
                select
                key={field.name}
                name={field.name}
                id={field.name}
                label={field.showname}
                value={props.formData[field.name]}
                error={props.formDataErr[field.name]}
                onChange={props.handleChange}
                sx={{ m: 1 }}
                variant="outlined"
                margin="normal"
            >
                {Object.entries(field.choice).map(([key, val]) => (
                    <MenuItem key={val} value={val}>
                        {key}
                    </MenuItem>
                ))}
            </TextField>
        );
    }
    if (field.type === 'number'){
        return (
            <TextField
                required={field.required !== 0}
                key={field.name}
                name={field.name}
                id={field.name}
                label={field.showname}
                type='number'
                value={props.formData[field.name]}
                error={props.formDataErr[field.name]}
                onChange={props.handleChange}
                sx={{ m: 1,  }}
                variant="outlined"
                margin="normal"
            />
        );
    }
    if (field.type === 'name'){
        return (
            <TextField
                required={field.required !== 0}
                key={field.name}
                name={field.name}
                id="Patient_name"
                label={field.showname}
                value={props.formData[field.name]}
                error={props.formDataErr[field.name]}
                onChange={props.handleChange}
                sx={{ m: 1,  }}
                variant="outlined"
                margin="normal"
            />
        );
    }

    return null; // return null for unsupported field types
}
