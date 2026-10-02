import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container, Chip } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const userName = user?.name || user?.preferred_username || user?.email || 'User';

  return (
    <AppBar position="sticky" elevation={2} sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box 
            onClick={() => navigate('/activities')} 
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
              <FitnessCenterIcon />
            </Avatar>
            <Typography variant="h6" fontWeight="700" sx={{ letterSpacing: 0.5, color: '#fff' }}>
              FitnessPulse AI
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<PersonIcon sx={{ color: '#fff !important' }} />} 
              label={userName} 
              sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.15)', fontWeight: 500 }}
            />
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={() => onLogout()}
              sx={{ borderRadius: 2, textTransform: 'none', px: 2, fontWeight: 600 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
