import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

console.log('Rendering EmotionDashboard');

function getDominantEmotion(emotions) {
  const counts = {};
  emotions.forEach(e => {
    counts[e.emotion] = (counts[e.emotion] || 0) + 1;
  });
  let max = 0, dom = null;
  Object.entries(counts).forEach(([emotion, count]) => {
    if (count > max) {
      max = count;
      dom = emotion;
    }
  });
  return dom;
}

function getVolatility(emotions) {
  // Volatility: number of emotion switches in time order
  let switches = 0;
  let last = null;
  emotions.forEach(e => {
    if (last && e.emotion !== last) switches++;
    last = e.emotion;
  });
  return switches;
}

// Defensive: ensure all values rendered are strings or numbers
function safeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    // If it's a React element, return a placeholder
    if (val.$$typeof) return '[ReactElement]';
    return JSON.stringify(val);
  }
  return String(val);
}

const emotionColors = {
  joy: '#FFD600',
  sadness: '#2979FF',
  anger: '#FF1744',
  fear: '#00E5FF',
  surprise: '#FF9100',
  love: '#F50057',
  neutral: '#B0BEC5',
  approval: '#00E676',
  disapproval: '#FF3D00',
  realization: '#00B8D4',
  amusement: '#FFEA00',
  curiosity: '#7C4DFF',
  desire: '#FF80AB',
  disappointment: '#A1887F',
  embarrassment: '#8D6E63',
  excitement: '#FF4081',
  gratitude: '#00BFAE',
  grief: '#616161',
  nervousness: '#FFAB00',
  pride: '#C51162',
  relief: '#64DD17',
  remorse: '#D50000',
  caring: '#00BFAE',
  confusion: '#B388FF',
  disgust: '#AEEA00',
  annoyance: '#FF6F00',
  admiration: '#00B8D4',
  optimism: '#00E676',
};

function EmotionDashboard() {
  const [emotions, setEmotions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [evi, setEvi] = useState({});
  const [flips, setFlips] = useState([]);
  const [topRising, setTopRising] = useState([]);

  useEffect(() => {
    axios.get('/api/emotions/?ordering=-timestamp')
      .then(res => setEmotions(res.data.results || []))
      .catch(err => console.error(err));
    axios.get('/api/emotions/evi/')
      .then(res => setEvi(res.data))
      .catch(err => console.error(err));
    axios.get('/api/emotions/flips/')
      .then(res => setFlips(res.data))
      .catch(err => console.error(err));
    axios.get('/api/emotions/top-rising/')
      .then(res => setTopRising(res.data))
      .catch(err => console.error(err));
  }, []);

  // Group by ticker
  const byTicker = {};
  emotions.forEach(e => {
    const ticker = e.equity;
    if (!byTicker[ticker]) byTicker[ticker] = [];
    byTicker[ticker].push(e);
  });

  // Detect emotion flips in last 6 hours
  useEffect(() => {
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const newAlerts = [];
    Object.entries(byTicker).forEach(([ticker, ems]) => {
      const recent = ems.filter(e => new Date(e.timestamp) > sixHoursAgo);
      if (recent.length > 1) {
        const first = recent[0].emotion;
        const last = recent[recent.length - 1].emotion;
        if (first !== last) {
          newAlerts.push(`${ticker} flipped from ${first} to ${last}`);
        }
      }
    });
    setAlerts(newAlerts);
  }, [emotions]);

  // Metrics
  const totalEmotions = emotions.length;
  const uniqueTickers = Object.keys(byTicker).length;
  const dominantEmotion = getDominantEmotion(emotions);

  // EVI Chart Data
  const eviLabels = Object.keys(evi);
  const eviData = Object.values(evi);
  const eviChart = {
    labels: eviLabels,
    datasets: [
      {
        label: 'EVI (Emotion Switches, 24h)',
        data: eviData,
        backgroundColor: '#00bcd4',
      },
    ],
  };

  // Top Rising Chart Data
  const topRisingLabels = topRising.map(r => r.ticker);
  const topRisingData = topRising.map(r => r.increase);
  const topRisingChart = {
    labels: topRisingLabels,
    datasets: [
      {
        label: 'Top Rising Tickers (Mentions)',
        data: topRisingData,
        backgroundColor: '#ff4081',
      },
    ],
  };

  // Table columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'timestamp', headerName: 'Timestamp', width: 170 },
    { field: 'equity', headerName: 'Ticker', width: 100 },
    { field: 'emotion', headerName: 'Emotion', width: 120, renderCell: (params) => (
      <Chip label={params.value} size="small" sx={{ bgcolor: emotionColors[params.value] || '#333', color: '#fff' }} />
    ) },
    { field: 'confidence', headerName: 'Confidence', width: 120, valueFormatter: ({ value }) => `${(value * 100).toFixed(1)}%` },
    { field: 'source', headerName: 'Source', width: 140 },
    { field: 'text', headerName: 'Text', width: 350 },
  ];

  if (emotions.length === 0) {
    return <Typography color="text.secondary" sx={{ mt: 4 }}>No emotion data found. Try running the ingestion command and refreshing.</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Metrics Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">Total Emotions</Typography>
              <Typography variant="h4">{totalEmotions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">Unique Tickers</Typography>
              <Typography variant="h4">{uniqueTickers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">Dominant Emotion</Typography>
              <Chip label={dominantEmotion} size="medium" sx={{ bgcolor: emotionColors[dominantEmotion] || '#333', color: '#fff', fontSize: 18, fontWeight: 700, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {alerts.map((alert, i) => (
            <Alert key={i} severity="warning" sx={{ mb: 1, bgcolor: '#232837', color: '#ffb300' }}>{alert}</Alert>
          ))}
        </Box>
      )}

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>EVI (Emotion Volatility Index)</Typography>
              <Bar data={eviChart} options={{ plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>Top Rising Tickers</Typography>
              <Bar data={topRisingChart} options={{ plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Flips List */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="secondary">Recent Emotion Flips</Typography>
        {flips.length === 0 ? (
          <Typography color="text.secondary">No recent flips detected.</Typography>
        ) : (
          <ul style={{ color: '#fff' }}>
            {flips.map((flip, i) => (
              <li key={i}>{flip.ticker} flipped from <b>{flip.from}</b> to <b>{flip.to}</b></li>
            ))}
          </ul>
        )}
      </Box>

      {/* Recent Emotions Table */}
      <Box sx={{ mt: 4, height: 500, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" color="primary" sx={{ mb: 2, pt: 2, pl: 2 }}>Recent Emotions</Typography>
        <DataGrid
          rows={emotions.slice(0, 100).map((e, i) => ({ ...e, id: e.id || i }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ color: '#fff', border: 'none', fontSize: 15, bgcolor: 'background.paper' }}
        />
      </Box>
    </Box>
  );
}

export default EmotionDashboard; 