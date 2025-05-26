import { React, useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import {
    Box,
    Grid,
    TextField,
    Button,
    FormHelperText,
    InputLabel,
    MenuItem,
    Container,
    Stack,
    Typography,
    Paper,
    List,
    Checkbox,
    Alert,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import MUIDataTable from "mui-datatables";
import { useMsal } from '@azure/msal-react';
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";
import { addNewQuestion, isTrackingNumberInUse } from "../services/QuestionServices";
import { getAllObjectives } from "../services/LearningObjectiveServices";

// branding logo
import logo from '../pictures/FM_Family Medicine-WHITE Logo-Horizontal.png'

async function trackingNumberExists(trackingNumber) {
    try {
        const response = await isTrackingNumberInUse(trackingNumber);
        if (!response.ok) {
            console.error('Response not OK. Status:', response.status);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log('Response for tracking number check:', result);
        return result === true ? 'Tracking Number is being used already.' : true;
    } catch (error) {
        console.error('Error in trackingNumberExists:', error);
        throw error; // Rethrow the error to ensure it's caught by the calling function
    }
}



export const NewQuestionPage = () => {
    const navigate = useNavigate();
    const {accounts } = useMsal();

    const name = accounts[0] && accounts[0].name;
    const [dbData, setDbData] = useState();
    const [displayedData, setDisplayedData] = useState([]);

    useEffect(() => {
        const fetchata = async () => {
            const response = await getAllObjectives()
            const data = await response.json();

            const retrievedData = []
            for (let i = 0; i < data.length; i += 1) {
                const rowData = {};
                rowData.heading = data[i]?.objectiveCode?.objectiveHeading;
                rowData.code = data[i]?.objectiveCode?.objectiveCodeId;
                rowData.objectiveNumber = data[i]?.objectiveNumber;
                rowData.description = data[i]?.description;
                rowData.role = data[i]?.facultyRole;
                rowData.type = data[i]?.objectiveType;
                rowData.field = data[i]?.fields;
                retrievedData?.push(rowData);
            }
            setDbData(retrievedData);
            setDisplayedData(retrievedData);
        }
        fetchata();
    }, []);

    const [isSelected, setIsSelected] = useState(false);

    const handleSelect = (e) => {
        if (isSelected) {
            setIsSelected(false);
            setDisplayedData(dbData);

        } else {
            setIsSelected(true);
            setDisplayedData(dbData.filter((d => (d.objectiveNumber === e[2]))));

        }
    }

    const options = {
        download: true,
        filter: true,
        print: false,
        selectableRows: 'none',
        rowsPerPage: 5,
        rowsPerPageOptions: [5],
        textLabels: {
            body: {
                noMatch: displayedData.length === 0 ?
                    <TailSpin
                        height="80"
                        color="grey"
                        width="80"
                        radius="1"
                        ariaLabel="tail-spin-loading"
                        wrapperClass=""
                        wrapperStyle={{}}
                        textAlign='center'
                    /> :
                    'No data to display',
            },
        }
    }



    const { register, setValue, handleSubmit, control, formState: { errors } } = useForm();
    const { fields, append, remove: removeParameters } = useFieldArray({
        control,
        name: "inputs"
    });

    async function onSubmit(data, e) {
        
        console.log(data)
        if (fields.length < 1) {
            const myElement = document.getElementById("checks2")
            myElement.style.visibility = "visible"
        } else {
            const myElement = document.getElementById("checks")
            myElement.style.visibility = "hidden"
            const myElement2 = document.getElementById("checks2")
            myElement2.style.visibility = "hidden"

            const jsonArray = data.inputs.map(item => {
                return {
                    optionFrench: item.frenchInput,
                    optionEnglish: item.englishInput,
                    correct: item.checkBoxInput
                };
            });

            const jsonObj = JSON.stringify({
                options: jsonArray,
                questionTrackingNumber: data.trackingNumber,
                type: data.type,
                questionEnglish: data.english,
                questionFrench: data.french,
                overallDifficulty: 0.0,
                overallDiscriminiation: 0.0,
                authorOfChange: name,
                modifications: "Created",
                referenceArticleOrBook: data.reference,
                objectiveNumber: data.objective
            })
            console.log(jsonObj)

            const response = await addNewQuestion(jsonObj)
            if (response.ok) {
                const data = await response.text();
                console.log("Objective Added Successfully")
                navigate("/dashboard/questions"); 
            }
            else {
                throw new Error('Request failed to Add Question.');

            }
            console.log(jsonObj)

            console.log("success")

        }

    };

    async function onError(data, e) {
        console.log(errors)
        const myElement = document.getElementById("checks2")
        if (fields.length < 1) {
            myElement.style.visibility = "visible"
        } else {
            myElement.style.visibility = "hidden"
        }
    }

    const appendNewAnswer = () => {
        append([
            { label: 'English Answer', englishInput: '', label2: 'French Answer', frenchInput: '', label3: 'Correct Answer', checkBoxInput: false }
        ]);
        const myElement = document.getElementById("checks2")
        myElement.style.visibility = "hidden"
    }


    const removeLastAnswer = () => {
        // removeParameters(fields.slice(fields.length -1, fields.length));
        removeParameters(fields.length - 1);
    }

    useEffect(() => {
    }, [fields]
    );

    const columnsMUI = [
        {
            name: "heading",
            label: "Objective Heading",
            options: {
                filter: true,
                sort: true,
                filterType: "textField",
            }
        },
        {
            name: "code",
            label: "Objective Code",
            options: {
                filter: true,
                sort: true,
                filterType: "textField",
            }
        },
        {
            name: "objectiveNumber",
            label: "Objective Number",
            options: {
                filter: true,
                sort: true,
                filterType: "textField",
            }
        },
        {
            name: "description",
            label: "Description",
            options: {
                filter: true,
                sort: true,
                filterType: "textField",
            }
        },
        {
            name: "role",
            label: "Faculty Role",
            options: {
                filter: true,
                sort: true,
                filterType: "dropdown"
            }
        },
        {
            name: "type",
            label: "Question Type",
            options: {
                filter: true,
                sort: true,
                filterType: "dropdown"
            }
        },
        {
            name: "field",
            label: "Fields",
            options: {
                filter: true,
                sort: true,
                filterType: "dropdown"
            }
        },
    ];





    return (
        <>
            <Helmet>
                <title> Exam Database </title>
            </Helmet>

            <Container>

            <Box
                sx={{
                    postition: 'absolute',
                    top: 90,
                    right: 130,
                }}
                >
                <img src= {logo} alt= 'Logo' style={{width:'150px', height: 'auto'}}/>
            </Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom color = "whitesmoke">
                        New Question
                    </Typography>
                </Stack>

                <Box display="flex" alignItems="left">
                    <form onSubmit={handleSubmit(onSubmit, onError)} style={{ width: "90%" }}>
                        <Grid item sx={{ display: "flex" }}>
                            <Grid container spacing={3} direction="column" >
                                <Grid item>
                                    <Controller
                                        name="trackingNumber"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: 'Tracking Number is required',
                                            validate: value => trackingNumberExists(value)
                                        }}
                                        render={({ field }) => (
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <InputLabel htmlFor="trackingNumber" sx={{ marginRight: "5%",
                                                                                           width: "200px",
                                                                                           color: "whitesmoke" }}>
                                                    Tracking Number
                                                </InputLabel>
                                                <TextField sx={{ marginLeft: "5%", 
                                                                width: "100%", 
                                                                color: "whitesmoke"}}
                                                    id="trackingNumber"
                                                    variant="outlined"
                                                    type="number"
                                                    {...field}
                                                />
                                            </Box>
                                        )}
                                    />
                                    {errors.trackingNumber && (
                                        <FormHelperText error>
                                            Number is required or is being used already.
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item>
                                    <Controller
                                        name="type"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <InputLabel htmlFor="type" sx={{ marginRight: "5%", 
                                                                                 width: "200px",
                                                                                 color: "whitesmoke" }}>
                                                    Question Type
                                                </InputLabel>
                                                <TextField sx={{ marginLeft: "5%", 
                                                                width: "100%",
                                                                color: "whitesmoke" }}
                                                    id="type"
                                                    select
                                                    fullWidth
                                                    variant="outlined"
                                                    defaultValue=""
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value)}}
                                                    {...field}
                                                >
                                                    <MenuItem value="MCQ">MCQ</MenuItem>
                                                    <MenuItem value="CDMQ">CDMQ</MenuItem>
                                                </TextField>
                                            </Box>
                                        )}
                                    />
                                    {errors.type && (
                                        <FormHelperText error>
                                            Question Type is required.
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item>
                                    <MUIDataTable
                                        title={"Associate an Objective"}
                                        data={displayedData}
                                        options={options}
                                        columns={
                                            [...columnsMUI, {
                                                name: "Select",
                                                label: isSelected ? "Deselect" : "Select",
                                                options: {
                                                    filter: false,
                                                    sort: false,
                                                    customBodyRender: (value, tableMeta, updateValue) => (
                                                        <>
                                                            <Controller
                                                                name="objective"
                                                                control={control}
                                                                defaultValue=""
                                                                rules={{ validate: (e, r) => isSelected === true }}
                                                                render={({ field }) => (
                                                                    <Box>
                                                                        {isSelected ?
                                                                            <Button variant="text" onClick={() => handleSelect(tableMeta.rowData)}>Deselect</Button> :
                                                                            <Button
                                                                                variant="text"
                                                                                onClick={() => {
                                                                                    handleSelect(tableMeta.rowData)
                                                                                    setValue("objective", tableMeta.rowData[2])
                                                                                }}
                                                                                {...field}
                                                                            >
                                                                                Select
                                                                            </Button>}
                                                                    </Box>
                                                                )}
                                                            />
                                                            {errors.objective && !isSelected && (
                                                                <FormHelperText error>
                                                                    Objective Required
                                                                </FormHelperText>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            }]
                                        }
                                    />
                                </Grid>
                                <Grid item>
                                    <Controller
                                        name="english"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <InputLabel htmlFor="english" sx={{ marginRight: "5%", 
                                                                                    width: "200px",
                                                                                    color: "white" }}>
                                                    English Question
                                                </InputLabel>
                                                <TextField sx={{ marginLeft: "5%", 
                                                                width: "100%",
                                                                color: "whitesmoke" }}
                                                    id="english"
                                                    multiline
                                                    rows={10}
                                                    {...field}
                                                />
                                            </Box>
                                        )}
                                    />
                                    {errors.english && (
                                        <FormHelperText error>
                                            English Question is required.
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item>
                                    <Controller
                                        name="french"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <InputLabel htmlFor="french" sx={{ marginRight: "5%", 
                                                                                   width: "200px",
                                                                                   color: "white" }}>
                                                    French Question
                                                </InputLabel>
                                                <TextField sx={{ marginLeft: "5%",
                                                                width: "100%",
                                                                color: "whitesmoke" }}
                                                    id="french"
                                                    multiline
                                                    rows={10}
                                                    {...field}
                                                />
                                            </Box>
                                        )}
                                    />
                                    {errors.french && (
                                        <FormHelperText error>
                                            French Question is required.
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item>
                                    <Controller
                                        name="reference"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: false }}
                                        render={({ field }) => (
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <InputLabel htmlFor="reference" sx={{ marginRight: "5%", 
                                                                                      width: "200px",
                                                                                      color: "white" }}>
                                                    Reference
                                                </InputLabel>
                                                <TextField sx={{ marginLeft: "5%",
                                                                width: "100%",
                                                                color: "whitesmoke" }}
                                                    id="reference"
                                                    variant="outlined"
                                                    {...field}
                                                />
                                            </Box>
                                        )}
                                    />
                                </Grid>


                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                                    <Typography variant="h4" gutterBottom color = "whitesmoke">
                                        Answers
                                    </Typography>
                                </Stack>

                                <Paper style={{ maxHeight: 1000, overflow: 'auto', backgroundColor: "#F9FAFB" }}>
                                    {fields.map((item, index) => (

                                        <List key={item.id}>
                                            <Grid item>
                                                <Controller
                                                    {...register(`inputs.${index}.englishInput`, { required: true })}
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <InputLabel htmlFor={`inputs.${index}.englishInput`} sx={{ marginRight: "5%", width: "200px", height: "20px" }}>
                                                                {item.label}
                                                            </InputLabel>
                                                            <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                                multiline
                                                                rows={7}
                                                                {...field}
                                                            />
                                                        </Box>
                                                    )}
                                                />
                                                {errors.inputs && errors.inputs[index] && errors.inputs[index].englishInput && (
                                                    <FormHelperText error>
                                                        English Answer is required.
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item>
                                                <Controller
                                                    {...register(`inputs.${index}.frenchInput`, { required: true })}
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <InputLabel htmlFor={`inputs.${index}.frenchInput`} sx={{ marginRight: "5%", width: "200px", height: "20px" }}>
                                                                {item.label2}
                                                            </InputLabel>
                                                            <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                                multiline
                                                                rows={7}
                                                                {...field}
                                                            />
                                                        </Box>
                                                    )}
                                                />
                                                {errors.inputs && errors.inputs[index] && errors.inputs[index] && errors.inputs[index].frenchInput && (
                                                    <FormHelperText error>
                                                        French Answer is required.
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item>
                                                <Controller
                                                    {...register(`inputs.${index}.checkBoxInput`, {
                                                        validate: (e, r) => r.inputs.filter((d) => d.checkBoxInput === true).length > 0
                                                    })}
                                                    name={`inputs.${index}.checkBoxInput`}
                                                    control={control}
                                                    defaultValue={false}
                                                    render={({ field }) => (
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onChange={(e) => {
                                                                    field.onChange(e.target.checked)
                                                                    console.log(errors)
                                                                }}
                                                            />
                                                            <Typography sx={{ display: "inline" }}>
                                                                {item.label3}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                />
                                                {errors.inputs && errors.inputs[index] && errors.inputs[index].checkBoxInput && errors.inputs.filter((d) => d !== undefined && Object.prototype.hasOwnProperty.call(d, 'checkBoxInput')).length > 0 && (
                                                    <FormHelperText error>
                                                        At least 1 correct answer
                                                    </FormHelperText>
                                                )}

                                            </Grid>
                                            <hr color="blue" />
                                        </List>
                                    ))}

                                </Paper>
                                {fields.length > 9 ? <Box sx={{ justifyContent: "center", marginTop: "5%", display: "flex" }}>
                                    <Button sx={{ width: "20%", marginLeft: "20px" }} variant="contained" color="primary" onClick={(removeLastAnswer)}>
                                        Remove Answer
                                    </Button>
                                </Box> : <Box sx={{ justifyContent: "center", marginTop: "5%", display: "flex" }}>
                                    <Button sx={{ width: "20%", marginRight: "20px", backgroundColor: "#b394eb", '&:hover': { backgroundColor: "#42296e" } }} variant="contained" color="primary" onClick={appendNewAnswer}>
                                        Add Answer
                                    </Button>
                                    <div />
                                    <Button sx={{ width: "20%", marginLeft: "20px" }} variant="contained" color="error" onClick={(removeLastAnswer)}>
                                        Remove Answer
                                    </Button>
                                </Box>}



                                <Grid item sx={{ marginY: "5%", alignItems: "center" }}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Button sx={{ width: "75%", backgroundColor: "#b394eb", '&:hover': { backgroundColor: "#42296e" } }} variant="contained"  type="submit" >
                                            Submit
                                        </Button>
                                    </Box>
                                    <Alert sx={{ visibility: "hidden" }} id='checks' severity="error">Tracking Number already in use</Alert>
                                    <Alert sx={{ visibility: "hidden" }} id='checks2' severity="error">Must have at least 1 answer</Alert>
                                </Grid>

                            </Grid>
                        </Grid>


                    </form>
                </Box>

                {/* Bottom Footer Section */}
                <Box
                    sx={{
                    mt: 10,
                    p: 3,
                    backgroundColor: '#f5f5f5', // light grey background
                    textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="textSecondary">
                    uOttawa Exam Manager &copy; {new Date().getFullYear()} | All Rights Reserved
                    </Typography>
                </Box>
            </Container>

            
        </>

    );
}

