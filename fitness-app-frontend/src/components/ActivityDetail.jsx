import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityById, getActivityRecommendation } from '../services/api';
import { 
  Box, Card, CardContent, Divider, Typography, Button, 
  Chip, Grid, Paper, CircularProgress, Alert 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch activity
        const activityRes = await getActivityById(id);
        setActivity(activityRes.data);

        // Fetch AI recommendation
        try {
          const recRes = await getActivityRecommendation(id);
          setRecommendation(recRes.data);
        } catch (recErr) {
          console.warn('AI recommendation not ready yet or unavailable:', recErr);
        }
      } catch (err) {
        console.error('Error fetching activity details:', err);
        setError('Activity not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !activity) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/activities')} sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
        <Alert severity="error">{error || 'Activity not found.'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/activities')} 
        sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
      >
        Back to Dashboard
      </Button>

      {/* Activity Summary Card */}
      <Card elevation={3} sx={{ borderRadius: 3, mb: 4, bgcolor: '#ffffff' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="700">
              {activity.type} Session
            </Typography>
            {activity.createdAt && (
              <Typography variant="body2" color="text.secondary">
                {new Date(activity.createdAt).toLocaleString()}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <AccessTimeIcon color="action" />
                <Typography variant="caption" display="block" color="text.secondary">Duration</Typography>
                <Typography variant="h6" fontWeight="700">{activity.duration} mins</Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <LocalFireDepartmentIcon color="warning" />
                <Typography variant="caption" display="block" color="text.secondary">Calories</Typography>
                <Typography variant="h6" fontWeight="700">{activity.caloriesBurned} kcal</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Gemini AI Recommendations Card */}
      <Card elevation={4} sx={{ borderRadius: 3, background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)', border: '1px solid #e0e7ff' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <AutoAwesomeIcon color="secondary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" fontWeight="700">
              Gemini AI Insights & Recommendations
            </Typography>
          </Box>

          {recommendation ? (
            <Box>
              {/* Overall AI Feedback */}
              {recommendation.recommendation && (
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#eef2ff', borderRadius: 2.5, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="700" color="primary" sx={{ mb: 1 }}>
                    AI Summary & Analysis
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#334155' }}>
                    {recommendation.recommendation}
                  </Typography>
                </Paper>
              )}

              {/* Improvements Section */}
              {recommendation.improvements && recommendation.improvements.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <CheckCircleOutlineIcon color="success" />
                    <Typography variant="h6" fontWeight="700">Key Areas for Improvement</Typography>
                  </Box>
                  {recommendation.improvements.map((item, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 4, display: 'block' }}>
                      • {item}
                    </Typography>
                  ))}
                  <Divider sx={{ my: 2 }} />
                </Box>
              )}

              {/* Suggestions Section */}
              {recommendation.suggestions && recommendation.suggestions.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <LightbulbOutlinedIcon color="warning" />
                    <Typography variant="h6" fontWeight="700">Actionable Workout Suggestions</Typography>
                  </Box>
                  {recommendation.suggestions.map((item, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 4, display: 'block' }}>
                      • {item}
                    </Typography>
                  ))}
                  <Divider sx={{ my: 2 }} />
                </Box>
              )}

              {/* Safety Guidelines Section */}
              {recommendation.safety && recommendation.safety.length > 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <SecurityOutlinedIcon color="info" />
                    <Typography variant="h6" fontWeight="700">Safety & Recovery Tips</Typography>
                  </Box>
                  {recommendation.safety.map((item, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 4, display: 'block' }}>
                      • {item}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="info">
              AI Recommendation is currently processing in the background via RabbitMQ. Please check back in a few seconds!
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetail;