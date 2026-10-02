import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography, Container, Paper, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { setCredentials, logout } from './store/authSlice';
import Navbar from './components/Navbar';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#7c4dff' },
    background: { default: '#f4f6f9' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const ActivitiesDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleActivityAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ActivityForm onActivityAdded={handleActivityAdded} />
      <ActivityList refreshTrigger={refreshTrigger} />
    </Container>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && tokenData) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    logOut();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!token ? (
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              bgcolor: '#f4f6f9',
              px: 2
            }}
          >
            <Paper elevation={4} sx={{ p: 5, borderRadius: 4, maxWidth: 450, textAlign: 'center', bgcolor: '#fff' }}>
              <FitnessCenterIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="700" gutterBottom>
                FitnessPulse AI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Log workouts, track your calories, and get personalized recommendations driven by Gemini AI.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={() => logIn()}
                sx={{ borderRadius: 2.5, py: 1.5, fontSize: '1.05rem', fontWeight: 600, textTransform: 'none' }}
              >
                Log In to Fitness App
              </Button>
            </Paper>
          </Box>
        ) : (
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar user={tokenData} onLogout={handleLogout} />
            <Routes>
              <Route path="/activities" element={<ActivitiesDashboard />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
            </Routes>
          </Box>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
