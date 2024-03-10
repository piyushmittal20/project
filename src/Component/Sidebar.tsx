/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

const Sidebar = () => {
  return (
    <Box sx={{ backgroundColor: '#0072c6', color: 'white', height: '100vh', padding: '1rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h6" fontWeight="bold">
          Mitsubishi
        </Typography>
      </Box>
      <List>
        <ListItem button>
          <ListItemText primary="Notifications" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Plans" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Employees" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Claims" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Corporate Claims" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Hospitals" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;