import React, {useState} from "react";
import { Helmet } from 'react-helmet-async';
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
    Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { sizeWidth } from "@mui/system";
import { useNavigate  } from "react-router-dom";
import CSVImporter from "../components/csvImporter/CSVImporterObjectives";
import { addNewLearningObjective, getObjectiveHeadingByCode, isObjectiveNumberUsed } from "../services/LearningObjectiveServices";
// branding logo
import logo from '../pictures/FM_Family Medicine-WHITE Logo-Horizontal.png'


// This function checks if an objective number is already being used.
async function objectiveNumberExists(objectiveNumber) {
    try {
        // Send a GET request to the server with the objective number as a parameter
        const response = await isObjectiveNumberUsed(objectiveNumber)
        if (response.ok) { // Check if the response is successful
            const result = await response.json(); // Parse the response data to JSON format
            if (result === true) { // If the objective number is already used, log a message and return 1
                console.log('Objective Number Is Being Used Already.');
                return 1;
            }
            // If the objective number is not used, log a message and return 0
            console.log('Objective Number Is Not Being Used Already.');
            return 0;
        }
        // If the response is not successful, throw an error
        throw new Error('Request To Verify Objective Number Failed.');

    } catch (error) {
        // Log any error and return -1
        console.error(error);
        return -1;
    }
}
async function getObjectiveHeading(objectiveCode) {
    try {
        const response = await getObjectiveHeadingByCode(objectiveCode)
        if (response.status === 200) {
            const result = await response.text();
            console.log("An Objective Heading Has Been Found For This Code: ", result);
            return [1, result]; // request exists
        }
        if (response.status === 204) { // the heading does not exist
            console.log("This Objective Code Is New. No Heading Exists For It.");
            return [0, ""];
        }
        throw new Error('Request To Get Objective Heading By Code Failed.');
    } catch (error) {
        console.log(error);
        return [-1, ""]; // request failed
    }
}

