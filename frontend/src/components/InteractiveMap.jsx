import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths in some bundlers (not strictly needed for CircleMarkers, but good practice)
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

const CENTER = [25.2425, 86.9842]; // Bhagalpur roughly center

const createCustomIcon = (colorClass, pulse = false) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="relative w-4 h-4 flex items-center justify-center">
             ${pulse ? `<span class="animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass.split(' ')[0]} opacity-75"></span>` : ''}
             <span class="relative inline-flex rounded-full w-3 h-3 shadow-[0_0_10px_currentColor] ${colorClass}"></span>
           </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

function CameraController({ incidents, locations }) {
  const map = useMap();
  
  React.useEffect(() => {
    const activeIncidents = incidents.filter(i => i.status !== 'resolved');
    
    if (activeIncidents.length > 0) {
      // Find the most recent active incident
      const latest = [...activeIncidents].sort((a,b) => b.timestamp - a.timestamp)[0];
      const coords = locations[latest.location];
      if (coords) {
        // Fly to the active crisis with a closer zoom
        map.flyTo(coords, 14, { duration: 1.5 });
      }
    } else {
      // No active incidents, return to standard city view
      map.flyTo(CENTER, 13, { duration: 1.5 });
    }
  }, [incidents, locations, map]);
  
  return null;
}

function InteractiveMap({ incidents, responders, locations }) {
  if (!locations || Object.keys(locations).length === 0) {
    return <div className="text-slate-500 dark:text-slate-500">Loading map data...</div>;
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative border border-slate-300 dark:border-slate-700/50">
      <MapContainer 
        center={CENTER} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0 bg-slate-100 dark:bg-slate-950"
      >
        <CameraController incidents={incidents} locations={locations} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          className="transition-all duration-300 saturate-100 brightness-100 opacity-100 dark:saturate-50 dark:brightness-75 dark:contrast-125 dark:opacity-90"
        />

        {/* Render Locations/Zones as subtle circles */}
        {Object.entries(locations).map(([areaName, coords]) => {
           // Check if there are active incidents in this zone
           const activeInZone = incidents.filter(i => i.status !== 'resolved' && i.location === areaName);
           const hasCrisis = activeInZone.length > 0;

           return (
             <CircleMarker
               key={`zone-${areaName}`}
               center={coords}
               radius={30}
               pathOptions={{ 
                 color: hasCrisis ? '#ef4444' : '#475569', 
                 fillColor: hasCrisis ? '#ef4444' : '#1e293b', 
                 fillOpacity: hasCrisis ? 0.2 : 0.3, 
                 weight: hasCrisis ? 2 : 1, 
                 dashArray: hasCrisis ? '' : '4' 
               }}
             >
               <Tooltip direction="center" className="!bg-transparent !border-none !shadow-none p-0" permanent>
                 <span className={`font-bold text-[10px] uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${hasCrisis ? 'text-red-400' : 'text-slate-200'}`}>
                   {areaName}
                 </span>
               </Tooltip>
             </CircleMarker>
           );
        })}

        {/* Render Active Incidents */}
        {incidents.filter(i => i.status !== 'resolved').map(incident => {
          const coords = locations[incident.location];
          if (!coords) return null;

          let colorClass = 'bg-amber-500 text-amber-500';
          if (incident.severity === 'high') colorClass = 'bg-orange-500 text-orange-500';
          if (incident.severity === 'critical') colorClass = 'bg-red-500 text-red-500';

          return (
            <Marker
              key={incident.id}
              position={coords}
              icon={createCustomIcon(colorClass, incident.severity === 'critical')}
            >
              <Tooltip>
                <div className="text-slate-900 font-bold">
                  {incident.type.toUpperCase()} EMERGENCY<br/>
                  Severity: {incident.severity}
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {/* Render Responders */}
        {responders.map(responder => {
          const coords = locations[responder.location];
          if (!coords) return null;

          // Add a tiny offset so responders don't perfectly overlap incidents visually
          const offsetCoords = [coords[0] - 0.001, coords[1] + 0.001];

          return (
            <Marker
              key={responder.id}
              position={offsetCoords}
              icon={createCustomIcon('bg-blue-500 border border-white text-blue-500', false)}
              zIndexOffset={100}
            >
              <Tooltip direction="bottom">
                <div className="text-slate-900 font-bold">
                  {responder.name}<br/>
                  Status: {responder.status}
                </div>
              </Tooltip>
            </Marker>
          );
        })}

      </MapContainer>
      
      {/* Overlays to make it feel more "dashboard-y" */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_50px_rgba(2,6,23,0.8)] z-10"></div>
    </div>
  );
}

export default InteractiveMap;
