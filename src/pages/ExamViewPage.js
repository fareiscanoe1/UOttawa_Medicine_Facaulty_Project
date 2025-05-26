import { useNavigate, Link, redirect, useLocation } from 'react-router-dom';
import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';

import { Box, Button, Typography, Stack, List } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import MUIDataTable from "mui-datatables";
import TextField from '@mui/material/TextField';
import { TailSpin } from 'react-loader-spinner'
import {updateExamDifficulty, updateExamDiscrimination, updateExamFlags, getExamByIdentifier} from "../services/ExamServices"

// Updates the difficulty of a question
async function updateDifficulty(requestInfo) {
  console.log(requestInfo) // Log the request information to the console
  const temp = new FormData();
  temp.append("examSectionId", requestInfo.examSectionId);
  temp.append("questionId", requestInfo.questiondId);
  temp.append("questionVersionNumber", requestInfo.questionVersionNumber);
  temp.append("difficulty", requestInfo.difficulty);
  console.log("temp", temp) // Log the FormData object to the console
  // Make a POST request to update the difficulty of the question
  const response = await updateExamDifficulty(temp)
  return response // Return the response
}

// Updates the discrimination of a question
async function updateDiscrimination(requestInfo) {
  const temp = new FormData();
  // Add necessary data to the FormData object
  temp.append("examSectionId", requestInfo.examSectionId);
  temp.append("questionId", requestInfo.questiondId);
  temp.append("questionVersionNumber", requestInfo.questionVersionNumber);
  temp.append("discrimination", requestInfo.discrimination);
  console.log("temp", temp) // Log the FormData object to the console
  // Make a POST request to update the discrimination of the question
  const response = await updateExamDiscrimination(temp)
  return response // Return the response
}

// Updates the flags of a question
async function updateFlags(requestInfo) {
  const temp = new FormData();
  // Add necessary data to the FormData object
  temp.append("examSectionId", requestInfo.examSectionId);
  temp.append("questionId", requestInfo.questiondId);
  temp.append("questionVersionNumber", requestInfo.questionVersionNumber);
  temp.append("flags", requestInfo.flags);
  // Make a POST request to update the flags of the question
  const response = await updateExamFlags(temp)
  return response // Return the response
}

// Retrieves an exam's information by ID
async function getExamById(id) {
  try {
    // Make a GET request to retrieve the exam information
    const response = await getExamByIdentifier(id)
    if (response.ok) {
      // If the response is successful, parse the data and log it to the console
      const data = await response.json();
      console.log(data)

      // Extract the sections and questions from the exam data
      const sections = [];
      for (let i = 0; i < data.sections.length; i += 1) {
        const questions = []
        const sectionType = data.sections[i]?.type;
        const sectionId = data.sections[i]?.sectionId;
        for (let j = 0; j < data.sections[i]?.questions.length; j += 1) { // IF U WANT TO ADD MORE DATA LATER U DO IT HERE
          const rowData = {}
          const currQuestion = data.sections[i]?.questions[j];
          const currQuestionDetails = currQuestion?.question;

          // Extract necessary information about the question
          rowData.trackingNumber = currQuestionDetails.questionTrackingNumber;
          rowData.objectiveHeading = currQuestionDetails.objective.objectiveCode.objectiveHeading;
          rowData.associatedObj = currQuestionDetails.objective.objectiveCode.objectiveCodeId
          rowData.objectiveNum = currQuestionDetails.objective.objectiveNumber;
          rowData.sectionId = data.sections[i]?.sectionId;

          rowData.questionId = currQuestionDetails?.id?.questionId;
          rowData.questionVersion = currQuestionDetails?.id?.versionNumber;
          rowData.sectionName = data.sections[i]?.type
          rowData.questionNum = currQuestion?.questionNumberOnExam
          rowData.questionType = currQuestionDetails.type


          rowData.question = currQuestionDetails.questionEnglish;
          rowData.questionFrench = currQuestionDetails.questionFrench;
          rowData.questionType = currQuestionDetails.type;

          rowData.discrimination = currQuestion.manualDiscrimination;
          rowData.difficulty = currQuestion.manualDifficulty;
          rowData.overalDiff = currQuestionDetails.overallDifficulty;
          rowData.overalDisc = currQuestionDetails.overallDiscrimination;
          rowData.flags = currQuestion.flags;
          console.log("here123", rowData.flags, currQuestion, data)
          const questionOptions = currQuestionDetails?.optionList?.map(item => {
            return {
              optionFrench: item.optionFrench,
              optionEnglish: item.optionEnglish,
              correct: item.correct
            };
          });
          rowData.options = questionOptions;
          questions?.push(rowData)
        }
        sections.push({ sectionId, sectionName: sectionType, allQuestions: questions });
      }
      return sections
    }
  } catch (error) {
    console.error(error);
  }
  return []
}

