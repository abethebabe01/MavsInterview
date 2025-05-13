import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Alert,
  Snackbar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const positions = [
  'Point Guard',
  'Shooting Guard',
  'Small Forward',
  'Power Forward',
  'Center',
];

const MavsScouts = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    player: '',
    height: '',
    wingspan: '',
    age: '',
    college: '',
    position: '',
    intangibles: '',
    development_needs: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/scouting-notes`);
      setNotes(response.data);
    } catch (err) {
      setError('Failed to fetch scouting notes');
    }
  };

  const handleAddNote = async () => {
    if (newNote.player && newNote.notes) {
      try {
        if (editingId) {
          await axios.put(`${API_URL}/scouting-notes/${editingId}`, newNote);
          setSuccess('Note updated successfully');
        } else {
          await axios.post(`${API_URL}/scouting-notes`, newNote);
          setSuccess('Note added successfully');
        }
        setNewNote({
          player: '',
          height: '',
          wingspan: '',
          age: '',
          college: '',
          position: '',
          intangibles: '',
          development_needs: '',
          notes: '',
        });
        setEditingId(null);
        fetchNotes();
      } catch (err) {
        setError('Failed to save note');
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/scouting-notes/${id}`);
      setSuccess('Note deleted successfully');
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleEditNote = (note) => {
    setNewNote(note);
    setEditingId(note.id);
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setViewDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Scouting Notes
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Edit Scouting Note' : 'Add New Scouting Note'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Player Name"
              value={newNote.player}
              onChange={(e) => setNewNote({ ...newNote, player: e.target.value })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={newNote.position}
                label="Position"
                onChange={(e) => setNewNote({ ...newNote, position: e.target.value })}
              >
                {positions.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Height"
              value={newNote.height}
              onChange={(e) => setNewNote({ ...newNote, height: e.target.value })}
              fullWidth
              placeholder="e.g., 6'5"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Wingspan"
              value={newNote.wingspan}
              onChange={(e) => setNewNote({ ...newNote, wingspan: e.target.value })}
              fullWidth
              placeholder="e.g., 6'10"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Age"
              type="number"
              value={newNote.age}
              onChange={(e) => setNewNote({ ...newNote, age: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="College"
              value={newNote.college}
              onChange={(e) => setNewNote({ ...newNote, college: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Intangibles"
              value={newNote.intangibles}
              onChange={(e) => setNewNote({ ...newNote, intangibles: e.target.value })}
              multiline
              rows={2}
              fullWidth
              placeholder="Leadership, work ethic, basketball IQ, etc."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Development Needs"
              value={newNote.development_needs}
              onChange={(e) => setNewNote({ ...newNote, development_needs: e.target.value })}
              multiline
              rows={2}
              fullWidth
              placeholder="Areas for improvement"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Scouting Notes"
              value={newNote.notes}
              onChange={(e) => setNewNote({ ...newNote, notes: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleAddNote}
              sx={{ backgroundColor: '#00538C' }}
            >
              {editingId ? 'Update Note' : 'Add Note'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Scouting Notes List
        </Typography>
        <List>
          {notes.map((note) => (
            <ListItem key={note.id} divider>
              <ListItemText
                primary={note.player}
                secondary={`${note.position || 'No Position'} - ${note.college || 'No College'}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="view"
                  onClick={() => handleViewNote(note)}
                  sx={{ mr: 1 }}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditNote(note)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedNote && (
          <>
            <DialogTitle>{selectedNote.player}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">Position</Typography>
                  <Typography>{selectedNote.position || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">College</Typography>
                  <Typography>{selectedNote.college || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1">Height</Typography>
                  <Typography>{selectedNote.height || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1">Wingspan</Typography>
                  <Typography>{selectedNote.wingspan || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1">Age</Typography>
                  <Typography>{selectedNote.age || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Intangibles</Typography>
                  <Typography>{selectedNote.intangibles || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Development Needs</Typography>
                  <Typography>{selectedNote.development_needs || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Scouting Notes</Typography>
                  <Typography>{selectedNote.notes}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MavsScouts; 