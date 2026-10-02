import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Button, FormControl, 
  InputLabel, MenuItem, Select, TextField, Grid, CircularProgress, Alert 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration || !activity.caloriesBurned) {
      setError('Please fill in both duration and calories burned.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        type: activity.type,
        duration: parseInt(activity.duration, 10),
        caloriesBurned: parseInt(activity.caloriesBurned, 10),
        startTime: new Date().toISOString()
      };

      await addActivity(payload);
      setSuccess(true);
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '' });
      if (onActivityAdded) {
        onActivityAdded();
      }
    } catch (err) {
      console.error('Failed to log activity:', err);
      setError(err?.response?.data?.message || 'Failed to log activity. Ensure services are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3, mb: 4, bgcolor: '#ffffff' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AddCircleOutlineIcon color="primary" />
          <Typography variant="h6" fontWeight="700">
            Log New Fitness Activity
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Activity logged successfully! AI AI recommendation processing in background.</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="medium">
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={activity.type}
                  label="Activity Type"
                  onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                >
                  <MenuItem value="RUNNING">🏃 Running</MenuItem>
                  <MenuItem value="WALKING">🚶 Walking</MenuItem>
                  <MenuItem value="CYCLING">🚴 Cycling</MenuItem>
                  <MenuItem value="SWIMMING">🏊 Swimming</MenuItem>
                  <MenuItem value="WEIGHT_TRAINING">🏋️ Weight Training</MenuItem>
                  <MenuItem value="YOGA">🧘 Yoga</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Duration (Minutes)"
                type="number"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ borderRadius: 2, textTransform: 'none', px: 4, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log Activity'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;