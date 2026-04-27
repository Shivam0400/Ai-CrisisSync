const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory Database (will reset on cold start, but fine for demo)
let lastTickTime = Date.now();
let idCounter = 1;

// Bhagalpur Locations
const locations = {
  'Tilkamanjhi': [25.2515, 86.9922],
  'Sabour': [25.2393, 87.0515],
  'Nathnagar': [25.2444, 86.9463],
  'Barari': [25.2635, 87.0090],
  'Zero Mile': [25.2285, 86.9830],
  'Adampur': [25.2470, 86.9740],
  'Khanjarpur': [25.2530, 86.9820],
  'Mirjanhat': [25.2320, 86.9750],
  'Khalifabagh': [25.2420, 86.9730],
  'Station Road': [25.2385, 86.9720],
  'Mundichak': [25.2410, 86.9815],
  'Bhikhampur & Gurhatta': [25.2405, 86.9850],
  'Kuppaghat': [25.2662, 87.0093],
  'Champanagar': [25.2505, 86.9336],
  'Budhanath': [25.2547, 86.9748],
  'Kachahari Area': [25.2480, 86.9760],
  'Sultanganj': [25.2443, 86.7408],
  'Naugachia': [25.3812, 87.0016],
  'Kahalgaon': [25.2678, 87.2272]
};

let responders = [
  { id: 'r1', name: 'Raj (Sec)', type: 'security', location: 'Barari', status: 'available' },
  { id: 'r2', name: 'Priya (Med)', type: 'medical', location: 'Mundichak', status: 'available' },
  { id: 'r3', name: 'Vikram (Sec)', type: 'security', location: 'Barari', status: 'available' },
  { id: 'r4', name: 'Neha (Med)', type: 'medical', location: 'Station Road', status: 'available' },
  { id: 'r5', name: 'Amit (Sec)', type: 'security', location: 'Sultanganj', status: 'available' },
  { id: 'r6', name: 'Shantanu', type: 'security', location: 'Champanagar', status: 'available' },
  { id: 'r7', name: 'Amit', type: 'fire', location: 'Adampur', status: 'available' },
  { id: 'r8', name: 'Arpita', type: 'medical', location: 'Adampur', status: 'available' },
  { id: 'r9', name: 'Neha', type: 'medical', location: 'Kuppaghat', status: 'available' },
  { id: 'r10', name: 'Aryan', type: 'fire', location: 'Kuppaghat', status: 'available' },
  { id: 'r11', name: 'Aniket', type: 'fire', location: 'Budhanath', status: 'available' },
  { id: 'r12', name: 'Rohan', type: 'security', location: 'Bhikhampur & Gurhatta', status: 'available' },
  { id: 'r13', name: 'Roshni', type: 'medical', location: 'Khalifabagh', status: 'available' }
];

let incidents = [];

const getDistance = (locA, locB) => {
  const coordsA = locations[locA];
  const coordsB = locations[locB];
  if (!coordsA || !coordsB) return 999;
  const [lat1, lon1] = coordsA;
  const [lat2, lon2] = coordsB;
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
};

const calculateSeverity = (type, affected) => {
  if (type === 'fire') return affected > 10 ? 'critical' : 'high';
  if (type === 'medical') return affected > 5 ? 'critical' : affected > 1 ? 'high' : 'medium';
  if (type === 'security') return affected > 10 ? 'critical' : affected > 3 ? 'high' : 'medium';
  return 'low';
};

const assignResponder = (incident) => {
  let bestResponder = null;
  let minDistance = Infinity;
  const typeNeeded = incident.type === 'medical' ? 'medical' : 'security';

  responders.forEach((responder) => {
    if (responder.status === 'available') {
      const typePenalty = responder.type === typeNeeded ? 0 : 50; 
      const distance = getDistance(responder.location, incident.location) + typePenalty;
      if (distance < minDistance) {
        minDistance = distance;
        bestResponder = responder;
      }
    }
  });

  if (bestResponder) {
    bestResponder.status = 'busy';
    incident.status = 'assigned';
    incident.assignedTo = bestResponder.id;
    return true;
  }
  return false;
};

// Simulation Logic: Runs on request
const runSimulation = () => {
  const now = Date.now();
  const elapsed = now - lastTickTime;
  
  // Resolve incidents that have been assigned for > 15 seconds
  incidents.forEach(incident => {
    if (incident.status === 'assigned' && incident.assignedTo) {
      const timeElapsed = now - incident.timestamp;
      if (timeElapsed > 15000) {
        incident.status = 'resolved';
        const responder = responders.find(r => r.id === incident.assignedTo);
        if (responder) {
          responder.status = 'available';
          responder.location = incident.location;
        }
      } else {
        // En route: snap responder to location for demo
        const responder = responders.find(r => r.id === incident.assignedTo);
        if (responder) responder.location = incident.location;
      }
    }
  });

  // Assign pending incidents
  incidents.forEach(incident => {
    if (incident.status === 'pending') {
      assignResponder(incident);
    }
  });

  // Random Crisis Generation (if enough time passed since last tick, approx 6s)
  if (elapsed > 6000 && Math.random() < 0.3 && incidents.filter(i => i.status !== 'resolved').length < 8) {
    const types = ['medical', 'security', 'fire'];
    const locationKeys = Object.keys(locations);
    const type = types[Math.floor(Math.random() * types.length)];
    const location = locationKeys[Math.floor(Math.random() * locationKeys.length)];
    const affected = Math.floor(Math.random() * 12) + 1;
    
    const incident = {
      id: `inc-${idCounter++}`,
      type,
      location,
      affected,
      notes: 'Automated System Event',
      severity: calculateSeverity(type, affected),
      status: 'pending',
      assignedTo: null,
      timestamp: now
    };
    incidents.push(incident);
    assignResponder(incident);
  }

  lastTickTime = now;
};

app.post('/api/incidents', (req, res) => {
  runSimulation();
  const { type, location, affected, notes } = req.body;
  if (!type || !location || affected === undefined) return res.status(400).json({ error: 'Missing fields' });

  const incident = {
    id: `inc-${idCounter++}`,
    type,
    location,
    affected: parseInt(affected),
    notes: notes || '',
    severity: calculateSeverity(type, parseInt(affected)),
    status: 'pending',
    assignedTo: null,
    timestamp: Date.now()
  };

  incidents.push(incident);
  assignResponder(incident);
  res.status(201).json(incident);
});

app.post('/api/responders', (req, res) => {
  runSimulation();
  const { name, type, location } = req.body;
  if (!name || !type || !location) return res.status(400).json({ error: 'Missing fields' });

  const newResponder = {
    id: `r${responders.length + 1}`,
    name,
    type,
    location,
    status: 'available'
  };

  responders.push(newResponder);
  res.status(201).json(newResponder);
});

app.get('/api/status', (req, res) => {
  runSimulation();
  res.json({ incidents, responders, locations });
});

// For local testing if needed
if (process.env.NODE_ENV !== 'production') {
  const port = 3001;
  // Use a conditional listen to avoid errors on Vercel
  if (!process.env.VERCEL) {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  }
}

module.exports = app;