// Exporting a React functional component 
export const NewLearningObjective = () => {
    // Destructuring of the react-hook-form package, navigation hook and state hook
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [currentCode, setCurrentCode] = useState("")

    // Asynchronous function to handle form submission
    async function onSubmit(data) {

        console.log("Data To Be Verified:", data);

       
        

        // console.log(JSON.stringify({objectiveCode:data.code,
        //             objectiveHeading:data.heading,
        //             objectiveNumber:data.number,
        //             description:data.description,
        //             facultyRole:data.role,
        //             fields:data.field,
        //             objectiveType:data.type}));
        // use commented format when using json format request

        try {
            // Creating a new FormData object to send as a payload
            const temp = new FormData();
            temp.append("objectiveCode",data.code);
            temp.append("objectiveHeading",data.heading);
            temp.append("objectiveNumber", data.number);
            temp.append("description",data.description);
            temp.append("facultyRole", data.role);
            temp.append("fields", data.field);
            temp.append("objectiveType", data.type);
            const response = await addNewLearningObjective(temp)
            // If the response is ok, the objective is added successfully and we navigate to a new page
            if (response.ok){
                // const data = await response.json();
                // console.log("Data Sent To Database:", data);
                console.log("Objective Added Successfully")
                navigate("/dashboard/learningobjectives");
                return true;
            }
            // If the response is not ok, we throw an error
            throw new Error('Request failed to Add Objective Failed.');
        } catch (error) {
            console.log(error)
            return false;
        } 
    }

    const onError = (data, e) => {
        console.log("error");
    }

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
                        New Learning Objective
                    </Typography>
                    <CSVImporter/>
                </Stack>

                <Box display="flex" alignItems="left">

                    <form onSubmit={handleSubmit(onSubmit, onError)} style={{ width: "100%" }}>
                        <Grid container spacing={3} direction="column" >

                            <Grid item>
                                <Controller
                                    name="code"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <InputLabel htmlFor="code" sx={{ marginRight: "5%",
                                                                            width: "200px",
                                                                            color: "whitesmoke" }}>
                                                Objective Code
                                            </InputLabel>
                                            <TextField sx={{ marginLeft: "5%", width: "100%", color: "whitesmoke" }}
                                                id="code"
                                                variant="outlined"
                                                onChange={
                                                    setCurrentCode(field.value)
                                                }
                                                {...field}
                                            />
                                        </Box>
                                    )}
                                />
                                {errors.code && (
                                    <FormHelperText error>
                                        Objective Code is required.
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item>
                                <Controller
                                    name="heading"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true, 
                                        validate: (e,r) => 
                                        (getObjectiveHeading(currentCode).then((val) => {
                                            console.log(val)
                                            return (val[0] === 0 || e === val[1])
                                        }))}}
                                    render={({ field }) => (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <InputLabel htmlFor="heading" sx={{ marginRight: "5%",
                                                                                width: "200px",
                                                                                color: "whitesmoke" }}>
                                                Objective Heading
                                            </InputLabel>
                                            <TextField sx={{ marginLeft: "5%", width: "100%", color: "whitesmoke" }}
                                                id="heading"
                                                variant="outlined"
                                                {...field}
                                            />
                                        </Box>
                                    )}
                                />
                                {errors.heading && (
                                    <FormHelperText error>
                                        Objective Heading is empty or there already exists a heading for this code.
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item>
                                <Controller
                                    name="number"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true,
                                        validate: (e,r) => 
                                        (objectiveNumberExists(e).then((val) => {
                                            return (val === 0)
                                        }))
                                    }}
                                    render={({ field }) => (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <InputLabel htmlFor="number" sx={{ marginRight: "5%",
                                                                               width: "200px",
                                                                               color: "whitesmoke" }}>
                                                Objective Number
                                            </InputLabel>
                                            <TextField sx={{ marginLeft: "5%", width: "100%", color: "whitesmoke" }}
                                                id="number"
                                                variant="outlined"
                                                type="number"
                                                {...field}
                                            />
                                        </Box>
                                    )}
                                />
                                {errors.number && (
                                    <FormHelperText error>
                                        Objective Number is empty or is already in use.
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item>
                                <Controller
                                    name="role"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <InputLabel htmlFor="role" sx={{ marginRight: "5%",
                                                                            width: "200px",
                                                                            color: "whitesmoke" }}>
                                                Faculty Role
                                            </InputLabel>
                                            <TextField sx={{ marginLeft: "5%", width: "100%", color: "whitesmoke" }}
                                                id="role"
                                                variant="outlined"
                                                {...field}
                                            />
                                        </Box>
                                    )}
                                />
                                {errors.role && (
                                    <FormHelperText error>
                                        Faculty Role is required.
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item>
                                <Controller
                                    name="field"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <InputLabel htmlFor="field" sx={{ marginRight: "5%",
                                                                              width: "200px",
                                                                              color: "whitesmoke" }}>
                                                Fields
                                            </InputLabel>
                                            <TextField sx={{ marginLeft: "5%", width: "100%", color: "whitesmoke" }}
                                                id="field"
                                                variant="outlined"
                                                {...field}
                                            />
                                        </Box>
                                    )}
                                />
                                {errors.field && (
                                    <FormHelperText error>
                                        Field is required.
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
                                                Objective Type
                                            </InputLabel>
                                            <TextField sx={{ marginLeft: "5%", width: "100%", color: "whitesmoke" }}
                                                id="type"
                                                select
                                                fullWidth
                                                variant="outlined"
                                                defaultValue=""
                                                onChange={(e) => field.onChange(e.target.value)}
                                            >
                                                <MenuItem value="Skill">Skill</MenuItem>
                                                <MenuItem value="Knowledge">Knowledge</MenuItem>
                                                <MenuItem value="Behavior">Behavior</MenuItem>
                                            </TextField>
                                        </Box>
                                    )}
                                />
                                {errors.type && (
                                    <FormHelperText error>
                                        Objective Type is required.
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item>
                                <Controller
                                    name="description"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <InputLabel htmlFor="description" sx={{ marginRight: "5%",
                                                                                    width: "200px",
                                                                                    color: "whitesmoke" }}>
                                                Description
                                            </InputLabel>
                                            <TextField sx={{ marginLeft: "5%", width: "100%", color: "whitesmoke" }}
                                                id="description"
                                                multiline
                                                rows={10}
                                                {...field}
                                            />
                                        </Box>
                                    )}
                                />
                                {errors.description && (
                                    <FormHelperText error>
                                        Description is required.
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item>
                                <Box sx={{ textAlign: "center" }}>
                                    <Button sx={{backgroundColor: "#b394eb", '&:hover': { backgroundColor: "#42296e" }}} variant="contained"  type="submit">
                                        Submit
                                    </Button> {/* after the submit button here should update our backend. Should make a controller to update it  */}
                                </Box>
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

