import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const Operations = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', content: '' });

  useEffect(() => {
    const nextSeason = new Date('2025-10-24T00:00:00');
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = nextSeason - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFeatureClick = (feature) => {
    switch (feature) {
      case 'expense':
        setDialogContent({
          title: 'Expense Reporting',
          content: 'This feature is currently under development. Check back soon!',
        });
        setDialogOpen(true);
        break;
      case 'community':
        window.open('https://www.reddit.com/r/Mavericks/', '_blank');
        break;
      case 'vendor':
        setDialogContent({
          title: 'Vendor Relations',
          content: 'This feature is currently under development. Check back soon!',
        });
        setDialogOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Operations Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Countdown Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4,
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #00538C 0%, #003d63 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Countdown to Next Season
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              2025-26 Season
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
              Starting October 24, 2025
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {timeLeft.days}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Days
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {timeLeft.hours}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Hours
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {timeLeft.minutes}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Minutes
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {timeLeft.seconds}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Seconds
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Features Grid */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Expense Reporting */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  height: '120px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                    backgroundColor: '#f8f9fa'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
                onClick={() => handleFeatureClick('expense')}
              >
                <Box sx={{ 
                  backgroundColor: '#00538C',
                  color: 'white',
                  p: 2,
                  borderRadius: 1,
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  <Typography variant="h4">$</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Expense Reporting
                  </Typography>
                  <Typography color="text.secondary">
                    Track and manage team expenses, travel costs, and operational budgets.
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Community Input */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  height: '120px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                    backgroundColor: '#f8f9fa'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
                onClick={() => handleFeatureClick('community')}
              >
                <Box sx={{ 
                  backgroundColor: '#00538C',
                  color: 'white',
                  p: 2,
                  borderRadius: 1,
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  <Typography variant="h4">👥</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Community Input
                  </Typography>
                  <Typography color="text.secondary">
                    Connect with the Mavericks community on Reddit for fan feedback and discussions.
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Vendor Relations */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  height: '120px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                    backgroundColor: '#f8f9fa'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
                onClick={() => handleFeatureClick('vendor')}
              >
                <Box sx={{ 
                  backgroundColor: '#00538C',
                  color: 'white',
                  p: 2,
                  borderRadius: 1,
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  <Typography variant="h4">🤝</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Vendor Relations
                  </Typography>
                  <Typography color="text.secondary">
                    Manage relationships with team vendors, suppliers, and partners.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Feature Under Development Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <Typography>{dialogContent.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Operations; 