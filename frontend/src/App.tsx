import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7c3aed',
    },
    secondary: {
      main: '#f59e42',
    },
    background: {
      default: '#f3f4f6',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial',
    h4: { fontWeight: 700 },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <EmojiObjectsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Research Matcher
          </Typography>
          <Button color="inherit" startIcon={<DashboardIcon />}>Dashboard</Button>
          <Button color="inherit" startIcon={<SearchIcon />}>Search</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Welcome to Research Matcher!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Find and match research papers easily. Use the navigation above to get started.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
