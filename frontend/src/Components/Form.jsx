import React, { useState, useEffect } from 'react';
import { Button, FormGroup, FormControl, FormLabel, Box } from '@mui/material';
import InputComponent from './InputComponent';
import fields from '../config/field_info';
import fake_res from '../config/fake_res';

const Form = (props) => {

    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = field.type === "boolean" ? false : "";
            return acc;
        }, {})
    );

    const [formDataErr, setFormDataErr] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = false;
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: val,
        }));
        // console.log(formData[name], fields[name]);
    };

    useEffect(() => {
        Object.keys(formData).forEach( (key) => {
            let isErr = false;

            let f = fields.filter((f) => f.name === key)[0];

            // check for empty
            if (formData[key] === "") isErr = true;
            
            // check type restrict
            // not implemented

            // check range
            if (f.range !== undefined && f.range.length === 2){
                if (formData[key] < f.range[0] || formData[key] > f.range[1]){
                    isErr = true;
                }
            }
            setFormDataErr((prevData) => ({
                ...prevData,
                [key]: isErr,
            }));
        });
        
    }, [formData])

    const handleSubmit = async () => {
        // Submit formData to Flask backend
        const response = await fetch('http://140.117.60.168:80/api/v1/survival_predction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then( function (response){
            if (!response.ok) {
                throw new Error('Failed to submit form data');
            }
            return response.json();
        }).then( (myJson) => {
            console.log(myJson);
            myJson.forEach((e) => {
                props.setResult((prevData) => ({
                    ...prevData,
                    [e.Treatment]: e.Predicted_Time,
                }));
            });
        });

        // using fake result
        // const myJson = fake_res
        // console.log(myJson);
        // console.warn("this is fake result!");
        // myJson.forEach((e) => {
        //     props.setResult((prevData) => ({
        //         ...prevData,
        //         [e.Treatment]: e.Predicted_Time,
        //     }));
        // });
    };
    return (
        <Box
            // component="form"
            display="flex"
            alignItems="left"
            flexDirection="column"
            gap={4}
            p={2}
            sx={{ border: '1px solid #aeaeae', borderRadius: '10px', width: '100%', height: 'fit-content' }}
            noValidate
            autoComplete="off"
        >
                <FormControl component="fieldset">
                    <FormLabel component="legend">Patient Information</FormLabel>
                    <FormGroup>
                        {fields.map((field) => {
                            return(<InputComponent field={field} handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} formDataErr={formDataErr}/>)
                        })}
                    </FormGroup>
                </FormControl>
                <Button 
                    variant="contained"
                    color="primary"
                    sx={{width: "100%"}}
                    onClick={handleSubmit}
                    disabled={!Object.values(formDataErr).every((v) => v === false)}
                >
                    Submit
                </Button>
        </Box>
    );
};

export default Form;