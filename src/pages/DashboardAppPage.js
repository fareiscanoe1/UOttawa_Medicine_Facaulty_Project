import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, Modal, Button, TextField, Stack } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
//  branding logo
import logo from '../pictures/FM_Family Medicine-WHITE Logo-Horizontal.png'
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      {/* Top Navigation Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: '#5A4E75',
          color: 'white',
        }}
      >
        <Box display="flex" alignItems="center">
          <Box component="img" src={logo} alt="uOttawa Logo" sx={{ width: 120, mr: 2 }} />
          <Typography variant="h6">Welcome to the Exam Manager!</Typography>
        </Box>
      </Box>
      
      <Container maxWidth="xl" sx = {{ mt: '2%' }}>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Exams" total={5} icon={'healthicons:i-exam-multiple-choice-outline'}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Questions" total={100} icon={'tabler:map-question'}  />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Objectives" total={163} icon={'pajamas:issue-type-objective'}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={15} color="error" icon={'ant-design:bug-filled'} />
          </Grid>


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

          
          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/10/2023',
                '02/10/2023',
                '03/10/2023',
                '04/10/2023',
                '05/10/2023',
                '06/10/2023',
                '07/10/2023',
                '08/10/2023',
                '09/10/2023',
                '10/10/2023',
                '11/10/2023',
              ]}
              chartData={[
                {
                  name: 'Alex',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Ricardo',
                  type: 'column',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits in past week"
              chartData={[
                { label: 'Alex', value: 20 },
                { label: 'Ricardo', value: 15 }
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6}>
            <AppTrafficBySite
              title="Traffic by Browser in past week"
              list={[
                {
                  name: 'Chrome',
                  value: 20,
                  icon: <Iconify icon={'ant-design:bug-filled'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Opera GX',
                  value: 10,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Edge',
                  value: 2,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                }
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Save Button needs fixing when editing old exam' },
                { id: '2', label: 'Allow creation of questions from the exam builder' },
                { id: '3', label: 'Do not allow duplicate exam names' },
                { id: '4', label: 'Review flags entry field in the exam view UI' }
              ]}
            />
          </Grid> */}

            {/* <Box      larger logo
              sx = {{
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
            </Box> */}
        </Grid>
      </Container>
    </>
  );
}
