import { Helmet } from 'react-helmet-async';
import MUIDataTable from "mui-datatables";
// @mui
import { TailSpin } from 'react-loader-spinner'
import { Container, Stack, Typography, Button, Box } from '@mui/material';
import { useEffect, useState } from "react";
import { useNavigate, Link, redirect } from 'react-router-dom';
import Iconify from '../components/iconify';
import { dateFormat, parseDateString } from '../utils/customDate';

import {fetchAllExams} from "../services/ExamServices"

// branding logo
import logo from '../pictures/FM_Family Medicine-WHITE Logo-Horizontal.png'

// Create a functional component named ExamsPage
export default function ExamsPage() {
  // Initialize variables using the useState and useNavigate hooks
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [error, setError] = useState(false); // New error state

  useEffect(() => {
    const fetchata = async () => {
      try {
          const response = await fetchAllExams();
          const data = await response.json();
          const tempRow = [];
          for (let i = 0; i < data.length; i += 1) {
            tempRow.push({ Exam: data[i]?.name, Date: dateFormat(data[i]?.dateCreated), id: data[i]?.id, notes: data[i]?.notes });
          }
          setRows(tempRow);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching exams:", err);
          setIsLoading(false);
          setError(true);
        }
    }
    // Call the fetchData function
    fetchata();
  }, []);
  // Define columns to be displayed in the table
  const columns = [
    {
      name: "Exam",
      label: "Exam Name",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
      }
    },
    {
      name: "Date",
      label: "Date Created",
      options: {
        filter: true,
        sort: true,
        filterType: "textField",
        sortDirection: 'asc',
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
    },

  ];
  // Create a dummy data for the table
  const data1 = [
    { Exam: "exam1", Date: "2023-03-25" },
    { Exam: "exam2", Date: "2023-04-25" }
  ]
  // Define options for the table
   const options = {
      download: false,
      filter: true,
      sort: true,
      print: false,
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: isLoading ? (
            <TailSpin
              height="80"
              color="grey"
              width="80"
              radius="1"
              ariaLabel="tail-spin-loading"
              wrapperClass=""
              wrapperStyle={{}}
              textAlign='center'
            />
          ) : 'No data to display',
        },
      },
      onRowClick: (rowData, rowMeta) => redirectToExamViewPage(rows[rowMeta.dataIndex]),
    };

  // Define a function to redirect to the exam view page
  const redirectToExamViewPage = (data) => {
    console.log(data);
    navigate("view", { state: { rowData: data } })
  }
  // Render the table with columns, rows, and options defined
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
            right: 530,
          }}
        >
          <img src= {logo} alt= 'Logo' style={{width:'150px', height: 'auto'}}/>
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }} color = "whitesmoke">
            Exams
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => navigate("new")}>
            New Exam
          </Button>
        </Stack>

        <MUIDataTable

          data={rows}
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
