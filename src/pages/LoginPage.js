import React from "react";
import { useMsal } from "@azure/msal-react";

import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Stack, Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { loginRequest } from "../authConfig";

// hooks
import useResponsive from '../hooks/useResponsive';
// components
// import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections




// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  /* boxShadow: theme.customShadows.card, */
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------
// Define the LoginPage component
export default function LoginPage() {
  // Use custom hook to determine if screen size is medium or larger
  const mdUp = useResponsive('up', 'md'); 
  const { instance } = useMsal();  // Use custom hook to get instance of MSAL
  const navigate = useNavigate();   // Use Navigate hook to redirect user
  // Function to handle login button click
  const handleLogin = (loginType) => {
    // If user clicked "Sign in with popup" button, log them in using popup
    if (loginType === "popup") {
      instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      })
    }
  }
  return (
    <>
      <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet>

      <StyledRoot>
        {/* <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        /> */}

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to Exam DB
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Log in with Azure {''}
            </Typography>

            <Stack direction="row" spacing={2}>
              {/* <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button> */}

              <Button name="loginBtn" fullWidth size="large" color="inherit" variant="outlined" onClick={() => handleLogin("popup")}>
                <Iconify icon="vscode-icons:file-type-azure" color="#1C9CEA" width={22} height={22} />
              </Button>
            </Stack>


          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}