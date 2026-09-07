import React, { useState } from 'react';

function App() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!make.trim()) {
      setError('Please enter at least a Vehicle Make (e.g. BMW, Porsche, Audi).');
      setResult(null);
      return;
    }
    
    setError('');
    setResult(null); // مسح النتائج القديمة فوراً لمنع استمرار ظهور بيانات خاطئة
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search?make=${make}&model=${model}&year=${year}`);
      const resData = await response.json();
      
      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        setError(resData.message || 'Invalid car name or specs not found.');
      }
    } catch (err) {
      setError('Unable to connect to the specs server. Make sure FastAPI backend is running.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Car Specs Search Engine</h1>
        <p style={styles.subtitle}>Enter a vehicle make and model to fetch dynamic specifications</p>

        <form onSubmit={handleSearch} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Make (e.g. BMW, Toyota)"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Model (e.g. M4, Supra)"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Year (e.g. 2024)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Searching...' : 'Search Specs'}
          </button>
        </form>

        {error && <div style={styles.errorBox}>{error}</div>}

        {result && (
          <div style={styles.resultContainer}>
            <div style={styles.resultHeader}>
              <div>
                <h2 style={styles.carTitle}>{result.title}</h2>
                <span style={styles.statusBadge}>● {result.status}</span>
              </div>
              <span style={styles.yearTag}>{result.year}</span>
            </div>

            <div style={styles.specsGrid}>
              <div style={styles.specCard}>
                <h3 style={{...styles.categoryTitle, color: '#60a5fa'}}>ENGINE & TRANSMISSION</h3>
                <p><strong>Configuration:</strong> {result.engine_specs.configuration}</p>
                <p><strong>Drivetrain:</strong> {result.engine_specs.drivetrain}</p>
                <p><strong>Transmission:</strong> {result.engine_specs.transmission}</p>
                <p><strong>Fuel System:</strong> {result.engine_specs.fuel_type}</p>
              </div>

              <div style={styles.specCard}>
                <h3 style={{...styles.categoryTitle, color: '#f59e0b'}}>PERFORMANCE METRICS</h3>
                <p><strong>Output Power:</strong> {result.performance.estimated_hp}</p>
                <p><strong>Acceleration:</strong> {result.performance.acceleration}</p>
                <p><strong>Top Speed:</strong> {result.performance.top_speed}</p>
                <p><strong>Torque:</strong> {result.performance.torque}</p>
              </div>

              <div style={styles.specCard}>
                <h3 style={{...styles.categoryTitle, color: '#10b981'}}>CHASSIS & SPECS</h3>
                <p><strong>Body Style:</strong> {result.dimensions_and_class.body_style}</p>
                <p><strong>Seating Capacity:</strong> {result.dimensions_and_class.seating_capacity}</p>
                <p><strong>Production Status:</strong> {result.dimensions_and_class.platform_status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  inputGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  input: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #ef4444',
    color: '#f87171',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  resultContainer: {
    marginTop: '24px',
    backgroundColor: '#0f172a',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #334155',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  carTitle: {
    margin: 0,
    fontSize: '22px',
  },
  statusBadge: {
    fontSize: '12px',
    color: '#10b981',
    marginTop: '4px',
    display: 'inline-block',
  },
  yearTag: {
    backgroundColor: '#334155',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  specCard: {
    backgroundColor: '#1e293b',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  categoryTitle: {
    fontSize: '13px',
    letterSpacing: '0.05em',
    marginTop: 0,
    marginBottom: '12px',
  },
};

export default App;