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
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleChatSubmit = async () => {
    try {
      if (chatInput.toLowerCase().includes("grade of 'a'")) {
        const response = await fetch('/data/restaurants.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        const aRestaurants = rows.filter(row => {
          const columns = row.split(',');
          return columns[14] === 'A'; // Grade column
        }).map(row => {
          const columns = row.split(',');
          return {
            name: columns[2],
            score: columns[15],
            coordinates: [parseFloat(columns[3]), parseFloat(columns[4])], // Longitude, Latitude
          };
        });

        const restaurantList = aRestaurants.map(r => `${r.name} - Score: ${r.score}`).join('\n');
        setChatResponse(restaurantList);

        // Highlight on the map - update your map state here
        setData(aRestaurants);
        return;
      }
      if (chatInput.toUpperCase() === 'A') {
        const response = await fetch('/data/restaurants.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        const aRestaurants = rows.filter(row => {
          const columns = row.split(',');
          return columns[15] === 'A'; // LetterScore column
        }).map(row => {
          const columns = row.split(',');
          return {
            name: columns[2],
            energyStarScore: columns[14],
            letterScore: columns[15],
            coordinates: [parseFloat(columns[3]), parseFloat(columns[4])], // Longitude, Latitude
          };
        });

        // Update the scatterplot data to show only A grade restaurants
        setData(aRestaurants);

        // Return the names, energy star score, and letter score as a response in a scrollable dropdown
        setChatResponse(
          <div style={{ maxHeight: '45px', overflowY: 'scroll' }}>
            <ul>
              {aRestaurants.map((restaurant, index) => (
                <li key={index}>{`${restaurant.name} - Energy Star Score: ${restaurant.energyStarScore}, Letter Score: ${restaurant.letterScore}`}</li>
              ))}
            </ul>
          </div>
        );
        return;
      }
      if (chatInput.toUpperCase() === 'B') {
        const response = await fetch('/data/restaurants.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        const bRestaurants = rows.filter(row => {
          const columns = row.split(',');
          return columns[15] === 'B'; // LetterScore column
        }).map(row => {
          const columns = row.split(',');
          return {
            name: columns[2],
            energyStarScore: columns[14],
            letterScore: columns[15],
            coordinates: [parseFloat(columns[3]), parseFloat(columns[4])], // Longitude, Latitude
          };
        });

        // Update the scatterplot data to show only B grade restaurants
        setData(bRestaurants);

        // Return the names, energy star score, and letter score as a response in a scrollable dropdown
        setChatResponse(
          <div style={{ height: '45px', overflowY: 'scroll' }}>
            <ul>
              {bRestaurants.map((restaurant, index) => (
                <li key={index}>{`${restaurant.name} - Energy Star Score: ${restaurant.energyStarScore}, Letter Score: ${restaurant.letterScore}`}</li>
              ))}
            </ul>
          </div>
        );
        return;
      }
      if (chatInput.toUpperCase() === 'C') {
        const response = await fetch('/data/restaurants.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        const cRestaurants = rows.filter(row => {
          const columns = row.split(',');
          return columns[15] === 'C'; // LetterScore column
        }).map(row => {
          const columns = row.split(',');
          return {
            name: columns[2],
            energyStarScore: columns[14],
            letterScore: columns[15],
            coordinates: [parseFloat(columns[3]), parseFloat(columns[4])], // Longitude, Latitude
          };
        });

        // Update the scatterplot data to show only C grade restaurants
        setData(cRestaurants);

        // Return the names, energy star score, and letter score as a response in a scrollable dropdown
        setChatResponse(
          <div style={{ maxHeight: '45px', overflowY: 'scroll' }}>
            <ul>
              {cRestaurants.map((restaurant, index) => (
                <li key={index}>{`${restaurant.name} - Energy Star Score: ${restaurant.energyStarScore}, Letter Score: ${restaurant.letterScore}`}</li>
              ))}
            </ul>
          </div>
        );
        return;
      }
      if (chatInput.toUpperCase() === 'D') {
        const response = await fetch('/data/restaurants.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        const dRestaurants = rows.filter(row => {
          const columns = row.split(',');
          return columns[15] === 'D'; // LetterScore column
        }).map(row => {
          const columns = row.split(',');
          return {
            name: columns[2],
            energyStarScore: columns[14],
            letterScore: columns[15],
            coordinates: [parseFloat(columns[3]), parseFloat(columns[4])], // Longitude, Latitude
          };
        });

        // Update the scatterplot data to show only D grade restaurants
        setData(dRestaurants);

        // Return the names, energy star score, and letter score as a response in a scrollable dropdown
        setChatResponse(
          <div style={{ maxHeight: '45px', overflowY: 'scroll' }}>
            <ul>
              {dRestaurants.map((restaurant, index) => (
                <li key={index}>{`${restaurant.name} - Energy Star Score: ${restaurant.energyStarScore}, Letter Score: ${restaurant.letterScore}`}</li>
              ))}
            </ul>
          </div>
        );
        return;
      }
      if (chatInput.toLowerCase().includes('restaurant recommendation')) {
        setChatResponse('Which score restaurant would you like to find? (A, B, C, D, etc.)');
        return;
      }
      const scoreRegex = /^[A-F]$/; // Regex to match scores A-F
      if (scoreRegex.test(chatInput.toUpperCase())) {
        const response = await fetch('/data/restaurants.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        const filteredRestaurants = rows.filter(row => {
          const columns = row.split(',');
          return columns[14] === chatInput.toUpperCase(); // Grade column
        }).map(row => {
          const columns = row.split(',');
          return `${columns[2]} - Score: ${columns[15]}`; // Facility_Name - Score
        }).join('\n');

        setChatResponse(filteredRestaurants);
        return;
      }
      if (chatInput.toLowerCase().includes('restaurant')) {
        setChatResponse('Which score restaurant would you like to find? (A, B, C, D, etc.)');
        return;
      }
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: chatInput }],
        }),
      });
      const data = await response.json();
      setChatResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

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
            energyStarScore: score,
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
      // Use the energy star score to determine color
      const score = d.energyStarScore;
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
      return [r, g, 0, 200];
    },
    onHover: (info) => {
      if (info.object) {
        const { name, energyStarScore } = info.object;
        console.log(`Hovered over: ${name}, Energy Star Score: ${energyStarScore}`); // Log the hovered item's name and score
        // You can also set a state to display this information on the UI if needed
      }
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
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask me anything..."
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
          <button onClick={handleChatSubmit} style={{
            padding: '12px',
            fontSize: '1em',
            border: '1px solid #4ade80', // Green border
            borderRadius: '4px',
            backgroundColor: '#133527', // Darker green background
            color: '#e0f2e9', // Light green text
            outline: 'none',
            boxSizing: 'border-box',
            cursor: 'pointer'
          }}>Submit</button>
          <div style={{
            padding: '12px',
            fontSize: '1em',
            border: '1px solid #4ade80', // Green border
            borderRadius: '4px',
            backgroundColor: '#133527', // Darker green background
            color: '#e0f2e9', // Light green text
            outline: 'none',
            boxSizing: 'border-box',
          }}>{chatResponse}</div>
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