import React, { useState, useEffect } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl';

// Mapbox Access Token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZm9ydGdyZWVuZW9wZW5zdHJlZXRzIiwiYSI6ImNrbHpoZm1tNjF2cW0ydXM1b2I4aW9leGkifQ.IcBBiCbvTtp8vaGPixDsGw';

// Initial Viewport Settings
const INITIAL_VIEW_STATE = {
  longitude: -73.96625,
  latitude: 40.78343,
  zoom: 12,
  pitch: 0,
  bearing: 0,
};

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load CSV data
  useEffect(() => {
    console.log('Attempting to fetch data...');
    fetch('/data/restaurants.csv')
      .then((response) => {
        console.log('Response received:', response);
        return response.text();
      })
      .then((csvText) => {
        console.log('CSV text received, first 100 chars:', csvText.substring(0, 100));
        const rows = csvText.split('\n').slice(1); // Skip header
        const parsedData = rows.map((row) => {
          const [score_address,place_address,name,Longitude,Latitude,Block,Lot,Building_Class,Tax_Class,Building_Count,DOF_Gross_Square_Footage,Address,BoroughName,BBL,score,LetterScore,h3,similarity,rank] = row.split(',');
          return {
            coordinates: [parseFloat(Longitude), parseFloat(Latitude)],
            value: parseFloat(score),
            address: Address,
            name: name,
            borough: BoroughName,
            letterScore: LetterScore,
          };
        });
        console.log('Parsed data:', parsedData.slice(0, 3));
        setData(parsedData);
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }, []);

  console.log('Current data state:', data);
  console.log('Creating scatterplot layer with data length:', data.length);

  // Scatterplot Layer
  const scatterplotLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data,
    pickable: true,
    opacity: 0.8,
    filled: true,
    radiusScale: 10,
    radiusMinPixels: 5,
    radiusMaxPixels: 50,
    lineWidthMinPixels: 1,
    getPosition: (d) => d.coordinates,
    getRadius: 5,
    getFillColor: (d) => {
      const score = d.value;
      let r, g;
      if (score <= 50) {
        r = 255;
        g = Math.max(0, Math.min(255, 255 * (score/50)));
      } else {
        r = Math.max(0, Math.min(255, 255 * (2 - score/50)));
        g = 255;
      }
      return [r, g, 0, 200];
    },
    onHover: (info) => {
      console.log('Hover:', info.object); // Debug hover events
    }
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        background: '#0a2f1c', // Darker green background
        padding: '20px',
        color: '#e0f2e9', // Light green text
        fontFamily: '"Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          margin: 0,
          fontSize: '2.5em',
          fontWeight: '600',
          color: '#4ade80' // Bright green title
        }}>
          Green Bites
        </h1>

        <div style={{
          position: 'relative',
          marginBottom: '16px'
        }}>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1em',
              border: '1px solid #4ade80', // Green border
              borderRadius: '4px',
              backgroundColor: '#133527', // Darker green background
              color: '#e0f2e9', // Light green text
              outline: 'none',
              boxSizing: 'border-box',
              '::placeholder': {
                color: '#88c4a3' // Muted green for placeholder
              }
            }}
          />
        </div>
      </div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[scatterplotLayer]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        pickingRadius={10}
        getCursor={({isHovering}) => isHovering ? 'pointer' : 'grab'}
        onHover={(info) => {
          console.log('DeckGL Hover:', info.object); // Debug hover events
        }}
        getTooltip={({object}) => {
          if (!object) {
            return null;
          }
          console.log('Tooltip object:', object); // Debug tooltip
          return {
            text: `${object.name}\nScore: ${object.value}\nGrade: ${object.letterScore}`
          };
        }}
      >
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          reuseMaps
          attributionControl={false}
        />
      </DeckGL>
    </div>
  );
}

export default App;