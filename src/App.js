// src/App.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      const { data, error } = await supabase
        .from('health_data')
        .select('*')
        .order('created_at', { ascending: false });  // newest entries first

      if (error) {
        console.error('Error fetching health data:', error);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    fetchHealthData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Health Data Table</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>User ID</th>
              <th style={thStyle}>Heart Rate</th>
              <th style={thStyle}>SpO2</th>
              <th style={thStyle}>Timestamp</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} style={trStyle}>
                <td style={tdStyle}>{row.id}</td>
                <td style={tdStyle}>{row.user_id}</td>
                <td style={tdStyle}>{row.heart_rate}</td>
                <td style={tdStyle}>{row.spo2}</td>
                <td style={tdStyle}>{row.timestampe || '-'}</td>
                <td style={tdStyle}>{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  borderBottom: '2px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
};

const tdStyle = {
  borderBottom: '1px solid #ddd',
  padding: '8px',
};

const trStyle = {
  // You can add hover effect with CSS instead, for simplicity omitted here
};

export default App;
