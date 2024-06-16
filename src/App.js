import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { FileCopyOutlined as FileCopyOutlinedIcon } from '@mui/icons-material';
import { BASE_URL } from './Endpoints';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000', // Black background
    },
    primary: {
      main: '#BF40BF',
    },
    secondary: {
      main: '#ff3b3b',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333', // Dark input background
          borderRadius: 4,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#BF40BF', // Primary color border
            },
            '&:hover fieldset': {
              borderColor: '#bf6dbf', // Secondary color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#bf6dbf', // Primary color when focused
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginTop: '16px',
        },
      },
    },
  },
});

const App = () => {
  const [name, setName] = useState('');
  const [cachedName, setCachedName] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleCheckData = async () => {
    try {
      const response = await fetch(`${BASE_URL}read-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCachedName(data?.text);
      console.log('Data from cache', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setJustSubmitted(true);

    if (name) {
      try {
        const response = await fetch(`${BASE_URL}add-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setJustSubmitted(true);
        console.log('Success:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleClear = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}clear-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response;
      console.log('Data cleared successfully', data);
    } catch (error) {
      console.error('Error:', error);
    }
    setCachedName('');
    handleCheckData();
  };


  const handleCopyUrl = () => {
    const url = window.location.href;
  
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      alert('To copy the URL, please select the address bar and copy manually.');
      return;
    }
  
    navigator.clipboard.writeText(url)
      .then(() => {
        console.log('URL copied to clipboard:', url);
      })
      .catch((error) => {
        console.error('Failed to copy URL:', error);
        alert('Failed to copy URL. Please select the address bar and copy manually.');
      });
  };
  

  useEffect(() => {
    handleCheckData();
  }, []);

  const CachedContent = () => {
    return (
      <>
        <Typography variant="h6" component="h2" marginTop="16px">
          Welcome <span style={{ color: '#ff3b3b' }}>{cachedName}</span>,
          <p>Your data is shared across all the browser in your device, we still can track you</p>
        </Typography>
        <Button variant="contained" color="secondary" fullWidth onClick={handleClear}>
          Clear my data
        </Button>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 8,
            padding: 4,
            backgroundColor: '#1c1c1c', // Slightly lighter black for form container
            borderRadius: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
          >
            {!cachedName && (
              <>
                <TextField
                  label="Enter your name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={justSubmitted}
                  InputProps={{
                    style: {
                      color: 'white', // White text
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: 'white', // White label text
                    },
                  }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={justSubmitted} fullWidth>
                  Submit
                </Button>
              </>
            )}
          </Box>

          {justSubmitted && (
            <>
              <Typography variant="h6" component="h2" marginTop="16px">
                Hi <span style={{ color: '#ff3b3b' }}>{name}</span>, Now open this same website in Incognito or other browser in your device 
              <IconButton onClick={handleCopyUrl} color="primary" aria-label="copy url">
                <FileCopyOutlinedIcon />
              </IconButton>
              </Typography>
            </>
          )}

          {cachedName && <CachedContent />}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