export default function ExamsPage(Data) {
  const { state } = useLocation(); // gets the state from the current location
  const { rowData } = state || {}; // destructures the rowData from the state, or sets it to an empty object if the state is undefined

  const [table, setTable] = useState([]); // sets the initial state for the 'table' variable to an empty array
  const [questionsAdded, setQuestionsAdded] = useState([]); // sets the initial state for the 'questionsAdded' variable to an empty array
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { // useEffect hook is used to run some code after the component mounts
    const fetchdata = async () => {  // async function that fetches some data
      console.log(rowData) // logs the rowData object to the console
      try {
        const sections = await getExamById(rowData.id); // gets the exam data by ID using the 'getExamById' function
        // console.log("test")
        // console.log(sections);

        setTable(sections) // sets the 'table' state to the 'sections' data
        setIsLoading(false); // Set loading to false after fetching data

        let tempAllQuestions = [];
        for (let i = 0; i < sections.length; i += 1) {
          tempAllQuestions = tempAllQuestions.concat(sections[i].allQuestions); // creates a temporary array of all questions by iterating over each section and concatenating their 'allQuestions' arrays
        }
        // console.log("here")
        // console.log(tempAllQuestions);
        setQuestionsAdded(tempAllQuestions); // sets the 'questionsAdded' state to the temporary array of all questions


        // console.log(sections.filter((i) => i.sectionName === "MCQ")[0].allQuestions)
      } catch (e) {
        console.log(e) // logs any errors that occur during the fetch to the console
      } finally {
        setIsLoading(false);
        console.log("Loading state updated to false");
      }
    }
    fetchdata(); // calls the 'fetchdata' function
  }, []); // the empty array as the second argument to useEffect means that the code inside the useEffect block will only run once, on mount


  // const [textValue, setTextValue] = useState(Array(data.length).fill(""));

  // const handleTextChange = (event, rowIndex) => {
  //   const newValues = [...textValue];
  //   newValues[rowIndex] = event.target.value;
  //   setTextValue(newValues);
  // }
  // const saveData = (rowIndex) => {
  // const value = textValue[rowIndex];
  // Do something with the value (e.g. save it to a database or send it to a server)
  // console.log(`Saving value for row ${rowIndex}: ${value}`);
  // }

  const overviewColumns = useMemo(
    () => [
      {
        header: 'Code',
        accessorKey: 'associatedObj',
      },
      {
        header: 'Tracking Number',
        accessorKey: 'trackingNumber',
      },
      {
        header: 'Section',
        accessorKey: 'sectionName',
      },
      {
        header: 'Number on Exam',
        accessorKey: 'questionNum',
      },

    ],
  );

  const columnsMUI1 = [
    {
      name: "questionNum",
      label: "Question Number",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "objectiveHeading",
      label: "Objective Heading",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }

    },
    {
      name: "associatedObj",
      label: "Objective Code",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }

    },
    {
      name: "objectiveNum",
      label: "Objective Number",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }

    },
    {
      name: "trackingNumber",
      label: "Tracking Number",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }

    },
    {
      name: "questionVersion",
      label: "Question Version",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "question",
      label: "Question",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
      }
    },
    {
      name: "questionType",
      label: "Question Type",
      options: {
        filter: true,
        sort: true,
        filterType: "dropdown",
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "overalDiff",
      label: "Overall Difficulty",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }
    },
    {
      name: "overalDisc",
      label: "Overall Discrimination",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        setCellProps: () => ({ style: { width: "1px" } })
      }
    }
    

  ];


  const option1 = {
    filter: true,
    sort: true,
    customBodyRender: (value, tableMeta, updateValue) => {

      return (
        <TextField required defaultValue={value}
          onChange={event => updateValue(event.target.value)}

          InputProps={{
            readOnly: false,

          }}

        />

      )
    }
  }

  const columnsMUI2 = [
    {
      name: "objectiveHeading",
      label: "Objective Heading",
      options: {
        filter: true,
        sort: true,
      }

    },
    {
      name: "associatedObj",
      label: "Objective Code",
      options: {
        filter: true,
        sort: true,
      }

    },
    {
      name: "objectiveNum",
      label: "Objective Number",
      options: {
        filter: true,
        sort: true,
      }

    },
  ];


  const columnsMUI3 = [
    {
      name: "associatedObj",
      label: "Objective Code",
      options: {
        filter: true,
        sort: true,
      }

    },
    {
      name: "objectiveHeading",
      label: "Objective Heading",
      options: {
        filter: true,
        sort: true,
      }

    },

    {
      name: "numMCQ",
      label: "MCQs",
      options: {
        filter: true,
        sort: true,
      }

    },
    {
      name: "numCDMQ",
      label: "CDMQs",
      options: {
        filter: true,
        sort: true,
      }

    },
  ];

  async function handleDifficultyChange(data, value) {
    // This line of code assigns the section name from the first row of "data" object, if it exists
    const section = data.tableData[0]?.sectionName
    // This line of code converts the "value" to a number
    const num = Number(value)
    // This line of code finds a question in the table and assigns it to "temp" variable
    const temp = table.filter(obj => obj.sectionName === section)[0].allQuestions.find(q => q.trackingNumber === String(data.rowData[4]))
    // console.log("here", table)
    const obj = {
      examSectionId: temp.sectionId,
      questiondId: temp.questionId,
      questionVersionNumber: temp.questionVersion,
      difficulty: num
    }
    console.log(obj)
    // This line of code calls an async function to update difficulty
    await updateDifficulty(obj)

  }

  async function handleDiscriminationChange(data, value) {
    // Extract the section name and numerical value from the passed in data and value arguments
    const section = data.tableData[0]?.sectionName
    const num = Number(value)
    // Filter the table to find the corresponding question object, and create a new object with the updated discrimination value
    const temp = table.filter(obj => obj.sectionName === section)[0].allQuestions.find(q => q.trackingNumber === String(data.rowData[4]))
    // console.log("here", table)
    const obj = {
      examSectionId: temp.sectionId,
      questiondId: temp.questionId,
      questionVersionNumber: temp.questionVersion,
      discrimination: num
    }
    // Log the updated object and update the server with the new discrimination value
    console.log(obj)
    await updateDiscrimination(obj)

  }

  async function handleFlagsChange(data, value) {
    // Extract the section name and string value from the passed in data and value arguments
    const section = data.tableData[0]?.sectionName
    const num = String(value)
    // Filter the table to find the corresponding question object, and create a new object with the updated flags value
    const temp = table.filter(obj => obj.sectionName === section)[0].allQuestions.find(q => q.trackingNumber === String(data.rowData[4]))
    const obj = {
      examSectionId: temp.sectionId,
      questiondId: temp.questionId,
      questionVersionNumber: temp.questionVersion,
      flags: num
    }
    // Log the updated object and update the server with the new flags value
    console.log(obj)
    await updateFlags(obj)
  }

  // Define a state and function to toggle an open/closed menu
  const toggleMenu = () => {
    setOpen(!open);
  };

  const [open, setOpen] = useState(false);

  // Define a state and function to keep track of the currently selected page number
  const [page, setPage] = React.useState('1');

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  // Define a state and function to keep track of the currently selected value for a different component
  const [value2, setValue2] = React.useState('1');

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };


