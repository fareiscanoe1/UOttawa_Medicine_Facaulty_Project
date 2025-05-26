import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

// @mui
import { Container, Stack, Typography, Button, Box } from '@mui/material';
import MUIDataTable from "mui-datatables";

import { useNavigate } from 'react-router-dom';
import {TailSpin } from 'react-loader-spinner'
import Iconify from '../components/iconify';
import { getAllQuestions } from '../services/QuestionServices';
import { dateFormat, parseDateString } from '../utils/customDate';
// branding logo
import logo from '../pictures/FM_Family Medicine-WHITE Logo-Horizontal.png'


// ----------------------------------------------------------------------

export default function QuestionsPage() {
  const navigate = useNavigate();
  const columns = [
    {
      name: "trackingNumber",
      label: "Question Tracking Number",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
      }
    },
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
      name: "questionEnglish",
      label: "English Question",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
      }
    },
    {
      name: "overallDifficulty",
      label: "Overall Difficulty",
      options: {
        filter: false,
        sort: true
      }
    },
    {
      name: "overallDiscrimination",
      label: "Overall Discrimination",
      options: {
        filter: false,
        sort: true
      }
    },
    {
      name: "type",
      label: "Question Type",
      options: {
        filter: true,
        sort: true,
        filterType: "dropdown",
      }
    },
    {
      name: "dateOfChange",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        filterType: "dropdown",
        sortCompare: (order) => {
          return (string1, string2) => {
            const date1 = parseDateString(string1.data);
            const date2 = parseDateString(string2.data);
            if (date1 < date2) {
              return order === 'asc' ? -1 : 1;
            }
            if (date1 > date2) {
              return order === 'asc' ? 1 : -1;
            } 
            return 0;
          };
        }
      }
    }

  ];


  const [displayedData, setDisplayedData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchata = async () => {
     try {
          const response = await getAllQuestions()
          const data = await response.json();

          const retrievedData = []
          for (let i = 0; i < data.length; i += 1) {
            const rowData = {};
            rowData.trackingNumber = data[i]?.questionTrackingNumber;
            rowData.heading = data[i]?.objective?.objectiveCode?.objectiveHeading;
            rowData.code = data[i]?.objective?.objectiveCode?.objectiveCodeId;
            rowData.objectiveNumber = data[i]?.objective?.objectiveNumber;
            rowData.questionEnglish = data[i]?.questionEnglish;
            rowData.questionFrench = data[i]?.questionFrench;
            rowData.overallDifficulty = data[i]?.overallDifficulty;
            rowData.overallDiscrimination = data[i]?.overallDiscrimination;
            rowData.author = data[i]?.authorOfChange;
            rowData.dateOfChange = dateFormat(data[i]?.dateOfChange)
            rowData.reference = data[i]?.referenceArticleOrBook;
            rowData.type = data[i]?.type;
            retrievedData?.push(rowData)
            // TODO add columns for this data
          }
          setDisplayedData(retrievedData);
          console.log(retrievedData)
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setIsDataLoaded(true); // Set flag to true after data fetching is complete
          }
    };
    fetchata();
  }, []);

  const redirectToEditQuestionPage = (data) => {
    console.log(data);
    navigate("edit", { state: { trackingNumber: data[0] } })
  }
  const options = {
    download: true,
    filter: true,
    print: false,
    selectableRows: 'none',
    textLabels: {
          body: {
            noMatch: isDataLoaded ?
              'No data to display' : // Show this message if data is loaded but empty
              <TailSpin
                height="80"
                color="grey"
                width="80"
                radius="1"
                ariaLabel="tail-spin-loading"
                wrapperClass=""
                wrapperStyle={{}}
                textAlign='center'
              />,
          },
    },
    onRowClick: rowData => redirectToEditQuestionPage(rowData)

  };
  return (
    <>
      <Helmet>
        <title> Exam Database </title>
      </Helmet>

      <Container maxWidth="xl">
        <Box
          sx={{
            position: "fixed",
            top: '30%' ,
            left: '50%' ,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src= {logo} alt= 'Logo' style={{width:'300px', height: 'auto'}}/>
        </Box>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={-30}>
          <Typography variant="h4" sx={{ mb: '45%' }} >
            .
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => navigate("new")}>
            New Questions
          </Button>
        </Stack>

        <MUIDataTable
          data={displayedData}
          // TODO change this to displayedData when db endpoint exists ^^^^^^
          columns={columns}
          options={options}

        />

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
