import React, { useEffect, useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Chip, 
  Paper, CircularProgress, Alert, Button 
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const getActivityIcon = (type) => {
  switch (type) {
    case 'RUNNING': return <DirectionsRunIcon color="primary" />;
    case 'WALKING': return <DirectionsWalkIcon color="success" />;
    case 'CYCLING': return <DirectionsBikeIcon color="info" />;
    case 'SWIMMING': return <PoolIcon color="secondary" />;
    case 'WEIGHT_TRAINING': return <FitnessCenterIcon color="warning" />;
    case 'YOGA': return <SelfImprovementIcon color="action" />;
    default: return <FitnessCenterIcon color="primary" />;
  }
};

const ActivityList = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getActivities();
      setActivities(response.data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Could not load activities. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  const totalCalories = activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
  const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Stat Summary Header */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f0f7ff' }}>
            <FitnessCenterIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Total Workouts</Typography>
              <Typography variant="h5" fontWeight="700">{activities.length}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff3e0' }}>
            <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#ed6c02' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Total Calories Burned</Typography>
              <Typography variant="h5" fontWeight="700">{totalCalories} kcal</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e8f5e9' }}>
            <AccessTimeIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">Active Time</Typography>
              <Typography variant="h5" fontWeight="700">{totalDuration} mins</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Activity Grid */}
      <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
        Recent Activities
      </Typography>

      {activities.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#fafafa' }}>
          <Typography color="text.secondary">No fitness activities logged yet. Use the form above to add your first workout!</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {activities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  borderRadius: 3, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justify: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getActivityIcon(activity.type)}
                      <Typography variant="h6" fontWeight="700">
                        {activity.type}
                      </Typography>
                    </Box>
                    <Chip 
                      icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />} 
                      label="AI Feedback" 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                    <Chip icon={<AccessTimeIcon />} label={`${activity.duration} mins`} variant="outlined" />
                    <Chip icon={<LocalFireDepartmentIcon />} label={`${activity.caloriesBurned} kcal`} variant="outlined" color="warning" />
                  </Box>

                  {activity.createdAt && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Logged on: {new Date(activity.createdAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    View Details & AI Insights
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ActivityList;