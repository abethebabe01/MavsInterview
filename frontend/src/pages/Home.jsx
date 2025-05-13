import { Box, Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 128px)', // Account for header and footer
          py: 4,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            mb: { xs: 4, md: 0 },
          }}
        >
          <img
            src="/MavsBasketBall.png"
            alt="Mavericks Basketball"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
            }}
          />
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '45%' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Mavericks Analytics
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            The comprehensive platform for Mavericks statistics, scouting, and operations. Home of the #1 Pick for 2025.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 