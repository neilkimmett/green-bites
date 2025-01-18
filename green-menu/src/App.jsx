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
    getPosition: (d) => d.coordinates,
    getFillColor: (d) => {
      // Scale from red (0) through yellow/orange (50) to green (100)
      const score = d.value;
      let r, g;
      if (score <= 50) {
        // Red to Yellow (0-50)
        r = 255;
        g = Math.max(0, Math.min(255, 255 * (score/50)));
      } else {
        // Yellow to Green (51-100)
        r = Math.max(0, Math.min(255, 255 * (2 - score/50)));
        g = 255;
      }
      return [r, g, 0, 200]; // Using blue=0 to create red-yellow-green spectrum
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
        background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0))',
        padding: '20px',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <h1 style={{ 
          margin: 0,
          fontSize: '2.5em',
          fontWeight: '600'
        }}>
          NYC Restaurant Grades
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '1.1em',
          opacity: 0.9
        }}>
          Explore Energy Star Scores for NYC Restaurants
        </p>
      </div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[scatterplotLayer]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        getTooltip={({object}) => object && {
          html: `
            <div style="padding: 8px">
              <p><h3>${object.name}</h3></p>
              <p><b>Score:</b> ${object.value}</p>
              <p><b>Grade:</b> ${object.letterScore}</p>
            </div>
          `,
          style: {
            backgroundColor: '#fff',
            fontSize: '0.8em'
          }
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