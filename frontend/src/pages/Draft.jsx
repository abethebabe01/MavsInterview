import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Button, Paper, Grid, List, ListItem, ListItemText, Divider, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Stack } from '@mui/material';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import draftDataJson from '../assets/intern_project_data.json';

// --- Helper Functions ---
const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const formatHeight = (inches) => {
  if (!inches) return 'N/A';
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches}\"`;
};

const formatStatKey = (key) => {
  return key
    .replace(/([A-Z0-9])/g, ' $1') // Add space before uppercase letters and numbers
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/ Pct$/, ' %') // Replace Pct with %
    .replace(/Per Game$/, 'PG') // Abbreviate Per Game
    .replace(/ At Rim/, ' @Rim')
    .replace(/ Short Mid Range/, ' Short MR')
    .replace(/ Long Mid Range/, ' Long MR')
    .trim();
};

// --- BigBoard Component ---
const BigBoard = ({ prospects, bioData, scoutRankings, onSelectPlayer }) => {
  const [rankedProspects, setRankedProspects] = useState([]);
  const [unrankedProspects, setUnrankedProspects] = useState([]);

  useEffect(() => {
    if (!prospects || prospects.length === 0) return;

    // Augment prospects with scout rankings
    const augmentedProspects = prospects.map(p => {
      const playerRankings = scoutRankings.find(sr => sr.playerId === p.playerId) || {};
      const rankingValues = Object.entries(playerRankings)
        .filter(([key]) => key !== 'playerId' && key.includes('Rank'))
        .map(([_, value]) => value)
        .filter(value => value !== null && value !== undefined);
      
      const averageRank = rankingValues.length > 0 
        ? (rankingValues.reduce((a, b) => a + b, 0) / rankingValues.length).toFixed(1)
        : 'N/A';
      
      const playerBio = bioData.find(b => b.playerId === p.playerId) || {};

      return {
        ...p,
        ...playerBio,
        averageRank,
        scoutRankings: playerRankings,
        age: calculateAge(playerBio.birthDate),
        displayHeight: formatHeight(playerBio.height),
      };
    });

    // Initially separate ranked and unranked prospects
    const ranked = augmentedProspects
      .filter(p => p.averageRank !== 'N/A')
      .sort((a, b) => parseFloat(a.averageRank) - parseFloat(b.averageRank));
    
    const unranked = augmentedProspects
      .filter(p => p.averageRank === 'N/A')
      .sort((a, b) => a.name.localeCompare(b.name));

    setRankedProspects(ranked);
    setUnrankedProspects(unranked);
  }, [prospects, bioData, scoutRankings]);

  const handleMoveToTop = (index) => {
    const newRanked = [...rankedProspects];
    const [moved] = newRanked.splice(index, 1);
    newRanked.unshift(moved);
    setRankedProspects(newRanked);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newRanked = [...rankedProspects];
    const temp = newRanked[index];
    newRanked[index] = newRanked[index - 1];
    newRanked[index - 1] = temp;
    setRankedProspects(newRanked);
  };

  const handleMoveDown = (index) => {
    if (index === rankedProspects.length - 1) return;
    const newRanked = [...rankedProspects];
    const temp = newRanked[index];
    newRanked[index] = newRanked[index + 1];
    newRanked[index + 1] = temp;
    setRankedProspects(newRanked);
  };

  const handleMoveToBottom = (index) => {
    const newRanked = [...rankedProspects];
    const [moved] = newRanked.splice(index, 1);
    newRanked.push(moved);
    setRankedProspects(newRanked);
  };

  const handleMoveToUnranked = (index) => {
    const newRanked = [...rankedProspects];
    const [moved] = newRanked.splice(index, 1);
    setRankedProspects(newRanked);
    setUnrankedProspects(prev => [...prev, moved].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleMoveToRanked = (index) => {
    const newUnranked = [...unrankedProspects];
    const [moved] = newUnranked.splice(index, 1);
    setUnrankedProspects(newUnranked);
    setRankedProspects(prev => [...prev, moved]);
  };

  const renderProspectCard = (prospect, index, isRanked = true) => (
    <Grid xs={12} sm={6} md={4} lg={3} key={prospect.playerId}>
      <Paper 
        sx={{ 
          p: 2, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 10, 
            right: 10, 
            backgroundColor: 'rgba(255, 255, 255, 0.75)', 
            padding: '2px 8px',
            borderRadius: '4px',
            color: '#00538C',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            lineHeight: '1.2',
            zIndex: 1,
          }}
        >
          {isRanked ? (index + 1) : 'UD'}
        </Box>

        <Box 
          onClick={() => onSelectPlayer(prospect.playerId)}
          sx={{ 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
            flexGrow: 1,
            pr: 6,
            pb: 4,
          }}
        >
          <Typography variant="h6" sx={{ pr: '45px' }}>
            {prospect.name}
          </Typography>
          <Typography variant="body2">Age: {prospect.age}</Typography>
          <Typography variant="body2">Height: {prospect.displayHeight}</Typography>
          <Typography variant="body2">Weight: {prospect.weight || 'N/A'} lbs</Typography>
          <Typography variant="body2">Team: {prospect.currentTeam || 'N/A'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption">Scout Ranks:</Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              {Object.entries(prospect.scoutRankings)
                .filter(([key]) => key !== 'playerId' && key.includes('Rank'))
                .map(([_, value]) => value)
                .filter(value => value !== null && value !== undefined)
                .join(', ')}
            </Typography>
          </Box>
        </Box>

        <Stack 
          direction="row" 
          spacing={0.5} 
          sx={{ 
            position: 'absolute',
            right: 8,
            bottom: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '4px',
            padding: '2px',
            boxShadow: 1,
          }}
        >
          {isRanked ? (
            <>
              <IconButton 
                size="small" 
                onClick={() => handleMoveToTop(index)} 
                title="Move to top"
                sx={{ color: '#00538C' }}
              >
                <KeyboardDoubleArrowUpIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleMoveUp(index)} 
                title="Move up"
                sx={{ color: '#00538C' }}
              >
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleMoveDown(index)} 
                title="Move down"
                sx={{ color: '#00538C' }}
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleMoveToBottom(index)} 
                title="Move to bottom"
                sx={{ color: '#00538C' }}
              >
                <KeyboardDoubleArrowDownIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleMoveToUnranked(index)} 
                title="Move to unranked"
                sx={{ color: '#00538C' }}
              >
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <IconButton 
              size="small" 
              onClick={() => handleMoveToRanked(index)} 
              title="Move to ranked"
              sx={{ color: '#00538C' }}
            >
              <KeyboardDoubleArrowUpIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Paper>
    </Grid>
  );

  if (!prospects || prospects.length === 0) {
    return <Typography>No prospect data available.</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
        NBA Draft Big Board
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
        Use the icons on each player to reorder potential players. Click on the player to see more about their seasons.
      </Typography>

      <Box mb={4}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', color: 'primary.main', borderBottom:1, borderColor:'divider', pb:1, mb:2 }}>
          Ranked Prospects
        </Typography>
        <Grid container spacing={2.5} sx={{ justifyContent: 'center' }}>
          {rankedProspects.map((prospect, index) => 
            renderProspectCard(prospect, index, true)
          )}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', color: 'text.secondary', borderBottom:1, borderColor:'divider', pb:1, mb:2 }}>
          Unranked Prospects
        </Typography>
        <Grid container spacing={2.5} sx={{ justifyContent: 'center' }}>
          {unrankedProspects.map((prospect, index) => 
            renderProspectCard(prospect, index, false)
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

// --- PlayerProfile Component ---
const PlayerProfile = ({ bioData, statsData, scoutReportsData, measurementsData, gameLogsData, scoutRankings, onAddReport }) => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  
  const [playerDetails, setPlayerDetails] = useState(null);
  const [latestSeasonTotals, setLatestSeasonTotals] = useState(null);
  const [playerGameLogs, setPlayerGameLogs] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newReport, setNewReport] = useState({ scoutName: '', reportText: '', rating: '' });

  useEffect(() => {
    const id = parseInt(playerId);
    const prospect = bioData.find(b => b.playerId === id);

    if (prospect) {
      setPlayerDetails(prospect);

      // Process season stats
      const seasons = statsData.filter(s => s.playerId === id);
      if (seasons.length > 0) {
        seasons.sort((a, b) => String(b.Season).localeCompare(String(a.Season)));
        const latestSeason = seasons[0];
        
        // Get all games for this season to calculate averages
        const seasonGames = gameLogsData ? gameLogsData.filter(g => g.playerId === id && g.season === latestSeason.Season) : [];
        
        // Calculate average rebounds
        const totalRebounds = seasonGames.reduce((sum, game) => sum + (game.reb || 0), 0);
        const avgRebounds = seasonGames.length > 0 ? totalRebounds / seasonGames.length : 0;
        
        // Calculate FT% from game logs
        const totalFTM = seasonGames.reduce((sum, game) => sum + (game.ftm || 0), 0);
        const totalFTA = seasonGames.reduce((sum, game) => sum + (game.fta || 0), 0);
        const ftPercentage = totalFTA > 0 ? Math.min((totalFTM / totalFTA) * 100, 100) : 0;
        
        // Map the stats to match the expected format
        const mappedStats = {
          ...latestSeason,
          G: latestSeason.gp || latestSeason.G,
          GS: latestSeason.gs || latestSeason.GS,
          REB: avgRebounds.toFixed(1), // Average rebounds from game logs
          FG: latestSeason.fgm || latestSeason.FG,
          FGA: latestSeason.fga || latestSeason.FGA,
          FG_PCT: latestSeason['fg%'] || latestSeason.FG_PCT,
          TP: latestSeason.tpm || latestSeason.TP,
          TPA: latestSeason.tpa || latestSeason.TPA,
          TP_PCT: latestSeason['tp%'] || latestSeason.TP_PCT,
          FT: latestSeason.ftm || latestSeason.FT,
          FTA: latestSeason.fta || latestSeason.FTA,
          FT_PCT: ftPercentage.toFixed(1), // Calculated from game logs
          W: latestSeason.W || 0,
          L: latestSeason.L || 0,
        };
        
        setLatestSeasonTotals(mappedStats);
      } else {
        setLatestSeasonTotals(null);
      }

      // Process game logs
      const games = gameLogsData ? gameLogsData.filter(g => g.playerId === id) : [];
      games.sort((a, b) => {
        // First sort by opponent name
        const opponentCompare = (a.opponent || '').localeCompare(b.opponent || '');
        if (opponentCompare !== 0) return opponentCompare;
        // Then by date
        return new Date(b.date) - new Date(a.date);
      });
      
      // Map game log stats to match the expected format
      const mappedGames = games.map(game => ({
        ...game,
        gameDate: game.date,
        opponentName: game.opponent,
        MIN: game.timePlayed || game.MIN,
        PTS: game.pts || game.PTS,
        REB: game.reb || game.REB,
        AST: game.ast || game.AST,
        STL: game.stl || game.STL,
        BLK: game.blk || game.BLK,
        TOV: game.tov || game.TOV,
        PF: game.pf || game.PF,
        FGM: game.fgm || game.FGM,
        FGA: game.fga || game.FGA,
        FG_PCT: game['fg%'] || game.FG_PCT,
        TPM: game.tpm || game.TPM,
        TPA: game.tpa || game.TPA,
        TP_PCT: game['tp%'] || game.TP_PCT,
        FTM: game.ftm || game.FTM,
        FTA: game.fta || game.FTA,
        FT_PCT: game['ft%'] || game.FT_PCT,
        outcome: game.homeTeamPts && game.visitorTeamPts ? 
          `${game.homeTeamPts}-${game.visitorTeamPts}` : null
      }));

      setPlayerGameLogs(mappedGames);
      setSelectedGame(null);
    } else {
      console.warn(`PlayerProfile: Player with ID ${id} not found in bioData.`);
      setPlayerDetails(null);
      setLatestSeasonTotals(null);
      setPlayerGameLogs([]);
      setSelectedGame(null);
    }
  }, [playerId, bioData, statsData, gameLogsData]);

  const handleGameSelect = (event) => {
    const gameValue = event.target.value;
    if (gameValue === 'none') {
        setSelectedGame(null);
        return;
    }
    const game = playerGameLogs.find(g => JSON.stringify(g) === gameValue);
    setSelectedGame(game || null);
  };

  const handleReportChange = (e) => setNewReport({ ...newReport, [e.target.name]: e.target.value });
  const handleAddReport = (e) => {
    e.preventDefault();
    if (newReport.scoutName && newReport.reportText && playerDetails) {
      const reportToAdd = { 
        ...newReport, 
        playerId: playerDetails.playerId, 
        reportId: Date.now(),
        date: new Date().toISOString().split('T')[0] 
      };
      onAddReport(reportToAdd);
      setNewReport({ scoutName: '', reportText: '', rating: '' });
    }
  };

  const memoizedPlayerBio = useMemo(() => {
    if (!playerDetails) return null;
    return {
        ...playerDetails,
        age: calculateAge(playerDetails.birthDate),
        displayHeight: formatHeight(playerDetails.height)
    };
  }, [playerDetails]);

  if (!memoizedPlayerBio) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
            <Typography sx={{ml: 2}}>Loading player data...</Typography>
        </Box>
    );
  }
  
  const { name, position, photoUrl, weight, currentTeam, league, highSchool, highSchoolState, homeTown, homeState, homeCountry, nationality, age, displayHeight } = memoizedPlayerBio;

  // Define which keys to show for totals, and their preferred order or grouping
  const totalStatKeysToShow = [
    'Season', 'G', 'GS', 'MP', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 
    'FG', 'FGA', 'FG_PCT', 'TP', 'TPA', 'TP_PCT', 'FT', 'FTA', 'FT_PCT', 
    'ORB', 'DRB', 'W', 'L'
  ];
  // Define keys for single game stats
  const gameStatKeysToShow = [
    'gameDate', 'opponentName', 'outcome', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF',
    'FGM', 'FGA', 'FG_PCT', 'TPM', 'TPA', 'TP_PCT', 'FTM', 'FTA', 'FT_PCT'
  ];
  
  // Keys that should be displayed as whole numbers if they are numeric
  const integerStatKeys = [
    'G', 'GS', 'W', 'L', 
    'FG', 'FGA', 'TP', 'TPA', 'FT', 'FTA', // Season Totals
    'FGM', 'TPM', 'FTM', // Game Logs (attempted are often floats in per-game, but can be int)
    'ORB', 'DRB', // Rebounds are typically whole numbers
    // 'MIN' can sometimes be fractional in averages, but often whole in game logs. Keeping it out for now.
    // PF, TOV can be fractional in averages but are whole numbers in game logs.
    // For game logs, specific integer handling will be inside the loop if needed.
  ];

  // Helper to render stats table
  const renderStatsTable = (statsObject, keysToShow, title) => {
    if (!statsObject) return <Typography>No {title.toLowerCase()} stats available.</Typography>;

    const tableRows = keysToShow.map(key => {
      let value = statsObject[key];
      let displayKey = formatStatKey(key);

      if (key === 'Season' && statsObject['Season']) {
        value = statsObject['Season'];
      } else if (key === 'W' && statsObject['L'] !== undefined && statsObject['W'] !== undefined) {
        value = `${statsObject['W']}-${statsObject['L']}`;
      } else if (key === 'L' && statsObject['W'] !== undefined) {
        return null; 
      } else if ((key.endsWith('_PCT') || key.endsWith('Pct')) && typeof value === 'number') {
        // Just add % symbol to the existing percentage value
        value = `${value.toFixed(1)}%`;
      } else if (typeof value === 'number') {
        if (integerStatKeys.includes(key)) {
          value = Math.round(value); // Display as whole number
        } else if (!['gameLogId', 'teamId', 'opponentTeamId', 'playerId', 'seasonLogId'].includes(key) && !key.toLowerCase().includes('year') && key !== 'MIN') {
          value = value.toFixed(1);
        }
      } else if (key === 'gameDate' && value) {
        value = new Date(value).toLocaleDateString();
      }
      
      // If W or L is present but the other is undefined, show the one that exists
      if (key === 'W' && statsObject['W'] !== undefined && statsObject['L'] === undefined) {
        value = statsObject['W'];
      } else if (key === 'L' && statsObject['L'] !== undefined && statsObject['W'] === undefined) {
        value = statsObject['L'];
      }

      return (
        <TableRow key={key}>
          <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
            {displayKey}
          </TableCell>
          <TableCell align="right">{value !== undefined && value !== null ? String(value) : 'N/A'}</TableCell>
        </TableRow>
      );
    }).filter(Boolean); 

    if (tableRows.length === 0) {
        return <Typography>No displayable {title.toLowerCase()} stats found for the selected keys.</Typography>;
    }

    return (
      <TableContainer component={Paper} sx={{my: 1, maxHeight: 400}}>
        <Table stickyHeader size="small" aria-label={`${title} stats table`}>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Statistic</TableCell>
              <TableCell align="right" sx={{fontWeight: 'bold'}}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderScoutRankings = (playerId) => {
    if (!scoutRankings) return null;
    const playerRankings = scoutRankings.find(sr => sr.playerId === playerId);
    if (!playerRankings) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Scout Rankings</Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableBody>
              {Object.entries(playerRankings)
                .filter(([key]) => key !== 'playerId' && key.includes('Rank'))
                .map(([scout, rank]) => (
                  <TableRow key={scout}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                      {scout.replace(' Rank', '')}
                    </TableCell>
                    <TableCell align="right">{rank}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3} }}>
      <Button onClick={() => navigate('/draft')} sx={{ mb: 2 }}>Back to Big Board</Button>
      <Grid container spacing={3}>
        <Grid xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {photoUrl ? (
            <Box component="img" src={photoUrl} alt={name} sx={{ width: '80%', maxWidth: '300px', height: 'auto', borderRadius: '8px', mb: 2, objectFit: 'cover', boxShadow:3 }} />
          ) : (
            <Box sx={{ width: '80%', maxWidth: '300px', height: 250, backgroundColor: 'grey.700', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', mb: 2, boxShadow:3 }}>
              <Typography color="text.secondary">No Photo</Typography>
            </Box>
          )}
          <Typography variant="h4" component="h1" gutterBottom sx={{textAlign: 'center'}}>{name}</Typography>
          <Typography variant="h6" color="text.secondary" sx={{textAlign: 'center'}}>{position || 'N/A'}</Typography>
          <Box sx={{textAlign: 'center', mt: 1}}>
            <Typography>Age: {age}</Typography>
            <Typography>Height: {displayHeight}</Typography>
            <Typography>Weight: {weight || 'N/A'} lbs</Typography>
            <Typography>Team: {currentTeam || 'N/A'} ({league || 'N/A'})</Typography>
            <Typography>High School: {highSchool || 'N/A'} ({highSchoolState || 'N/A'})</Typography>
          </Box>
        </Grid>
        
        <Grid xs={12} md={8}>
          <Card sx={{mb: 3}}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Latest Season Totals</Typography>
              {renderStatsTable(latestSeasonTotals, totalStatKeysToShow, "Latest Season Totals")}
              {latestSeasonTotals && Object.keys(latestSeasonTotals).filter(k => !totalStatKeysToShow.includes(k) && typeof latestSeasonTotals[k] === 'number' && !['playerId', 'seasonLogId', 'teamId'].includes(k)).length > 0 && (
                <Typography variant="caption" color="text.disabled" sx={{mt:1, display:'block'}}>Other numeric stats available in data.</Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{mb: 3}}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Single Game Stats</Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Select Game</InputLabel>
                <Select
                  value={selectedGame ? JSON.stringify(selectedGame) : ''}
                  onChange={handleGameSelect}
                  label="Select Game"
                >
                  {playerGameLogs.map((game, index) => {
                    const gameValue = JSON.stringify(game);
                    const gameDate = new Date(game.gameDate).toLocaleDateString();
                    let displayLabel = `Vs. ${game.opponentName || 'Unknown'} [${gameDate}]`;
                    if (game.outcome) {
                      displayLabel += ` (${game.outcome})`;
                    }
                    return (
                      <MenuItem key={index} value={gameValue}>
                        {displayLabel}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {selectedGame && (
                <>
                  {renderStatsTable(selectedGame, gameStatKeysToShow, "Selected Game Stats")}
                  {selectedGame && Object.keys(selectedGame).filter(k => !gameStatKeysToShow.includes(k) && typeof selectedGame[k] === 'number' && !['playerId', 'seasonLogId', 'teamId'].includes(k)).length > 0 && (
                    <Typography variant="caption" color="text.disabled" sx={{mt:1, display:'block'}}>Other numeric stats available in data.</Typography>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          {playerDetails && renderScoutRankings(playerDetails.playerId)}

          <Typography variant="h5" gutterBottom>Scouting Reports</Typography>
          <List>
            {scoutReportsData.map((report) => (
              <ListItem key={report.reportId || `${report.scoutId}-${report.date}`} alignItems="flex-start" sx={{borderBottom: '1px solid', borderColor: 'divider', paddingLeft:0, paddingRight:0}}>
                <ListItemText
                  primaryTypographyProps={{variant:'subtitle1', fontWeight:'medium'}}
                  secondaryTypographyProps={{component:'pre', sx:{whiteSpace: 'pre-wrap', wordBreak: 'break-word', color:'text.secondary'}}}
                  primary={`${report.scoutName} (${report.date || 'N/A'}) ${report.rating ? '- Rating: '+report.rating : ''}`}
                  secondary={report.reportText || report.report}
                />
              </ListItem>
            ))}
            {scoutReportsData.length === 0 && <Typography color="text.secondary">No scouting reports available.</Typography>}
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb:1 }}>Add New Report</Typography>
          <Box component="form" onSubmit={handleAddReport} sx={{ mt: 1 }}>
            <TextField label="Scout Name" name="scoutName" value={newReport.scoutName} onChange={handleReportChange} fullWidth margin="dense" required />
            <TextField label="Report Text" name="reportText" value={newReport.reportText} onChange={handleReportChange} fullWidth multiline rows={3} margin="dense" required />
            <TextField label="Rating (e.g., A+, B-, 8/10)" name="rating" value={newReport.rating} onChange={handleReportChange} fullWidth margin="dense" />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Report</Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// --- Main Draft Page Component ---
const Draft = () => {
  const [data, setData] = useState({
    prospects: [],
    bio: [],
    stats: [], // These are seasonLogs
    scoutRankings: [],
    scoutReports: [],
    measurements: [],
    gameLogs: [], 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReports, setUserReports] = useState([]); // New state for user-added reports
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const rawData = draftDataJson;
      setData({
        prospects: rawData?.bio || [], 
        bio: rawData?.bio || [], 
        stats: rawData?.seasonLogs || [], 
        scoutRankings: rawData?.scoutRankings || [],
        scoutReports: rawData?.scoutReports || [],
        measurements: rawData?.measurements || [],
        gameLogs: rawData?.game_logs || [],
      });
      setLoading(false);
    } catch (err) {
      console.error("Error processing draft data:", err);
      setError("Failed to load draft data. " + err.message);
      setLoading(false);
    }
  }, []);

  const handleSelectPlayer = (playerId) => {
    navigate(`/draft/${playerId}`);
  };

  const handleAddReport = (report) => {
    setUserReports(prev => [...prev, report]);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading Draft Hub...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!data.prospects || data.prospects.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">No prospect data found. The Draft Hub cannot be displayed.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Routes>
        <Route 
          index 
          element={
            <BigBoard 
              prospects={data.prospects} 
              bioData={data.bio}
              scoutRankings={data.scoutRankings}
              onSelectPlayer={handleSelectPlayer} 
            />
          } 
        />
        <Route 
          path=":playerId" 
          element={
            <PlayerProfile 
              bioData={data.bio} 
              statsData={data.stats}
              scoutReportsData={[...data.scoutReports, ...userReports]} // Combine original and user reports
              measurementsData={data.measurements}
              gameLogsData={data.gameLogs}
              scoutRankings={data.scoutRankings}
              onAddReport={handleAddReport}
            />
          } 
        />
      </Routes>
    </Container>
  );
};

export default Draft;