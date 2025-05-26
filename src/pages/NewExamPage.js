import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Button, Typography, List, Select, MenuItem, InputLabel, Icon, IconButton, Toolbar, useColorScheme, FormHelperText, } from '@mui/material';
import { TailSpin } from 'react-loader-spinner'
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import "bootstrap/dist/css/bootstrap.min.css";
import { dateFormat } from '../utils/customDate';

import { getExamByIdentifier, addNewExam, fetchAllExams } from '../services/ExamServices';
import { getAllQuestions, getLatestQuestionVersion, formatQuestionToIndependantRow } from '../services/QuestionServices';
import QuestionToolTip from './QuestionToolTip';

// Fetches exam data from backend and transforms it to a usable format
async function getExamById(id) {
  try {
    const response = await getExamByIdentifier(id)
    if (response.ok) {
      const data = await response.json();
      const notes = data.notes
      // Transform data into the desired format
      const retrievedData = []
      for (let i = 0; i < data.sections.length; i += 1) {
        for (let j = 0; j < data.sections[i]?.questions.length; j += 1) { // IF U WANT TO ADD MORE DATA LATER U DO IT HERE
          const rowData = {}
          const currQuestion = data.sections[i]?.questions[j];
          const currQuestionDetails = currQuestion?.question;

          // Extract relevant data from current question and add it to rowData object
          rowData.questionId = currQuestionDetails?.id?.questionId;
          rowData.questionVersion = currQuestionDetails?.id?.versionNumber;
          rowData.sectionName = data.sections[i]?.type
          rowData.questionNum = currQuestion?.questionNumberOnExam
          rowData.questionType = currQuestionDetails.type
          rowData.objectiveCode = currQuestionDetails.objective.objectiveCode.objectiveCodeId
          rowData.trackingNumber = currQuestionDetails.questionTrackingNumber
          rowData.questionEnglish = currQuestionDetails.questionEnglish;
          rowData.questionFrench = currQuestionDetails.questionFrench;
          rowData.questionType = currQuestionDetails.type;

          // Extract and format question options and add to rowData object
          const questionOptions = currQuestionDetails?.optionList?.map(item => {
            return {
              optionFrench: item.optionFrench,
              optionEnglish: item.optionEnglish,
              correct: item.correct
            };
          });
          rowData.options = questionOptions;

          // Add rowData object to retrievedData array
          retrievedData?.push(rowData)
        }
      }
      // Log the transformed data and return it
      return [retrievedData, notes]
    }
  } catch (error) {
    console.error(error);
  }
  return []
}
// Main component for the New Exam page
export const NewExamPage = () => {
  const { handleSubmit, control, formState: { errors } } = useForm();

  // Use state to store exam data
  const [exam1Data, setExam1Data] = useState([])
  const [exam2Data, setExam2Data] = useState([])
  const [exam3Data, setExam3Data] = useState([])

  // use states for the output tables on the right hand side of the screen
  const mcqData = [];
  const cdmqData = [];
  const [resultTables, setResultTables] = useState(() => {
    // Try to retrieve data from local storage on initial load
    const storedData = localStorage.getItem('sessionResultTables');
    
    return storedData ? JSON.parse(storedData) : [mcqData,cdmqData];
  });   /* we will use this to store sections */
  const [questionsAdded, setQuestionsAdded] = useState(() => {
    // Try to retrieve data from local storage on initial load
    const storedData = localStorage.getItem('sessionQuestionsAdded');
    
    return storedData ? JSON.parse(storedData) : [];
  });// use this to store the summation of questions for the objective table
  
 

  const [allQuestions, setAllQuestion] = useState([]) // Use state to store all question data
  const [allExams, setAllExams] = useState([])

  // Use state to store selected exams
  const [selectedExam1, setSelectedExam1] = useState(0)
  const [selectedExam2, setSelectedExam2] = useState(0)
  const [selectedExam3, setSelectedExam3] = useState(0)

  // Use state that stores the selected exam's notes
  const [exam1Notes, setExam1Notes] = useState("")
  const [exam2Notes, setExam2Notes] = useState("")
  const [exam3Notes, setExam3Notes] = useState("")
  const [currentNotes, setCurrentNotes] = useState("")

  const columnsMUI = [
    {
      name: "questionNum",
      label: "#",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "trackingNumber",
      label: "Tracking number",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "objectiveCode",
      label: "Objective Code",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "sectionName",
      label: "Section",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "questionType",
      label: "Question Type",
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: 'questionToolTip',
      label: 'View',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <QuestionToolTip rowData={tableMeta.tableData[tableMeta.rowIndex]} />
        ),
      }
    }

  ];

  const multiSelectAdd = async (selectedRows, from) => { // add button when using multi-select on all questions
    if (rightPage === "-1") {
      // Currently On Objectives Pages, Ignoring Addition
      return;
    }
    let arr
    if (from === 1) {
      arr = [...exam1Data];
    } else if (from === 2) {
      arr = [...exam2Data];
    } else if (from === 3) {
      arr = [...exam3Data];
    }
    else if (from === -1) {
      arr = [...allQuestions]
    }
    const indices = [];
    for (let i = 0; i < selectedRows.data.length; i += 1) {
      indices.push(selectedRows.data[i].dataIndex)
    }

    indices.sort((a, b) => a - b)

    const tempTables = [...resultTables];
    const tempQuestionsAdded = [...questionsAdded];
    let errorOccurred = false; // Initialize error flag

    // Create an array of promisses to get the latest versions
    const getLatestVersionsPromises = indices.map((index) => {
      const tmp = arr[index];
      const currResultTable = [...resultTables[rightPage]];
      if (currResultTable.filter((d) => d.trackingNumber === tmp.trackingNumber).length === 0) {
        return getLatestQuestionVersion(tmp.trackingNumber)
          .then((response) => response.json())
          .then((data) => formatQuestionToIndependantRow(data))
          .catch((error) => {
            console.error("Error fetching latest version:", error);
            errorOccurred = true; // Set error flag to true
            return null; // Return -1 in case of an error
          });
      } // else the question exists already
      return null; // Already added, no need to fetch the version
    });

    // Wait for all promises to resolve
    const latestVersions = await Promise.all(getLatestVersionsPromises);


    if (errorOccurred) { // dont add any questions at all if error
      console.error("An error occured while retrieving the latest version of the question")
      return
    }

    for (let i = 0; i < indices.length; i += 1) {
      if (latestVersions[i]) {
        tempTables[rightPage].push(latestVersions[i]);
        tempQuestionsAdded.push(latestVersions[i]);
      }
    }
    setResultTables(tempTables);
    setQuestionsAdded(tempQuestionsAdded); // add to objectives table 
  }

  const multiSelectAddNew = async (selectedTrackingNumbers) => { // add button when using multi-select on previous exams
    if (rightPage === "-1") {
      // Currently On Objectives Pages, Ignoring Addition
      return;
    }

    const tempTables = [...resultTables];
    const tempQuestionsAdded = [...questionsAdded];
    let errorOccurred = false; // Initialize error flag

    // Create an array of promisses to get the latest versions
    const getLatestVersionsPromises = selectedTrackingNumbers.map((number) => {
      const currResultTable = [...resultTables[rightPage]];
      if (currResultTable.filter((d) => d.trackingNumber === number).length === 0) {
        return getLatestQuestionVersion(number)
          .then((response) => response.json())
          .then((data) => formatQuestionToIndependantRow(data))
          .catch((error) => {
            console.error("Error fetching latest version:", error);
            errorOccurred = true; // Set error flag to true
            return null; // Return -1 in case of an error
          });
      } // else the question exists already
      return null; // Already added, no need to fetch the version
    });

    // Wait for all promises to resolve
    const latestVersions = await Promise.all(getLatestVersionsPromises);

    if (errorOccurred) { // dont add any questions at all if error
      console.error("An error occured while retrieving the latest version of the question")
      return
    }

    latestVersions.forEach((question) => {
      if (question) { // check if null when already in the table
        tempTables[rightPage].push(question);
        tempQuestionsAdded.push(question);
      }
    })
   
    setResultTables(tempTables);
    setQuestionsAdded(tempQuestionsAdded); // add to objectives table 
  }
  // Function to toggle the menu open/closed
  const toggleMenu = () => {
    setOpen(!open);
  };
  const [open, setOpen] = useState(false); // State variable for whether the menu is open or closed

  const [value, setValue] = React.useState('1'); // State variable for the current value of a component (initialized to '1')

  const handleChange = (event, newValue) => { // Function to handle changes to the component's value
    setValue(newValue);
  };
  const [rightPage, setRightPage] = React.useState('0'); // State variable for the current right page (initialized to '0')

  const handleChange2 = (event, newPage) => { // Function to handle changes to the right page

    setRightPage(newPage);
  };

  const handleSelect = (e) => { // Function to handle selection of a question
    if (rightPage === "-1") {
      return;
    }
    if (resultTables[rightPage].filter(d => d.trackingNumber === e.trackingNumber).length === 0) { // if the question is not already in the table
      const tempTables = [...resultTables];

      tempTables[rightPage].push(e);
      setResultTables(tempTables);

      const tempQuestionsAdded = [...questionsAdded]
      tempQuestionsAdded.push(e);
      setQuestionsAdded(tempQuestionsAdded);
    }
  }

  // Function to remove a result from the table
  const removeFromResult = (index, tableIndex) => {
    const temp = [...resultTables[tableIndex]];
    const removedItem = temp.splice(index, 1);

    // TODO cleanup on methods which require temps like this including this one
    const tempResultsTable = [...resultTables]
    tempResultsTable[tableIndex] = temp;
    setResultTables(tempResultsTable);

    const tempQuestionsAdded = [...questionsAdded];

    for (let i = 0; i <= tempQuestionsAdded.length; i += 1) {

      if (tempQuestionsAdded[i].trackingNumber === removedItem[0].trackingNumber) { // TODO later we can check what section we are removing 
        // if the question was added to the table
        tempQuestionsAdded.splice(i, 1);
        setQuestionsAdded(tempQuestionsAdded);
        return;
      }
    }
  }

  // Define an array of objects to hold column information for a table
  const ExamColumns = useMemo(
    () => [
      {
        header: '#',
        accessorKey: 'questionNum',
        size: 10,
        Header: ({ column }) => (
          <div style={{ whiteSpace: 'normal' }}>{column.columnDef.header}</div>
        )
      },
      {
        header: 'Tracking number',
        accessorKey: 'trackingNumber',
        size: 30,
        Header: ({ column }) => (
          <div style={{ whiteSpace: 'normal', textAlign: 'center' }}>{column.columnDef.header}</div>
        )
      },
      {
        header: 'Objective Code',
        accessorKey: 'objectiveCode',
        size: 40,
        Header: ({ column }) => (
          <div style={{ whiteSpace: 'normal', textAlign: 'center' }}>{column.columnDef.header}</div>
        )
      },
      {
        header: 'Section',
        accessorKey: 'sectionName',
        size: 110,
        Header: ({ column }) => (
          <div style={{ whiteSpace: 'normal', textAlign: 'center' }}>{column.columnDef.header}</div>
        )
      },
      {
        header: 'Question Type',
        accessorKey: 'questionType',
        size: 60,
        Header: ({ column }) => (
          <div style={{ whiteSpace: 'normal', textAlign: 'center' }}>{column.columnDef.header}</div>
        )
      },
      {
        header: 'Tooltip',
        accessorKey: 'tooltip',
        size: 60,
        Header: ({ column }) => (
          <div style={{ whiteSpace: 'normal', textAlign: 'center' }}>{column.columnDef.header}</div>
        ),
        Cell: ({ cell, column }) => (
          <Box>
            <QuestionToolTip rowData={cell.row.original}>
              {cell.getValue()}
            </QuestionToolTip>
          </Box>
        ),
      }
    ],
  );

  const columns = useMemo(
    () => [
      {
        header: 'Code',
        accessorKey: 'objectiveCode',
      },
      {
        header: 'Num',
        accessorKey: 'trackingNumber',
      },
      {
        header: 'Type',
        accessorKey: 'questionType',
      }
    ],
  );


  // Define a function to handle dragging and dropping items within a table
  const handleDragEnd = (e) => {
    if (!e.destination) return;
    const tempData = [...resultTables];
    const tempData2 = [...tempData[rightPage]];
    const sourceData = tempData2.splice(e.source.index, 1);
    tempData2.splice(e.destination.index, 0, sourceData[0]);
    tempData.splice(rightPage, 1, tempData2)
    setResultTables(tempData);
  };

  // This function can be used to add any additional verification logic to the exam data.
  function verifyExam() {
    // add any extra verification
  }

  // This function sends the exam data to the server via a POST request and returns the response data as a blob.
  async function addExam(jsonData) {
    const jsonObj = JSON.stringify(jsonData)
    const response = await addNewExam(jsonObj)

    if (response.ok) {

      const data = await response.blob();
      return data
    }

    throw new Error('Request failed to Add Exam.');
  };

  // This function generates an exam data object from the data stored in the resultTables state variable.
  async function generateExam(formData) {
    const sectionNames = ["MCQ", "CDMQ"];
    const registeredData = [...resultTables];

    const objectivesOut = [] // array of max objectives
    const sectionsOut = []; // array of sections
    for (let sectionIndex = 0; sectionIndex < registeredData.length; sectionIndex += 1) { // loop through all the sections of the exam
      const questionsOut = [] // array of questions
      for (let questionIndex = 0; questionIndex < registeredData[sectionIndex].length; questionIndex += 1) { // loop through the question of the exam section
        const questionIn = registeredData[sectionIndex][questionIndex]; // current question 
        questionsOut.push({ questionTrackingNumber: questionIn.trackingNumber, questionVersionNumber: questionIn.questionVersion });

      }
      sectionsOut.push({ type: sectionNames[sectionIndex], questions: questionsOut }); // push the section to the array of sections
    }


    const request = { name: formData.examName, examObjectives: objectivesOut, sections: sectionsOut, notes: formData["exam-notes"] };
    // Downloads a zip file containing the exam data
    try {
      const blob = await addExam(request);
      // Create a URL for the blob data
      const url = URL.createObjectURL(blob);

      // Create a link and click it to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the URL to free up memory
      URL.revokeObjectURL(url);
      // navigate("/dashboard/exams");
    } catch (e) {
      console.err(e)
    }

  };

  // Called when the user submits the exam form
  async function onExamSubmit(formData, e) {
    formData["exam-notes"] = currentNotes
    verifyExam();
    await generateExam(formData).then(() => {
      localStorage.setItem('sessionQuestionsAdded', JSON.stringify([]));
      localStorage.setItem('sessionResultTables', JSON.stringify([[],[]]));
      window.location.href = "http://localhost:3000/dashboard/exams" }).catch(() => { console.err("Unsucessful") });
  }
  // Called when the user submits the exam form
  async function onExamError() {
    console.err(errors)
  }

  const handleExamNotesChange = (e) => { // exam notes change
    setCurrentNotes(e.target.value);
  };

  useEffect(() => { // when the questionsAdded changes, we will update our session data related to it
    if (questionsAdded) {
      localStorage.setItem('sessionQuestionsAdded', JSON.stringify(questionsAdded));
    }
  }, [questionsAdded]);

  useEffect(() => { // when the result changes, we will update our session data related to it
    if (resultTables) {
      localStorage.setItem('sessionResultTables', JSON.stringify(resultTables));
    }
  }, [resultTables]);
  // Define an asynchronous effect function that runs once when the component mounts
  useEffect(() => {
    // Define an asynchronous function that fetches data from the specified URL
    const fetchata = async () => {
      const response = await getAllQuestions()
      const data = await response.json(); // Extract the JSON data from the response

      const retrievedData = [] // Define an empty array to hold the transformed data

      // Loop through the array of questions and transform each object into a new object with specific properties
      for (let i = 0; i < data.length; i += 1) {
        const rowData = {}; // Define a new object to hold the transformed data for the current question

        // Set default values for properties that are not available in the source data
        rowData.questionNum = "NA"
        rowData.sectionName = "NA"
        rowData.questionVersion = data[i]?.id?.versionNumber; // Set the version number for the current question
        rowData.trackingNumber = data[i]?.questionTrackingNumber; // Set the tracking number for the current question
        rowData.heading = data[i]?.objective?.objectiveCode?.objectiveHeading; // Set the objective heading for the current question
        rowData.objectiveCode = data[i]?.objective?.objectiveCode?.objectiveCodeId; // Set the objective code ID for the current question
        rowData.objectiveNumber = data[i]?.objective?.objectiveNumber; // Set the objective number for the current question
        rowData.questionEnglish = data[i]?.questionEnglish; // Set the English version of the current question
        rowData.questionFrench = data[i]?.questionFrench; // Set the French version of the current question
        rowData.overallDifficulty = data[i]?.overallDifficulty; // Set the overall difficulty rating for the current question
        rowData.overallDiscrimination = data[i]?.overallDiscrimination; // Set the overall discrimination rating for the current question
        rowData.author = data[i]?.authorOfChange; // Set the author of the current question
        rowData.dateOfChange = data[i]?.dateOfChange; // Set the date of the last change to the current question
        rowData.reference = data[i]?.referenceArticleOrBook; // Set the reference article or book for the current question
        rowData.questionType = data[i]?.type; // Set the type of the current question

        // Map the optionList array to create a new array of transformed options for the current question
        const questionOptions = data[i]?.optionList?.map(item => {
          return {
            optionFrench: item.optionFrench,
            optionEnglish: item.optionEnglish,
            correct: item.correct
          };
        });

        // Add the transformed options array to the current question object
        rowData.options = questionOptions;

        // Add the transformed question object to the retrievedData array
        retrievedData?.push(rowData)
        // TODO add columns for this data
      }
      // Update the state with the transformed question data
      setAllQuestion(retrievedData)
      const response2 = await fetchAllExams();
      const data2 = await response2.json(); // Extract the JSON data from the response
      const retrievedData2 = [] // Define an empty array to hold the transformed data

      // Loop through the array of exams and transform each object into a new object with specific properties
      for (let i = 0; i < data2.length; i += 1) {
        const rowData = {};
        rowData.id = data2[i]?.id
        rowData.name = data2[i]?.name
        rowData.date = data2[i]?.dateCreated
        retrievedData2?.push(rowData)
      }
      setAllExams(retrievedData2)
    }
    fetchata();
  }, []);

  // This useEffect hook updates the exam data for both exams selected
  useEffect(() => {
    // Check if there are any exams present in the 'allExams' state
    if (allExams.length !== 0) {
      // Get the exam data for the selected exam1 and exam2 by their ids
      // If there is an error while fetching the data, log the error to the console
      getExamById(allExams[selectedExam1].id).catch((err) => {
        console.err(err)
      }).then((data) => {
        // If the data is retrieved successfully, update the state with the new data
        setExam1Data(data[0])
        setExam1Notes(data[1])
      })
      getExamById(allExams[selectedExam2].id).catch((err) => {
        console.err(err)
      }).then((data) => {
        setExam2Data(data[0])
        setExam2Notes(data[1])
      })
      getExamById(allExams[selectedExam3].id).catch((err) => {
        console.err(err)
      }).then((data) => {
        setExam3Data(data[0])
        setExam3Notes(data[1])
      })
    }
  }, [allExams.length])

  // This useEffect hook updates the exam data for exam1 whenever its selected value changes
  useEffect(() => {
    if (allExams.length !== 0) {
      getExamById(allExams[selectedExam1].id).catch((err) => { // Get the exam data for the selected exam1 by its id
        console.err(err)
      }).then((data) => {
        setExam1Data(data[0]) // If the data is retrieved successfully, update the state with the new data
        setExam1Notes(data[1])
      })
    }

  }, [selectedExam1])

  // This useEffect hook updates the exam data for exam2 whenever its selected value changes
  useEffect(() => {
    if (allExams.length !== 0) {
      getExamById(allExams[selectedExam2].id).catch((err) => { // Get the exam data for the selected exam2 by its id
        console.err(err)
      }).then((data) => {
        setExam2Data(data[0]) // If the data is retrieved successfully, update the state with the new data
        setExam2Notes(data[1])
      })
    }
  }, [selectedExam2])

  // This useEffect hook updates the exam data for exam3 whenever its selected value changes
  useEffect(() => {
    if (allExams.length !== 0) {
      getExamById(allExams[selectedExam3].id).catch((err) => { // Get the exam data for the selected exam2 by its id
        console.err(err)
      }).then((data) => {
        setExam3Data(data[0]) // If the data is retrieved successfully, update the state with the new data
        setExam3Notes(data[1])
      })
    }
  }, [selectedExam3])

  // This function updates the selectedExam1 state whenever its value changes
  const handleExam1Change = (e, r) => {
    setSelectedExam1(e.target.value)
  }

  // This function updates the selectedExam2 state whenever its value changes
  const handleExam2Change = (e, r) => {
    setSelectedExam2(e.target.value)
  }

  // This function updates the selectedExam3 state whenever its value changes
  const handleExam3Change = (e, r) => {
    setSelectedExam3(e.target.value)
  }
  return (
    <>
      
      <Box
        sx={{
          display: '-webkit-box',
          overflow: 'auto',
          gridTemplateColumns: { lg: '1fr 1fr' },
          paddingLeft: '20px',

        }}
      >
        <Box
          sx={{
            width: '95%',
            gap: '1rem',
            overflow: 'auto',
            p: '4px',
          }}
        >
          <Box sx={{ typography: 'body1' }}>
            <TabContext value={value} sx={{ padding: '5px' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: '0' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Previous Exams" value="1" />
                  <Tab label="All Questions" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {/* Exam 1 */}
                <Box sx={{ display: '-webkit-box', padding: '2px' }}>
                  <Box sx={{ display: 'grid' }}>
                    <MaterialReactTable
                      data={exam1Data}
                      columns={ExamColumns}
                      headerHeight={300}
                      enableRowSelection
                      enableSelectAll
                      enableColumnResizing={false}
                      enableColumnDragging={false}
                      enableGrouping
                      enableStickyHeader
                      enableStickyFooter
                      positionToolbarAlertBanner='bottom'
                      renderTopToolbarCustomActions={({ table }) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', p: '4px' }}>
                          <h2>{allExams[selectedExam1]?.name}</h2>
                          <Button
                            color="error"
                            disabled={table.getSelectedRowModel().rows.length === 0}
                            onClick={() => {
                              const trackingNumbersSelected = table.getSelectedRowModel().rows.map(item => item.original.trackingNumber);
                              multiSelectAddNew(trackingNumbersSelected)
                            }}
                            variant="contained"
                          >
                            Add Questions
                          </Button>
                        </Box>
                      )}
                      initialState={{
                        columnOrder: [
                          'mrt-row-expand',
                          'questionNum',
                          'trackingNumber',
                          'objectiveCode',
                          'sectionName',
                          'questionType',
                          'mrt-row-select'
                        ],
                        density: 'compact',
                        expanded: false,
                        grouping: ['sectionName'],
                        pagination: { pageIndex: 0, pageSize: 20 },
                        sorting: [{ id: 'questionNum', desc: false }],
                      }}
                      muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                      muiTableContainerProps={{ sx: { maxHeight: 400 } }} // max height 

                      renderDetailPanel={({ row }) => (
                        <Box
                          sx={{
                            display: 'grid',
                            margin: 'auto',
                            gridTemplateColumns: '1fr 1fr',
                            width: '100%',
                          }}
                        >
                          <Typography>Question Version: {row.original.questionVersion}</Typography>
                          <Typography>Question Type: {row.original.questionType} </Typography>
                          <hr />
                          <hr />
                          <Typography>English: {row.original.questionEnglish}</Typography>
                          <Typography>French: {row.original.questionFrench}</Typography>
                        </Box>
                      )}
                      positionExpandColumn="first"
                    />
                    <InputLabel sx={{ paddingTop: '20px', paddingBottom: '20px' }} id="demo-select-small">Select Exam 1</InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      onChange={(e, r) => handleExam1Change(e, r)}
                      value={selectedExam1}
                    >
                      {allExams.map((item, index) => (
                        <MenuItem value={index}>{item.name} {dateFormat(item.date)}</MenuItem>
                      ))}
                    </Select>
                    <br />
                    <h2>Registered Notes:</h2>
                    <textarea readOnly value={exam1Notes} />
                  </Box>

                  {/* Exam 2 */}
                  <Box sx={{ paddingLeft: '20px', color: "whitesmoke" }}>
                    <Box sx={{ display: 'grid' }}>
                      <MaterialReactTable
                        data={exam2Data}
                        columns={ExamColumns}
                        headerHeight={300}
                        enableRowSelection
                        enableSelectAll
                        enableColumnResizing={false}
                        enableColumnDragging={false}
                        enableGrouping
                        enableStickyHeader
                        enableStickyFooter
                        positionToolbarAlertBanner='bottom'
                        renderTopToolbarCustomActions={({ table }) => (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', p: '4px' }}>
                            <h2>{allExams[selectedExam2]?.name}</h2>
                            <Button
                              color="error"
                              disabled={table.getSelectedRowModel().rows.length === 0}
                              onClick={() => {
                                const trackingNumbersSelected = table.getSelectedRowModel().rows.map(item => item.original.trackingNumber);
                                multiSelectAddNew(trackingNumbersSelected)
                              }}
                              variant="contained"
                            >
                              Add Questions
                            </Button>
                          </Box>
                        )}
                        initialState={{
                          columnOrder: [
                            'mrt-row-expand',
                            'questionNum',
                            'trackingNumber',
                            'objectiveCode',
                            'sectionName',
                            'questionType',
                            'mrt-row-select'
                          ],
                          density: 'compact',
                          expanded: false,
                          grouping: ['sectionName'],
                          pagination: { pageIndex: 0, pageSize: 20 },
                          sorting: [{ id: 'questionNum', desc: false }],
                        }}
                        muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                        muiTableContainerProps={{ sx: { maxHeight: 400 } }} // max height 

                        renderDetailPanel={({ row }) => (
                          <Box
                            sx={{
                              display: 'grid',
                              margin: 'auto',
                              gridTemplateColumns: '1fr 1fr',
                              width: '100%',
                            }}
                          >
                            <Typography>Question Version: {row.original.questionVersion}</Typography>
                            <Typography>Question Type: {row.original.questionType} </Typography>
                            <hr />
                            <hr />
                            <Typography>English: {row.original.questionEnglish}</Typography>
                            <Typography>French: {row.original.questionFrench}</Typography>
                          </Box>
                        )}
                        positionExpandColumn="first"
                      />
                      <InputLabel sx={{ paddingTop: '20px', paddingBottom: '20px' }} id="demo-select-small">Select Exam 2</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        onChange={(e, r) => handleExam2Change(e, r)}
                        value={selectedExam2}
                      >
                        {allExams.map((item, index) => (
                          <MenuItem value={index}>{item.name} {dateFormat(item.date)}</MenuItem>
                        ))}
                      </Select>
                      <br />
                      <h2>Registered Notes:</h2>
                      <textarea readOnly value={exam2Notes} />
                    </Box>
                  </Box>

                  {/* Exam 3 */}
                  <Box sx={{ paddingLeft: '20px' }}>
                    <Box sx={{ display: 'grid' }}>
                      <MaterialReactTable
                        data={exam3Data}
                        columns={ExamColumns}
                        headerHeight={300}
                        enableRowSelection
                        enableSelectAll
                        enableColumnResizing={false}
                        enableColumnDragging={false}
                        enableGrouping
                        enableStickyHeader
                        enableStickyFooter
                        positionToolbarAlertBanner='bottom'
                        renderTopToolbarCustomActions={({ table }) => (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', p: '4px' }}>
                            <h2>{allExams[selectedExam3]?.name}</h2>
                            <Button
                              color="error"
                              disabled={table.getSelectedRowModel().rows.length === 0}
                              onClick={() => {
                                const trackingNumbersSelected = table.getSelectedRowModel().rows.map(item => item.original.trackingNumber);
                                multiSelectAddNew(trackingNumbersSelected)
                              }}
                              variant="contained"
                            >
                              Add Questions
                            </Button>
                          </Box>
                        )}
                        initialState={{
                          columnOrder: [
                            'mrt-row-expand',
                            'questionNum',
                            'trackingNumber',
                            'objectiveCode',
                            'sectionName',
                            'questionType',
                            'mrt-row-select'
                          ],
                          density: 'compact',
                          expanded: false,
                          grouping: ['sectionName'],
                          pagination: { pageIndex: 0, pageSize: 20 },
                          sorting: [{ id: 'questionNum', desc: false }],
                        }}
                        muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                        muiTableContainerProps={{ sx: { maxHeight: 400 } }} // max height 

                        renderDetailPanel={({ row }) => (
                          <Box
                            sx={{
                              display: 'grid',
                              margin: 'auto',
                              gridTemplateColumns: '1fr 1fr',
                              width: '100%',
                            }}
                          >
                            <Typography>Question Version: {row.original.questionVersion}</Typography>
                            <Typography>Question Type: {row.original.questionType} </Typography>
                            <hr />
                            <hr />
                            <Typography>English: {row.original.questionEnglish}</Typography>
                            <Typography>French: {row.original.questionFrench}</Typography>
                          </Box>
                        )}
                        positionExpandColumn="first"
                      />
                      <InputLabel sx={{ paddingTop: '20px', paddingBottom: '20px' }} id="demo-select-small">Select Exam 3</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        onChange={(e, r) => handleExam3Change(e, r)}
                        value={selectedExam3}
                      >
                        {allExams.map((item, index) => (
                          <MenuItem value={index}>{item.name} {dateFormat(item.date)}</MenuItem>
                        ))}
                      </Select>
                      <br />
                      <h2>Registered Notes:</h2>
                      <textarea readOnly value={exam3Notes} />
                    </Box>
                  </Box>
                </Box>

              </TabPanel>
              <TabPanel value="2">
                <MUIDataTable
                  title={"All Questions"}
                  data={allQuestions}
                  columns={
                    [...columnsMUI, {

                      name: "Select",
                      label: "Add",
                      options: {
                        filter: false,
                        customBodyRender: (value, tableMeta, updateValue) => (
                          <Button variant="text" onClick={() => handleSelect(tableMeta.tableData[tableMeta.rowIndex])} >Add</Button>
                        )
                      }

                    }]
                  }

                  options={{
                    download: true,
                    filter: true,
                    print: false,
                    selectableRows: 'multiple',
                    textLabels: {
                      body: {
                        noMatch: allQuestions.length === 0 ?
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
                    },
                    customToolbarSelect: (selectedRows, displayData) => (
                      <Button variant="text" onClick={() => multiSelectAdd(selectedRows, -1)}>Add</Button>
                    ),
                  }}
                />
              </TabPanel>
            </TabContext>
          </Box>

        </Box>

      </Box>

      <br />
      <form onSubmit={handleSubmit(onExamSubmit, onExamError)}>
        <Controller
          name="examName"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InputLabel htmlFor="examName" sx={{ marginRight: "1%",
                                                   color: "whitesmoke"
               }}>
                Exam Name:
              </InputLabel>
              <TextField sx={{ width: "10%", color: "whitesmoke" }}
                id="examName"
                variant="outlined"
                type="text"
                {...field}
              />
            </Box>
          )}
        />
        {errors.examName && (
          <FormHelperText error>
            Exam Name is required.
          </FormHelperText>
        )}

        <Button type="submit">
          Create
        </Button>

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
      </form>

    </>
  );
};

// deleted old code at line 1003