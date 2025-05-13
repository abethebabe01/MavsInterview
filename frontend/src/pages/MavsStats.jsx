import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Divider,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import { FilterList, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const MavsStats = () => {
  const [records, setRecords] = useState([]);
  const [teamStats, setTeamStats] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: 'season',
    sortOrder: 'DESC',
    coach: '',
    minWins: '',
    maxWins: '',
    minORtg: '',
    maxORtg: '',
    minDRtg: '',
    maxDRtg: '',
    minPace: '',
    maxPace: '',
    season: '',
    playoffs: '',
  });
  const [teamStatsFilters, setTeamStatsFilters] = useState({
    sortBy: 'season',
    sortOrder: 'DESC',
    season: '',
    minPts: '',
    maxPts: '',
    minFgPercent: '',
    maxFgPercent: '',
    min3pPercent: '',
    max3pPercent: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    seasons: [],
    coaches: [],
    playoffs: [],
  });
  const [page, setPage] = useState(0);
  const [teamStatsPage, setTeamStatsPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [teamStatsRowsPerPage, setTeamStatsRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showTeamStatsFilters, setShowTeamStatsFilters] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'Season', 'Age', 'G', 'MP', 'FG_percent', '3P_percent', '2P_percent', 'FT_percent', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PTS'
  ]);

  const allColumns = [
    { id: 'Season', label: 'Season' },
    { id: 'Age', label: 'Age' },
    { id: 'G', label: 'Games' },
    { id: 'MP', label: 'Minutes' },
    { id: 'FG', label: 'FG Made' },
    { id: 'FGA', label: 'FG Attempts' },
    { id: 'FG_percent', label: 'FG%' },
    { id: '3P', label: '3P Made' },
    { id: '3PA', label: '3P Attempts' },
    { id: '3P_percent', label: '3P%' },
    { id: '2P', label: '2P Made' },
    { id: '2PA', label: '2P Attempts' },
    { id: '2P_percent', label: '2P%' },
    { id: 'FT', label: 'FT Made' },
    { id: 'FTA', label: 'FT Attempts' },
    { id: 'FT_percent', label: 'FT%' },
    { id: 'ORB', label: 'Off Reb' },
    { id: 'DRB', label: 'Def Reb' },
    { id: 'TRB', label: 'Total Reb' },
    { id: 'AST', label: 'Assists' },
    { id: 'STL', label: 'Steals' },
    { id: 'BLK', label: 'Blocks' },
    { id: 'TOV', label: 'Turnovers' },
    { id: 'PF', label: 'Fouls' },
    { id: 'PTS', label: 'Points' },
  ];

  useEffect(() => {
    fetchFilterOptions();
    fetchRecords();
    fetchTeamStats();
  }, [filters, teamStatsFilters, page, teamStatsPage, rowsPerPage, teamStatsRowsPerPage]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/team-records/filters');
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });

      const response = await fetch(`http://localhost:3001/api/team-records?${queryParams}`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchTeamStats = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...teamStatsFilters,
        limit: teamStatsRowsPerPage,
        offset: teamStatsPage * teamStatsRowsPerPage,
      });

      const response = await fetch(`http://localhost:3001/api/team-stats?${queryParams}`);
      const data = await response.json();
      setTeamStats(data);
    } catch (error) {
      console.error('Error fetching team stats:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTeamStatsFilterChange = (field, value) => {
    setTeamStatsFilters(prev => ({ ...prev, [field]: value }));
    setTeamStatsPage(0);
  };

  const handleTeamStatsChangePage = (event, newPage) => {
    setTeamStatsPage(newPage);
  };

  const handleTeamStatsChangeRowsPerPage = (event) => {
    setTeamStatsRowsPerPage(parseInt(event.target.value, 10));
    setTeamStatsPage(0);
  };

  const handleColumnChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedColumns(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const FilterSection = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="season">Season</MenuItem>
                <MenuItem value="w">Wins</MenuItem>
                <MenuItem value="ortg">Offensive Rating</MenuItem>
                <MenuItem value="drtg">Defensive Rating</MenuItem>
                <MenuItem value="pace">Pace</MenuItem>
                <MenuItem value="srs">SRS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort Order</InputLabel>
              <Select
                value={filters.sortOrder}
                label="Sort Order"
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <MenuItem value="ASC">Ascending</MenuItem>
                <MenuItem value="DESC">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={filters.season}
                label="Season"
                onChange={(e) => handleFilterChange('season', e.target.value)}
              >
                <MenuItem value="">All Seasons</MenuItem>
                {filterOptions.seasons.map((season) => (
                  <MenuItem key={season} value={season}>
                    {season}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Coach</InputLabel>
              <Select
                value={filters.coach}
                label="Coach"
                onChange={(e) => handleFilterChange('coach', e.target.value)}
              >
                <MenuItem value="">All Coaches</MenuItem>
                {filterOptions.coaches.map((coach) => (
                  <MenuItem key={coach} value={coach}>
                    {coach}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Min Wins"
              type="number"
              value={filters.minWins}
              onChange={(e) => handleFilterChange('minWins', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Max Wins"
              type="number"
              value={filters.maxWins}
              onChange={(e) => handleFilterChange('maxWins', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Min Offensive Rating"
              type="number"
              value={filters.minORtg}
              onChange={(e) => handleFilterChange('minORtg', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Max Offensive Rating"
              type="number"
              value={filters.maxORtg}
              onChange={(e) => handleFilterChange('maxORtg', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Min Defensive Rating"
              type="number"
              value={filters.minDRtg}
              onChange={(e) => handleFilterChange('minDRtg', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Max Defensive Rating"
              type="number"
              value={filters.maxDRtg}
              onChange={(e) => handleFilterChange('maxDRtg', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Min Pace"
              type="number"
              value={filters.minPace}
              onChange={(e) => handleFilterChange('minPace', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Max Pace"
              type="number"
              value={filters.maxPace}
              onChange={(e) => handleFilterChange('maxPace', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Playoff Result</InputLabel>
              <Select
                value={filters.playoffs}
                label="Playoff Result"
                onChange={(e) => handleFilterChange('playoffs', e.target.value)}
              >
                <MenuItem value="">All Results</MenuItem>
                {filterOptions.playoffs.map((result) => (
                  <MenuItem key={result} value={result}>
                    {result}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const TeamStatsFilterSection = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Column Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#B8C4CA' }}>Display Options</Typography>
            <FormControl fullWidth>
              <InputLabel>Columns to Display</InputLabel>
              <Select
                multiple
                value={selectedColumns}
                onChange={handleColumnChange}
                input={<OutlinedInput label="Columns to Display" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  },
                  autoFocus: false
                }}
              >
                {allColumns.map((column) => (
                  <MenuItem key={column.id} value={column.id}>
                    <Checkbox checked={selectedColumns.indexOf(column.id) > -1} />
                    <ListItemText primary={column.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sorting Controls */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#B8C4CA' }}>Sorting</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={teamStatsFilters.sortBy}
                    label="Sort By"
                    onChange={(e) => handleTeamStatsFilterChange('sortBy', e.target.value)}
                  >
                    {allColumns.map((column) => (
                      <MenuItem key={column.id} value={column.id}>
                        {column.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={teamStatsFilters.sortOrder}
                    label="Sort Order"
                    onChange={(e) => handleTeamStatsFilterChange('sortOrder', e.target.value)}
                  >
                    <MenuItem value="ASC">Ascending</MenuItem>
                    <MenuItem value="DESC">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Season Filter */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#B8C4CA' }}>Season Filter</Typography>
            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={teamStatsFilters.season}
                label="Season"
                onChange={(e) => handleTeamStatsFilterChange('season', e.target.value)}
              >
                <MenuItem value="">All Seasons</MenuItem>
                {filterOptions.seasons.map((season) => (
                  <MenuItem key={season} value={season}>
                    {season}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Statistical Filters */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#B8C4CA' }}>Statistical Filters</Typography>
            <Grid container spacing={2}>
              {/* Points Range */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min Points"
                  type="number"
                  value={teamStatsFilters.minPts}
                  onChange={(e) => handleTeamStatsFilterChange('minPts', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Points"
                  type="number"
                  value={teamStatsFilters.maxPts}
                  onChange={(e) => handleTeamStatsFilterChange('maxPts', e.target.value)}
                />
              </Grid>

              {/* FG% Range */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min FG%"
                  type="number"
                  value={teamStatsFilters.minFgPercent}
                  onChange={(e) => handleTeamStatsFilterChange('minFgPercent', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max FG%"
                  type="number"
                  value={teamStatsFilters.maxFgPercent}
                  onChange={(e) => handleTeamStatsFilterChange('maxFgPercent', e.target.value)}
                />
              </Grid>

              {/* 3P% Range */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min 3P%"
                  type="number"
                  value={teamStatsFilters.min3pPercent}
                  onChange={(e) => handleTeamStatsFilterChange('min3pPercent', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max 3P%"
                  type="number"
                  value={teamStatsFilters.max3pPercent}
                  onChange={(e) => handleTeamStatsFilterChange('max3pPercent', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Mavericks Team Records
        </Typography>
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterList />
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <FilterSection />
      </Collapse>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Season</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>W</TableCell>
              <TableCell>L</TableCell>
              <TableCell>Win%</TableCell>
              <TableCell>Finish</TableCell>
              <TableCell>Pace</TableCell>
              <TableCell>ORtg</TableCell>
              <TableCell>DRtg</TableCell>
              <TableCell>Playoffs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.season}>
                <TableCell>{record.season}</TableCell>
                <TableCell>{record.coaches}</TableCell>
                <TableCell>{record.w}</TableCell>
                <TableCell>{record.l}</TableCell>
                <TableCell>{record.wl}</TableCell>
                <TableCell>{record.finish}</TableCell>
                <TableCell>{record.pace}</TableCell>
                <TableCell>{record.ortg}</TableCell>
                <TableCell>{record.drtg}</TableCell>
                <TableCell>{record.playoffs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Team Statistics
        </Typography>
        <IconButton onClick={() => setShowTeamStatsFilters(!showTeamStatsFilters)}>
          <FilterList />
        </IconButton>
      </Box>

      <Collapse in={showTeamStatsFilters}>
        <TeamStatsFilterSection />
      </Collapse>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {selectedColumns.map((column) => (
                <TableCell key={column}>
                  {allColumns.find(c => c.id === column)?.label || column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {teamStats.map((stat, index) => (
              <TableRow key={`${stat.Season}-${index}`}>
                {selectedColumns.map((column) => {
                  const value = stat[column];
                  if (column.includes('_percent')) {
                    return (
                      <TableCell key={column}>
                        {value ? (value * 100).toFixed(1) : '0.0'}%
                      </TableCell>
                    );
                  }
                  return <TableCell key={column}>{value}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={-1}
          rowsPerPage={teamStatsRowsPerPage}
          page={teamStatsPage}
          onPageChange={handleTeamStatsChangePage}
          onRowsPerPageChange={handleTeamStatsChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default MavsStats; 