//    if (tableLoading) {
//      return <TailSpin
//                 height="80"
//                 color="grey"
//                 width="80"
//                 radius="1"
//                 ariaLabel="tail-spin-loading"
//                 wrapperClass=""
//                 wrapperStyle={{}}
//                 textAlign='center'
//                 />; // Show loading spinner while data is being fetched
//    }
//
//    if (table.length === 0) {
//      return <div>No data available</div>; // Show message when there is no data
//    }


  return (
    <>
      <div>Viewing {rowData.Exam}, {rowData.Date}</div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Tooltip title="View Exam stats">
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={toggleMenu}
          > <span
            style={{
              // This makes it feel animated:
              transition: "transform 200ms linear",
              // This rotates the element:
              transform: `rotateZ(${open ? 0 : "180deg"})`,
              display: "inline-block",
            }}
          >
              {"<"}
            </span>
          </button>
        </Tooltip>

        {open && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              right: '80px',
              transform: 'translateY(-50%)',
              backgroundColor: '#fff',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
              padding: '20px',
              borderRadius: '5px',
              zIndex: 9999,
            }}
          >
            <h2 style={{ margin: '0 0 10px' }}>IDK YET</h2>
            <p style={{ margin: 0 }}>
              <ul>ok
                {/* {stats.map((item, index) => {
                            return <li key = {index}>{item}</li>;
                        })} */}
              </ul>
            </p>
          </div>
        )}
      </div>
      <Box
        sx={{
          display: '-webkit-box',
          overflow: 'auto',
          gridTemplateColumns: { lg: '1fr 1fr' },

        }}
      >
        <Box
          sx={{
            width: '100%',
            gap: '1rem',
            overflow: 'auto',
            p: '4px',
          }}
        >
          <Box sx={{ typography: 'body1' }}>
            <TabContext value={page} sx={{ padding: '5px' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: '0' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="MCQ" value="1" />
                  <Tab label="CDMQ" value="2" />
                  <Tab label="Overview" value="3" />
                  {/* <Tab label="Overview" value="4" /> */}
                </TabList>
              </Box>

              <TabPanel value="1">
                <MUIDataTable
                  data={table.filter((i) => i.sectionName === "MCQ")[0]?.allQuestions}
                  columns={
                    [...columnsMUI1, {
                      name: "difficulty",
                      label: "Difficulty",
                      options: {
                        filter: false,
                        // sort: true,
                        // filterType: "textField",
                        setCellProps: () => ({ style: { width: "1px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                          const textfield = React.createRef()
                          return (
                            <>
                              <TextField
                                ref={textfield}
                                value={value}
                                type="number"
                                onChange={(event) => {
                                  value = event.target.value;
                                  updateValue(event.target.value);
                                }}
                              />
                              <Button onClick={() => handleDifficultyChange(tableMeta, value)}>
                                Save
                              </Button>
                            </>
                          );
                        },
                      }

                    },
                    {
                      name: "discrimination",
                      label: "Discrimination",
                      options: {
                        filter: false,
                        // sort: true,
                        // filterType: "textField",
                        setCellProps: () => ({ style: { width: "1px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                          const textfield = React.createRef()
                          return (
                            <>
                              <TextField
                                ref={textfield}
                                value={value}
                                onChange={(event) => {
                                  value = event.target.value;
                                  updateValue(event.target.value);
                                }}
                              />
                              <Button onClick={() => handleDiscriminationChange(tableMeta, value)}>
                                Save
                              </Button>
                            </>
                          );
                        },
                      }

                    },
                    {
                      name: "flags",
                      label: "Flag",
                      options: {
                        filter: false,
                        // sort: true,
                        // filterType: "textField",
                        setCellProps: () => ({ style: { width: "1px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                          const textfield = React.createRef()
                          return (
                            <>
                              <TextField
                                ref={textfield}
                                value={value}
                                onChange={(event) => {
                                  value = event.target.value;
                                  updateValue(event.target.value);
                                }}
                              />
                              <Button onClick={() => handleFlagsChange(tableMeta, value)}>
                                Save
                              </Button>
                            </>
                          );
                        },
                      }

                    },
                    ]
                  }
                  options={{
                    selectableRows: "none",
                    editable: 'onCellEdit',
                    textLabels: {
                      body: {
                          noMatch: isLoading ?
                                  <TailSpin height="80" color="grey" width="80" radius="1" ariaLabel="tail-spin-loading" wrapperClass="" wrapperStyle={{}} textAlign='center' />
                                  : 'No data to display',
                      },
                    },

                  }}

                />
              </TabPanel>

              <TabPanel value="2">
                <MUIDataTable
                  data={table.filter((i) => i.sectionName === "CDMQ")[0]?.allQuestions}
                  columns={
                    [...columnsMUI1, {
                      name: "difficulty",
                      label: "Difficulty",
                      options: {
                        filter: false,
                        // sort: true,
                        // filterType: "textField",
                        setCellProps: () => ({ style: { width: "1px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                          const textfield = React.createRef()
                          return (
                            <>
                              <TextField
                                ref={textfield}
                                value={value}
                                onChange={(event) => {
                                  value = event.target.value;
                                  updateValue(event.target.value);
                                }}
                              />
                              <Button onClick={() => handleDifficultyChange(tableMeta, value)}>
                                Save
                              </Button>
                            </>
                          );
                        },
                      }

                    },
                    {
                      name: "discrimination",
                      label: "Discrimination",
                      options: {
                        filter: false,
                        // sort: true,
                        // filterType: "textField",
                        setCellProps: () => ({ style: { width: "1px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                          const textfield = React.createRef()
                          return (
                            <>
                              <TextField
                                ref={textfield}
                                value={value}
                                onChange={(event) => {
                                  value = event.target.value;
                                  updateValue(event.target.value);
                                }}
                              />
                              <Button onClick={() => handleDiscriminationChange(tableMeta, value)}>
                                Save
                              </Button>
                            </>
                          );
                        },
                      }

                    },
                    {
                      name: "flags",
                      label: "Flag",
                      options: {
                        filter: false,
                        // sort: true,
                        // filterType: "textField",
                        setCellProps: () => ({ style: { width: "1px" } }),
                        customBodyRender: (value, tableMeta, updateValue) => {
                          const textfield = React.createRef()
                          return (
                            <>
                              <TextField
                                ref={textfield}
                                value={value}
                                onChange={(event) => {
                                  value = event.target.value;
                                  updateValue(event.target.value);
                                }}
                              />
                              <Button onClick={() => handleFlagsChange(tableMeta, value)}>
                                Save
                              </Button>
                            </>
                          );
                        },
                      }

                    }]
                  }

                  options={{
                    selectableRows: "none",
                    textLabels: {
                      body: {
                        noMatch: isLoading ?
                                  <TailSpin height="80" color="grey" width="80" radius="1" ariaLabel="tail-spin-loading" wrapperClass="" wrapperStyle={{}} textAlign='center' />
                                  : 'No data to display',
                      },
                    },
                  }}
                />
              </TabPanel>

              <TabPanel value="3">
                <MaterialReactTable
                  columns={overviewColumns}
                  data={questionsAdded}
                  enableColumnResizing
                  enableColumnDragging={false}
                  enableGrouping
                  enableStickyHeader
                  enableStickyFooter
                  initialState={{
                    density: 'compact',
                    expanded: false,
                    grouping: ['associatedObj'],
                    pagination: { pageIndex: 0, pageSize: 20 },
                    sorting: [{ id: 'associatedObj', desc: false }],
                  }}

                  muiToolbarAlertBannerChipProps={{ color: 'primary' }}
                  muiTableContainerProps={{ sx: { maxHeight: 700 } }}
                  renderDetailPanel={({ row }) => (
                    <Box
                      sx={{
                        display: 'grid',
                        margin: 'auto',
                        gridTemplateColumns: '1fr 1fr',
                        width: '100%',
                      }}
                    >
                      <Typography>Tracking Number: {row.original.trackingNumber}</Typography>
                      <Typography>Question Type: {row.original.questionType}</Typography>
                      <Typography>Objective Heading: {row.original.objectiveHeading}</Typography>
                      <Typography>Objective Number: {row.original.objectiveNum} </Typography>
                      <hr />
                      <hr />
                      <Typography>English: {row.original.question}</Typography>
                      <Typography>French: {row.original.questionFrench}</Typography>


                    </Box>
                  )}
                  positionExpandColumn="first"
                />
              </TabPanel>

              {/* <TabPanel value="4">
                <MUIDataTable
                  data={data4}
                  columns={
                    [...columnsMUI3]
                  }

                  options={{
                    selectableRows: "none",
                  }}
                />
              </TabPanel> */}

            </TabContext>

          </Box>
          <br />
          <h2>Exam Notes:</h2>
          <textarea className="w-100" value={rowData.notes}/>
        </Box>
      </Box>


    </>
  );
}