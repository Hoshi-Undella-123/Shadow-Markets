
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box, Button, CssBaseline, TextField, InputAdornment, IconButton, Chip, Paper, Tooltip, Fade, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#222',
      contrastText: '#111',
    },
    secondary: {
      main: '#888',
      contrastText: '#111',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    text: {
      primary: '#111',
      secondary: '#444',
    },
  },
  typography: {
    fontFamily: 'Inter, Segoe UI, Arial',
    h4: { fontWeight: 700, letterSpacing: 0.5 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});


function App() {
  // Theme mode: light/dark
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  // New: advanced filters
  const [needsFunding, setNeedsFunding] = useState(false);
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [projectType, setProjectType] = useState('');

  // Minimalist white background
  const backgrounds = {
    default: '#fff',
  };

  // Fetch all projects on mount (use global endpoint)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the new global projects endpoint
        const response = await fetch('/api/v1/projects/');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        setProjects(data);
        setFiltered(data);
      } catch (err) {
        setError('Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Advanced filtering
  useEffect(() => {
    let filteredData = projects;
    if (search) {
      filteredData = filteredData.filter(
        p =>
          (p.project_title && p.project_title.toLowerCase().includes(search.toLowerCase())) ||
          (p.principal_investigator && p.principal_investigator.toLowerCase().includes(search.toLowerCase())) ||
          (p.organization && p.organization.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (needsFunding) {
      filteredData = filteredData.filter(p => p.needs_funding === true);
    }
    if (country) {
      filteredData = filteredData.filter(p => p.country && p.country.toLowerCase().includes(country.toLowerCase()));
    }
    if (region) {
      filteredData = filteredData.filter(p => p.region && p.region.toLowerCase().includes(region.toLowerCase()));
    }
    if (sector) {
      filteredData = filteredData.filter(p => Array.isArray(p.sectors) && p.sectors.some(s => s && s.toLowerCase().includes(sector.toLowerCase())));
    }
    if (projectType) {
      filteredData = filteredData.filter(p => p.project_type && p.project_type.toLowerCase().includes(projectType.toLowerCase()));
    }
    setFiltered(filteredData);
  }, [search, needsFunding, country, region, sector, projectType, projects]);

  // Remove theme toggler and color cycle for minimalism

  return (
    <ThemeProvider theme={getTheme('light')}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: backgrounds.default, transition: 'background 0.7s', pb: 0 }}>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ boxShadow: 0, background: 'transparent' }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: '#222' }}>
              Research Matcher
            </Typography>
            <Tooltip title="About this platform" arrow TransitionComponent={Fade}>
              <IconButton color="inherit" onClick={() => setInfoOpen(true)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 6 }, pb: 6 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2, background: '#fff', boxShadow: 'none', border: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title, PI, or organization..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { fontSize: 20, fontWeight: 600, background: '#f7f8fa', borderRadius: 2 },
                }}
                sx={{ flex: 2, minWidth: 220, boxShadow: 2, borderRadius: 2, fontWeight: 700 }}
              />
              <TextField
                label="Country"
                value={country}
                onChange={e => setCountry(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              />
              <TextField
                label="Region"
                value={region}
                onChange={e => setRegion(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              />
              <TextField
                label="Sector"
                value={sector}
                onChange={e => setSector(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              />
              <TextField
                label="Project Type"
                value={projectType}
                onChange={e => setProjectType(e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              />
              <Chip
                label="Needs Funding"
                color={needsFunding ? 'primary' : 'default'}
                variant={needsFunding ? 'filled' : 'outlined'}
                onClick={() => setNeedsFunding(v => !v)}
                sx={{ fontWeight: 600, cursor: 'pointer', minWidth: 120 }}
              />
            </Box>
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          </Paper>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, background: '#fff', boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Sector/Agency</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Team / PI</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Funding</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Goal</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center">No projects found.</TableCell></TableRow>
                ) : (
                  filtered.map((item, idx) => {
                    // Map fields for CORDIS and NIH projects
                    const projectTitle = item.project_title || item.title || item.acronym || 'Untitled';
                    const teamOrPI = item.principal_investigator || item.team || item.pi || '';
                    const organization = item.organization || item.org || '';
                    const funding = item.award_amount || item.funding_amount || item.ecMaxContribution || 0;
                    const goal = item.abstract_text || item.description || item.objective || '';
                    const status = item.status || (item.needs_funding === true ? 'Active' : 'Completed');
                    const sector = item.agency_ic_admin_abbreviation || (Array.isArray(item.sectors) ? item.sectors.join(', ') : item.sectors) || item.sector || 'N/A';
                    return (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ minWidth: 180, maxWidth: 260 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#e3e3fa', color: '#333', fontWeight: 700, fontSize: 16 }}>
                              {projectTitle[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{projectTitle}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip label={item.project_num || item.project_id || ''} size="small" sx={{ bgcolor: '#f5f5f5', color: '#222', fontWeight: 500 }} />
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={sector} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 500 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{teamOrPI}</Typography>
                          <Typography variant="caption" sx={{ color: '#888' }}>{organization}</Typography>
                        </TableCell>
                        <TableCell>
                          {funding ? (
                            <Chip label={`$${funding.toLocaleString()}`} size="small" sx={{ bgcolor: '#e8f5e9', color: '#388e3c', fontWeight: 500 }} />
                          ) : '—'}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 320 }}>
                          <Tooltip title={goal} arrow placement="top">
                            <Typography variant="body2" sx={{ color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                              {goal ? goal.slice(0, 80) + (goal.length > 80 ? '...' : '') : 'No description.'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip label={status} size="small" sx={{ bgcolor: status === 'Active' ? '#e8f5e9' : '#fffde7', color: status === 'Active' ? '#388e3c' : '#fbc02d', fontWeight: 500 }} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        {/* Info Modal */}
        {infoOpen && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(255,255,255,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setInfoOpen(false)}>
            <Paper elevation={0} sx={{ p: 5, borderRadius: 2, minWidth: 340, maxWidth: 420, textAlign: 'center', background: '#fff', border: '1px solid #eee' }} onClick={e => e.stopPropagation()}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#222' }}>About Research Matcher</Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#444' }}>
                This platform helps you discover and explore research projects with a minimal, modern, and easy-to-use interface. Search by title, author, or journal.<br /><br />
                <b>Features:</b>
                <ul style={{ textAlign: 'left', margin: '12px 0 0 0', paddingLeft: 24 }}>
                  <li>Minimalist card-based UI</li>
                  <li>Real-time search and filtering</li>
                  <li>Project info chips</li>
                  <li>"View Paper" button for external links</li>
                  <li>Responsive and accessible design</li>
                </ul>
              </Typography>
              <Button variant="outlined" color="primary" onClick={() => setInfoOpen(false)} sx={{ mt: 2, fontWeight: 500 }}>Close</Button>
            </Paper>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

// (SearchForm and ResultsList removed, now handled inline)

export default App;
