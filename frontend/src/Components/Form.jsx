import React, { useState, useEffect } from 'react';
import { Button, FormGroup, FormControl, FormLabel, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import semver from 'semver';
import InputComponent from './InputComponent';
import fields from '../config/field_info';
import fake_res from '../config/fake_res';
import minimun_required_version from '../config/requirements';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Form = (props) => {

    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = field.type === "boolean" ? false : "";
            return acc;
        }, {})
    );

    const [formDataErr, setFormDataErr] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = (false || !field.required);
            return acc;
        }, {})
    );

    const [fileUploaded, setFileUploaded] = useState(0);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: val,
        }));
        // console.log(formData[name], fields[name]);
    };

    const handleSave = (e) => {
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify({version: props.appVersion, patient_name: formData.Name, data: formData})], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = formData.Name === "" ? "info.json": (formData.Name+".json");
        a.click();
    }

    const handleLoad = async (e) => {
        const file = e.target.files[0];
        e.target.value = null;
        e.target.files = null;

        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(file);
    }

    const onReaderLoad = (e) => {
        var obj = JSON.parse(e.target.result);

        // data check
        var isValid = uploaded_data_check(obj);
        if(isValid[0]){
            // updata formData
            setFormData({
                ...obj.data
            });
            // trigger submit button
            setFileUploaded(1);
        }
        else {
            console.log(isValid[1])
        }
    }

    const uploaded_data_check = (obj) => {

        // struct check
        if (obj.version === undefined || obj.data === undefined || obj.patient_name === undefined || Object.keys(obj).length !== 3){
            return [false, "invalid data"];
        }

        // version check
        const ver_check = semver.satisfies(obj.version, `>= ${minimun_required_version}`) // true
        if (!ver_check) return [false, `data version >= ${minimun_required_version} is required`];

        // field check
        const true_field = [];
        fields.forEach(e => {
            true_field.push(e.name);
        })
        const input_field = Object.keys(obj.data)
        if(true_field.sort().join(',') !== input_field.sort().join(',')){
            return [false, `field error`];
        }
        return [true, 'file checked'];
    }

    useEffect(() => {
        Object.keys(formData).forEach( (key) => {
            let isErr = false;

            let f = fields.filter((f) => f.name === key)[0];

            // check for empty
            if (formData[key] === "" && f.required === 1) isErr = true;
            
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

    useEffect(() => {
        if (fileUploaded) {
            handleSubmit();
            // this implmentation is not good.
            // avoid calling setFileUploaded in useEffect.
            setFileUploaded(0);
        }
    }, [fileUploaded]);

    const handleSubmit = async () => {
        // Submit formData to Flask backend
        const response = await fetch('http://140.117.60.169:80/api/v1/survival_predction', {
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
            // console.log(myJson);
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
            <FormLabel component="legend">Patient Information</FormLabel>
            <Button 
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="contained"
                color="primary"
                sx={{width: "100%"}}
                
                startIcon={<CloudUploadIcon />}
            >
                Load From Data
                <VisuallyHiddenInput type="file" onChange={handleLoad}/>
            </Button>
            <FormControl component="fieldset">
                <FormGroup>
                    {fields.map((field) => {
                        return(<InputComponent field={field} handleChange={handleChange} handleSubmit={handleSubmit} formData={formData} formDataErr={formDataErr}/>)
                    })}
                </FormGroup>
            </FormControl>
            <Button
                id='SubmitButton'
                variant="contained"
                color="primary"
                sx={{width: "100%"}}
                onClick={handleSubmit}
                disabled={!Object.values(formDataErr).every((v) => v === false)}
            >
                Submit
            </Button>
            <Button 
                variant="contained"
                color="secondary"
                sx={{width: "100%"}}
                onClick={handleSave}
                disabled={!Object.values(formDataErr).every((v) => v === false)}
                startIcon={<SaveIcon />}
            >
                Save Patient Data
            </Button>
        </Box>
    );
};

export default Form;
