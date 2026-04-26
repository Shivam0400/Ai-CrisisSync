const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

const respondersFile = path.join(__dirname, 'responders.json');

app.use(cors());
app.use(express.json());

// In-memory Database
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

// Responders dataset
const defaultResponders = [
  { id: 'r1', name: 'Raj (Sec)', type: 'security', location: 'Tilkamanjhi', status: 'available' },
  { id: 'r2', name: 'Priya (Med)', type: 'medical', location: 'Barari', status: 'available' },
  { id: 'r3', name: 'Vikram (Sec)', type: 'security', location: 'Zero Mile', status: 'available' },
  { id: 'r4', name: 'Neha (Med)', type: 'medical', location: 'Adampur', status: 'available' },
  { id: 'r5', name: 'Amit (Sec)', type: 'security', location: 'Nathnagar', status: 'available' },
];

let responders = [];
if (fs.existsSync(respondersFile)) {
  responders = JSON.parse(fs.readFileSync(respondersFile, 'utf-8'));
} else {
  responders = [...defaultResponders];
  fs.writeFileSync(respondersFile, JSON.stringify(responders, null, 2));
}

const saveResponders = () => {
  fs.writeFileSync(respondersFile, JSON.stringify(responders, null, 2));
};

// Incidents dataset
const incidents = [];

const getDistance = (locA, locB) => {
  const coordsA = locations[locA];
  const coordsB = locations[locB];
  if (!coordsA || !coordsB) return 999;
  const [lat1, lon1] = coordsA;
  const [lat2, lon2] = coordsB;
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
};

// Intelligence: Severity Classification
const calculateSeverity = (type, affected) => {
  if (type === 'fire') {
    if (affected > 10) return 'critical';
    return 'high';
  }
  if (type === 'medical') {
    if (affected > 5) return 'critical';
    if (affected > 1) return 'high';
    return 'medium';
  }
  if (type === 'security') {
    if (affected > 10) return 'critical';
    if (affected > 3) return 'high';
    if (affected > 0) return 'medium';
  }
  return 'low';
};

// Smart Responder Assignment
const assignResponder = (incident) => {
  // Find nearest available responder matching type (or fallback to any if urgent, but let's match type for simplicity)
  let bestResponder = null;
  let minDistance = Infinity;

  const typeNeeded = incident.type === 'medical' ? 'medical' : 'security';

  responders.forEach((responder) => {
    if (responder.status === 'available') {
      // Prioritize type match, but if not matching, we add a huge penalty
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

// API: Report Incident
app.post('/api/incidents', (req, res) => {
  const { type, location, affected, notes } = req.body;
  if (!type || !location || affected === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const severity = calculateSeverity(type, parseInt(affected));
  
  const incident = {
    id: `inc-${idCounter++}`,
    type,
    location,
    affected: parseInt(affected),
    notes: notes || '',
    severity,
    status: 'pending',
    assignedTo: null,
    timestamp: Date.now()
  };

  incidents.push(incident);

  // Try to assign immediately
  assignResponder(incident);

  res.status(201).json(incident);
});

app.post('/api/responders', (req, res) => {
  const { name, type, location } = req.body;
  if (!name || !type || !location) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const newResponder = {
    id: `r${responders.length + 1}`,
    name,
    type,
    location,
    status: 'available'
  };

  responders.push(newResponder);
  saveResponders();
  res.status(201).json(newResponder);
});

// API: Get Status
app.get('/api/status', (req, res) => {
  res.json({
    incidents,
    responders,
    locations
  });
});

// Live Simulation Logic: Resolution and Responder Movement
setInterval(() => {
  // Simulate responders moving towards their assigned incidents or resolving them
  incidents.forEach(incident => {
    if (incident.status === 'assigned' && incident.assignedTo) {
      const responder = responders.find(r => r.id === incident.assignedTo);
      if (responder) {
          // Simple Simulation: Resolve after ~15-20 seconds (for demo)
          const timeElapsed = Date.now() - incident.timestamp;
          if (timeElapsed > 15000) {
            incident.status = 'resolved';
            responder.status = 'available';
            // Responder stays at the location of the incident
            responder.location = incident.location;
          } else {
             // Snap responder to incident location while en route for demo purposes
             if (responder.location !== incident.location) {
               responder.location = incident.location;
             }
          }
      }
    }
  });

  // Try assigning any pending incidents every tick
  incidents.forEach(incident => {
    if (incident.status === 'pending') {
      assignResponder(incident);
    }
  });
}, 2000);

// Automatic Random Crisis Generator
setInterval(() => {
  // 30% chance every 6 seconds to generate an incident if there are less than 8 active ones
  if (Math.random() < 0.3 && incidents.filter(i => i.status !== 'resolved').length < 8) {
    const types = ['medical', 'security', 'fire'];
    const locationKeys = Object.keys(locations);
    const type = types[Math.floor(Math.random() * types.length)];
    const location = locationKeys[Math.floor(Math.random() * locationKeys.length)];
    const affected = Math.floor(Math.random() * 12) + 1;
    
    const severity = calculateSeverity(type, affected);
    const incident = {
      id: `inc-${idCounter++}`,
      type,
      location,
      affected,
      notes: 'Automated System Event',
      severity,
      status: 'pending',
      assignedTo: null,
      timestamp: Date.now()
    };
    
    incidents.push(incident);
    assignResponder(incident);
  }
}, 6000);

app.listen(port, () => {
  console.log(`CrisisSync Backend running on port ${port}`);
});
