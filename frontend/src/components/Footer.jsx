import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#00538C',
        color: 'white',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Dallas Mavericks. All rights reserved. Made by Abe Lamoreaux.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Official Internal Website of the Dallas Mavericks
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 