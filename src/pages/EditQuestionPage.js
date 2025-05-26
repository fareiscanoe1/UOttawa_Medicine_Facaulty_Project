import { React, useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link, redirect, useLocation } from 'react-router-dom';
import {
    Box,
    Grid,
    TextField,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    FormLabel,
    Container,
    Stack,
    Typography,
    IconButton,
    Paper,
    List,
    Checkbox,
    Alert,
    Hidden
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import MUIDataTable from "mui-datatables";
import { useMsal } from '@azure/msal-react';
import { arrayOf } from "prop-types";
import { dateFormat } from '../utils/customDate';

import {getQuestionsByTrackingNumber, updateQuestion} from "../services/QuestionServices"

// This is a default export of a React component called EditQuestionPage.
export default function EditQuestionPage() {
    // Importing necessary hooks from external libraries.
    const navigate = useNavigate();
    const { instance, accounts, inProgress } = useMsal();

    // Using destructuring to get name property of the first account in accounts array.
    const name = accounts[0] && accounts[0].name;
    // Using destructuring to get functions and properties from useForm hook.
    const { register, handleSubmit, setValue, clearErrors, setError, control, formState: { errors } } = useForm();
    // Using destructuring to get functions and properties from useFieldArray hook.
    const { fields, append, remove: removeParameters } = useFieldArray({
        control,
        name: "inputs"
    });
    // Using destructuring to get state object from useLocation hook, and getting trackingNumber property from it.
    const { state } = useLocation();
    const { trackingNumber } = state || {};
    // Setting up state using useState hook.
    const [displayedData, setDisplayedData] = useState([]);
    const [questionVersion, setQuestionVersion] = useState(0);
    const [isReadOnly, setIsReadOnly] = useState(false);
    
    // Adding an empty useEffect hook that runs when the fields variable changes.
    useEffect(() => {
    }, [fields]
    );
    // Defining an array of columns to be used in a table.
    const columnsMUI = [
        {
            name: "heading",
            label: "Objective Heading"
        },
        {
            name: "code",
            label: "Objective Code"
        },
        {
            name: "number",
            label: "Objective Number"
        },
        {
            name: "description",
            label: "Description",
        },
        {
            name: "role",
            label: "Faculty Role",
        },
        {
            name: "type",
            label: "Question Type"
        },
        {
            name: "field",
            label: "Fields"
        },
    ];

    // This useEffect hook is used to fetch data from an API and set it in the state of the component.
    // It executes only once after the component is mounted because of an empty dependency array.
    useEffect(() => {
        // TODO make a querry to get all data for all versions of the question using tracking number
        // A function to fetch data from the API
        const fetchata = async () => {
            try {
                const response = await getQuestionsByTrackingNumber(trackingNumber)
                // Check if the response is ok
                if (response.ok) {
                    // Parse the response data into a JavaScript object
                    const data = await response.json();
                    // Parse the response data into a JavaScript object
                    const retrievedData = [];
                    // Loop through each item in the data array
                    for (let i = 0; i < data.length; i += 1) {
                        // Extract the relevant data and create a new object containing it
                        const versionData = {
                            objectiveData: [{
                                heading: data[i]?.objective?.objectiveCode?.objectiveHeading,
                                code: data[i]?.objective?.objectiveCode?.objectiveCodeId,
                                number: data[i]?.objective?.objectiveNumber,
                                description: data[i]?.objective?.description,
                                role: data[i]?.objective?.facultyRole,
                                type: data[i]?.objective?.objectiveType,
                                field: data[i]?.objective?.fields
                            }]
                        }
                        versionData.trackingNumber = data[i]?.questionTrackingNumber;
                        versionData.modifications = data[i]?.modifications;
                        versionData.questionEnglish = data[i]?.questionEnglish;
                        versionData.questionFrench = data[i]?.questionFrench;
                        versionData.overallDifficulty = data[i]?.overallDifficulty;
                        versionData.overallDiscrimination = data[i]?.overallDiscrimination;
                        versionData.author = data[i]?.authorOfChange;

                        versionData.dateOfChange = dateFormat(data[i]?.dateOfChange)

                        versionData.reference = data[i]?.referenceArticleOrBook;
                        versionData.type = data[i]?.type;
                        // Map the optionList array to a new array containing only the relevant option data
                        const questionOptions = data[i]?.optionList?.map(item => {
                            return {
                                optionFrench: item.optionFrench,
                                optionEnglish: item.optionEnglish,
                                correct: item.correct
                            };
                        });
                        // Add the questionOptions array to the versionData object
                        versionData.questionOptions = questionOptions;
                        // Add the versionData object to the retrievedData array
                        retrievedData?.push(versionData);
                    }
                    // Set the state of the displayedData array to the retrievedData array
                    setDisplayedData(retrievedData);
                    // Set the state of the questionVersion variable to the length of the retrievedData array
                    setQuestionVersion(retrievedData.length);

                } else {
                    // Throw an error if the response is not ok
                    throw new Error(`Request to get data for question ${trackingNumber} failed.`);
                }
            } catch (error) {
                // Log any errors that occur
                console.log("Error occured:", error);
            }
        }
        // Call the fetchData function to retrieve the data
        fetchata();
    }, []);

    // Define an array of data for testing purposes
    const data1 = [
        { heading: "Abdominal Pain - Acute", code: "A01", number: "12471", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", role: "Clinician", type: "Skill", field: "Clinical Skills" }
    ];

    // This function is called when the user submits a form to update a question. It takes the form data as input
    async function onSubmit(data, e) {
        console.log(data)
        const jsonArray = data.inputs.map(item => {
            return {
                optionFrench: item.frenchInput,
                optionEnglish: item.englishInput,
                correct: item.checkBoxInput
            };
        });
    
        // This converts the form data into a JSON object to be sent as a request body to update the question.
        const jsonObj = JSON.stringify({
            options: jsonArray,
            questionTrackingNumber: data.trackingNumber,
            questionEnglish: data.english,
            questionFrench: data.french,
            authorOfChange: name,
            modifications: data.modifications,
            referenceArticleOrBook: data.reference,
        })
        console.log(jsonObj)

        // This sends a POST request to the server to update the question with the form data.
        const response = await updateQuestion(jsonObj)

        // This checks if the request was successful or not and handles the response accordingly.
        if (response.ok) {
            const data = await response.text();
            console.log("Objective Updated Successfully")
            navigate("/dashboard/questions"); 

        }
        else {
            throw new Error('Request failed to Update Question.');

        }
    };

    // This function is called when an error occurs during form submission and logs the error data to the console.
    const onError = (data, e) => {
        console.log("onError: ")
        console.log(data)
    }


    /* This useEffect hook is called whenever the value of questionVersion changes.
       It sets the values of various input fields based on the current question version, and also sets the value of setIsReadOnly based on whether we are displaying the latest version of the question or not.
       It then calls the populateAnswers function to fill the options. */
    useEffect(() => {
        if (displayedData.length !== 0) {
            setValue('trackingNumber', displayedData[questionVersion - 1].trackingNumber);
            setValue('author', displayedData[questionVersion - 1].author);
            setValue('dateOfChange', displayedData[questionVersion - 1].dateOfChange);
            setValue('type', displayedData[questionVersion - 1].type);
            setValue('overallDifficulty', displayedData[questionVersion - 1].overallDifficulty);
            setValue('overallDiscrimination', displayedData[questionVersion - 1].overallDiscrimination);

            setValue('english', displayedData[questionVersion - 1].questionEnglish);
            setValue('french', displayedData[questionVersion - 1].questionFrench);
            setValue('reference', displayedData[questionVersion - 1].reference);

            setValue('modifications', displayedData[questionVersion - 1].modifications);

            if (questionVersion !== displayedData.length) { // if we are not displaying the latest version 
                console.log("setItems read only");
                setIsReadOnly(true);

            } else { // if we are displaying the latest version
                console.log("setItems write too");
                setIsReadOnly(false);
            }
            populateAnswers();
        }

    }, [questionVersion]);

    // This function appends a new answer option to the list of answer options.
    const appendNewAnswer = () => { // adds a single empty options 
        append([
            { label: 'English Answer', englishInput: '', label2: 'French Answer', frenchInput: '', label3: 'Correct Answer', checkBoxInput: false, isDisabled: false }
        ]);
    }
    
    // This function removes the last answer option from the list of answer options.
    const removeLastAnswer = () => {
        // removeParameters(fields.slice(fields.length -1, fields.length));
        removeParameters(fields.length - 1);
    }
    /* This useEffect hook is called whenever the length of the fields array changes or the value of questionVersion changes.
       It adds answer options to the form if there are none listed, and removes all answer options if the form was previously populated with answer options. */
    useEffect(() => {
        if ( fields.length  === 0) {
            console.log("onRemove")
            if (displayedData.length !== 0) {
                for (let i = 0; i < displayedData[questionVersion - 1].questionOptions.length; i += 1) { // add all the options for the version after having removed the old ones
                    append([
                        { label: 'English Answer', englishInput: displayedData[questionVersion - 1].questionOptions[i].optionEnglish, label2: 'French Answer', frenchInput: displayedData[questionVersion - 1].questionOptions[i].optionFrench, label3: 'Correct Answer', checkBoxInput: displayedData[questionVersion - 1].questionOptions[i].correct, isDisabled: (questionVersion !== displayedData.length) }
                    ]);
                }
            }
            
        } 
        
    }, [fields.length && questionVersion]) // this function is triggered whenever fields.length change and questionVersion

    /* This function populates the form with answer options.
       If there are no answer options listed, it adds them.
       If there are already answer options listed, it removes them first and then adds the new ones. */
    const populateAnswers = () => {
        if (fields.length === 0) { // if there is no options listed we have to only add some
            for (let i = 0; i < displayedData[questionVersion - 1].questionOptions.length; i += 1) { // add all the options for that version
                append([
                    { label: 'English Answer', englishInput: displayedData[questionVersion - 1].questionOptions[i].optionEnglish, label2: 'French Answer', frenchInput: displayedData[questionVersion - 1].questionOptions[i].optionFrench, label3: 'Correct Answer', checkBoxInput: displayedData[questionVersion - 1].questionOptions[i].correct }
                ]);
            }
        } else {
            removeParameters()
        }
    }

    return (
        <>
            {displayedData.length === 0 ? null :
                <>
                    <Helmet>
                        <title> Exam Database </title>
                    </Helmet>

                    <Container>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                            <Typography variant="h4" gutterBottom>
                                Viewing question {trackingNumber}, version {questionVersion}/{displayedData.length}
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
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="trackingNumber" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Tracking Number
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="trackingNumber"
                                                            variant="outlined"
                                                            type="number"
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                            {errors.trackingNumber && (
                                                <FormHelperText error>
                                                    Number is required.
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item>
                                            <Controller
                                                name="author"
                                                control={control}
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="author" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Author
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="author"
                                                            variant="outlined"
                                                            type="text"
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Controller
                                                name="dateOfChange"
                                                control={control}
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="dateOfChange" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Date Of Change
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="dateOfChange"
                                                            variant="outlined"
                                                            type="text"
                                                            defaultValue={displayedData[questionVersion - 1].dateOfChange}
                                                            InputProps={{
                                                                readOnly: true
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Controller
                                                name="type"
                                                control={control}
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="type" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Question Type
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="type"
                                                            fullWidth
                                                            variant="outlined"
                                                            defaultValue={displayedData[questionVersion - 1].type}
                                                            InputProps={{
                                                                readOnly: true
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Controller
                                                name="overallDifficulty"
                                                control={control}
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="overallDifficulty" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Overall Difficulty
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="overallDifficulty"
                                                            variant="outlined"
                                                            type="text"
                                                            defaultValue={displayedData[questionVersion - 1].overallDifficulty}
                                                            InputProps={{
                                                                readOnly: true
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Controller
                                                name="overallDiscrimination"
                                                control={control}
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="overallDiscrimination" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Overall Discrimination
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="overallDiscrimination"
                                                            variant="outlined"
                                                            type="text"
                                                            defaultValue={displayedData[questionVersion - 1].overallDiscrimination}
                                                            InputProps={{
                                                                readOnly: true
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <MUIDataTable
                                                title={"Associated Objective"}
                                                data={displayedData[questionVersion - 1].objectiveData}
                                                columns={
                                                    [...columnsMUI]
                                                }

                                                options={{
                                                    selectableRows: 'none',
                                                    rowsPerPage: 1,
                                                    rowsPerPageOptions: [0],
                                                    download: false,
                                                    filter: false,
                                                    print: false,
                                                    search: false,
                                                    sort: false,
                                                    viewColumns: false,
                                                    page: 0,
                                                    customFooter: () => {

                                                    }

                                                }}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Controller
                                                name="version"
                                                control={control}
                                                defaultValue={displayedData.length}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="version" sx={{ marginRight: "5%", width: "200px" }}>
                                                            View Version
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="version"
                                                            select
                                                            fullWidth
                                                            variant="outlined"
                                                            defaultValue=""
                                                            {...field}
                                                            onChange={(e) => {
                                                                setQuestionVersion(e.target.value);
                                                                field.onChange(e.target.value);
                                                                console.log(field);
                                                            }}
                                                        >
                                                            {Array.from({ length: displayedData.length }, (_, index) => (
                                                                <MenuItem key={index} value={index + 1}>{index + 1}</MenuItem>
                                                            ))}

                                                        </TextField>
                                                    </Box>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Controller
                                                name="english"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="english" sx={{ marginRight: "5%", width: "200px" }}>
                                                            English Question
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="english"
                                                            multiline
                                                            rows={10}
                                                            InputProps={{
                                                                readOnly: isReadOnly,
                                                            }}
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
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="french" sx={{ marginRight: "5%", width: "200px" }}>
                                                            French Question
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="french"
                                                            multiline
                                                            rows={10}
                                                            InputProps={{
                                                                readOnly: isReadOnly,
                                                            }}
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
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="reference" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Reference
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="reference"
                                                            variant="outlined"
                                                            InputProps={{
                                                                readOnly: isReadOnly,
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                        </Grid>
                                        <br />
                                        <br />
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                                            <Typography variant="h4" gutterBottom>
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
                                                                        InputProps={{
                                                                            readOnly: isReadOnly,
                                                                        }}
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
                                                                        InputProps={{
                                                                            readOnly: isReadOnly,
                                                                        }}
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
                                                            {...register(`inputs.${index}.checkBoxInput`, { required: false })}
                                                            control={control}
                                                            rules={{ required: false }}
                                                            render={({ field }) => (
                                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                    <InputLabel htmlFor={`inputs.${index}.checkBoxInput`} sx={{ marginRight: "5%", width: "200px", height: "20px" }}>
                                                                        {item.label3}
                                                                    </InputLabel>
                                                                    <Checkbox sx={{ marginLeft: "5%", width: "100%" }}
                                                                        defaultChecked={item.checkBoxInput}
                                                                        disabled={item.isDisabled}

                                                                        {...field}

                                                                    />
                                                                </Box>
                                                            )}
                                                        />
                                                    </Grid>
                                                    <hr color="blue" />
                                                </List>
                                            ))}

                                        </Paper>


                                        {fields.length > 9 ? <Box sx={{ justifyContent: "center", marginTop: "5%", display: "flex" }}>
                                            <Button sx={{ width: "20%", marginLeft: "20px", display: isReadOnly ? "none" : "block" }} variant="contained" color="primary" onClick={(removeLastAnswer)}>
                                                Remove Answer
                                            </Button>
                                        </Box> : <Box sx={{ justifyContent: "center", marginTop: "5%", display: "flex" }}>
                                            <Button sx={{ width: "20%", marginRight: "20px", display: isReadOnly ? "none" : "block" }} variant="contained" color="primary" onClick={appendNewAnswer}>
                                                Add Answer
                                            </Button>
                                            <div />
                                            <Button sx={{ width: "20%", marginLeft: "20px", display: isReadOnly ? "none" : "block" }} variant="contained" color="error" onClick={(removeLastAnswer)}>
                                                Remove Answer
                                            </Button>
                                        </Box>}
                                        <br />
                                        <Grid item>
                                            <Controller
                                                name="modifications"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <InputLabel htmlFor="modifications" sx={{ marginRight: "5%", width: "200px" }}>
                                                            Modifications Made
                                                        </InputLabel>
                                                        <TextField sx={{ marginLeft: "5%", width: "100%" }}
                                                            id="modifications"
                                                            multiline
                                                            rows={10}
                                                            InputProps={{
                                                                readOnly: isReadOnly,
                                                            }}
                                                            {...field}
                                                        />
                                                    </Box>
                                                )}
                                            />
                                            {errors.modifications && (
                                                <FormHelperText error>
                                                    Modifications Made is Required
                                                </FormHelperText>
                                            )}
                                        </Grid>


                                        <Grid item sx={{ marginY: "5%", alignItems: "center", display: isReadOnly ? "none" : "block" }}>
                                            <Box sx={{ textAlign: "center" }}>
                                                <Button sx={{ width: "75%" }} variant="contained" color="primary" type="submit" hidden={isReadOnly}>
                                                    Submit
                                                </Button>
                                            </Box>
                                        </Grid>


                                    </Grid>
                                </Grid>


                            </form>
                        </Box>
                    </Container>
                </>
            }
        </>
    );
}