import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [units, setUnits] = useState('');
  const [bill, setBill] = useState('');
  const [acKW, setAcKW] = useState('1.5');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [days, setDays] = useState('30');
  const [energyCost, setEnergyCost] = useState(null);
  const [slabDetails, setSlabDetails] = useState([]);
  const [error, setError] = useState('');

  // JDVVNL Jodhpur Slab Rates (Rs/kWh)
  const getSlabRate = (totalUnits) => {
    if (totalUnits <= 50) return 5.5;
    if (totalUnits <= 100) return 6.0;
    if (totalUnits <= 150) return 6.5;
    if (totalUnits <= 200) return 7.0;
    if (totalUnits <= 300) return 7.5;
    if (totalUnits <= 500) return 8.0;
    return 9.0;
  };

  const calculateBill = (units) => {
    let total = 0;
    let remaining = units;
    const details = [];
    const slabs = [
      { max: 50, rate: 5.5 },
      { max: 100, rate: 6.0 },
      { max: 150, rate: 6.5 },
      { max: 200, rate: 7.0 },
      { max: 300, rate: 7.5 },
      { max: 500, rate: 8.0 },
      { max: Infinity, rate: 9.0 },
    ];
    let prev = 0;
    for (let slab of slabs) {
      if (remaining <= 0) break;
      const slabSize = slab.max - prev;
      const unitsInSlab = Math.min(remaining, slabSize);
      const cost = unitsInSlab * slab.rate;
      details.push({
        slab: prev === 0 ? '0-50' : prev + '-' + (slab.max === Infinity ? '500+' : slab.max),
        units: unitsInSlab,
        rate: slab.rate,
        cost: cost.toFixed(2),
      });
      remaining -= unitsInSlab;
      prev = slab.max;
      total += cost;
    }
    return { total, details };
  };

  const handleAnalyze = () => {
    setError('');
    setEnergyCost(null);
    setSlabDetails([]);

    const acUnits = (parseFloat(acKW) * parseFloat(hoursPerDay) * parseFloat(days)).toFixed(2);
    const totalUnits = parseFloat(units) + parseFloat(acUnits);

    if (isNaN(totalUnits) || totalUnits <= 0) {
      setError('Please enter valid base units.');
      return;
    }

    const { total, details } = calculateBill(totalUnits);
    setEnergyCost(total.toFixed(2));
    setSlabDetails(details);
    setBill(total.toFixed(2));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>AC Cost Analyzer</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>JDVVNL Jodhpur Electricity Bill Calculator</p>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Base Consumption</h3>
        <label>
          Base Units (without AC): 
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      <div style={{ backgroundColor: '#e8f4f8', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>AC Details</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>
            AC Power (kW): 
            <input
              type="number"
              value={acKW}
              onChange={(e) => setAcKW(e.target.value)}
              step="0.1"
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Hours per Day: 
            <input
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Days in Month: 
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Analyze Bill
      </button>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {energyCost && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h3>Bill Analysis</h3>
          <p><strong>Total Estimated Bill:</strong> Rs. {energyCost}</p>
          <p><strong>AC Energy Consumption:</strong> {(parseFloat(acKW) * parseFloat(hoursPerDay) * parseFloat(days)).toFixed(2)} kWh</p>
          
          <h4>Slab Breakdown:</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#c3e6cb' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Slab</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Units</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Rate (Rs/kWh)</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cost (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {slabDetails.map((d, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{d.slab}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{d.units}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{d.rate}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{d.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
