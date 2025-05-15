import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import retromavs from '../assets/retromavs.png';

const Header = () => {
  const location = useLocation();

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(184, 196, 202, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(0, 83, 140, 0.95)',
        }
      }}
    >
      <Toolbar sx={{ maxWidth: '100vw', mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={retromavs} 
            alt="Retro Mavs Lego" 
            style={{ 
              height: '40px', 
              marginRight: '16px',
              cursor: 'pointer',
              filter: 'drop-shadow(0 0 8px rgba(184, 196, 202, 0.3))',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }} 
            onClick={() => window.location.href = '/'}
          />
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'white',
              textShadow: '0 0 10px rgba(184, 196, 202, 0.5)',
              '&:hover': {
                color: '#B8C4CA',
                textShadow: '0 0 15px rgba(184, 196, 202, 0.8)',
              }
            }}
          >
            Dallas Mavericks
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[
            { path: '/', label: 'Home' },
            { path: '/stats', label: 'Stats' },
            { path: '/scouts', label: 'Scouts' },
            { path: '/operations', label: 'Operations' },
            { path: '/draft', label: 'Draft' }
          ].map(({ path, label }) => (
            <Button
              key={path}
              color="inherit"
              component={Link}
              to={path}
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: location.pathname === path ? '100%' : '0%',
                  height: '2px',
                  backgroundColor: '#B8C4CA',
                  transition: 'all 0.3s ease-in-out',
                  transform: 'translateX(-50%)',
                },
                '&:hover::after': {
                  width: '100%',
                },
                '&:hover': {
                  backgroundColor: 'rgba(184, 196, 202, 0.1)',
                }
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 