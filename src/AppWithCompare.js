import React, { useState } from 'react';

function App() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // نظام المقارنة
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // دالة ذكية لجلب صورة حقيقية للعربية بناءً على الماركة والموديل
  const getCarImageUrl = (carMake, carModel) => {
    const cleanMake = (carMake || '').toLowerCase().trim();
    const cleanModel = (carModel || '').toLowerCase().trim();
    
    // روابط صور حقيقية ومضمونة حسب أشهر البراندات أو استخدام صور عامة موثوقة للسيارات
    if (cleanMake.includes('bmw')) {
      return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80';
    } else if (cleanMake.includes('porsche')) {
      return 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80';
    } else if (cleanMake.includes('toyota')) {
      return 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80';
    } else if (cleanMake.includes('mercedes')) {
      return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80';
    } else {
      // صورة افتراضية فخمة للسيارات الرياضية
      return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!make.trim()) {
      setError('Please enter at least a Vehicle Make (e.g. BMW, Porsche)');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/search?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`);
      const resData = await response.json();
      
      if (response.ok) {
        setResult(resData);
      } else {
        setError(resData.message || 'Invalid car name or specs not found');
      }
    } catch (err) {
      setError('Unable to connect to the specs server. Make sure FastAPI is running.');
    }
    setLoading(false);
  };

  const addToCompare = (carData) => {
    if (compareList.length >= 2) {
      setCompareList([compareList[1], carData]);
    } else if (!compareList.some(c => c.title === carData.title)) {
      setCompareList([...compareList, carData]);
    }
    setShowComparison(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Pro Car Specs Engine</h1>
        <p style={styles.subtitle}>Explore high-performance car specifications and compare them instantly.</p>

        <form onSubmit={handleSearch} style={styles.form}>
          <input
            type="text"
            placeholder="Make (e.g. BMW, Porsche)"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Model (e.g. M4, 911)"
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
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Searching...' : 'Search Specs'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {result && (
          <div style={styles.resultContainer}>
            <div style={styles.carCard}>
              <img 
                src={getCarImageUrl(make, model || result.title)} 
                alt={result.title} 
                style={styles.carImage} 
              />
              <h2 style={styles.carTitle}>{result.title}</h2>
              <div style={styles.specsGrid}>
                <div style={styles.specItem}><span>Horsepower:</span> <strong>{result.hp}</strong></div>
                <div style={styles.specItem}><span>Acceleration:</span> <strong>{result.accel}</strong></div>
                <div style={styles.specItem}><span>Top Speed:</span> <strong>{result.speed}</strong></div>
                <div style={styles.specItem}><span>Engine:</span> <strong>{result.engine}</strong></div>
                <div style={styles.specItem}><span>Drive:</span> <strong>{result.drive}</strong></div>
                <div style={styles.specItem}><span>Transmission:</span> <strong>{result.trans}</strong></div>
              </div>
              <button 
                onClick={() => addToCompare(result)} 
                style={styles.compareBtn}
              >
                Add to Compare ⚖️
              </button>
            </div>
          </div>
        )}

        {/* قسم مقارنة العربيات */}
        {showComparison && compareList.length > 0 && (
          <div style={styles.comparisonSection}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Vehicle Comparison</h3>
            <div style={styles.comparisonGrid}>
              {compareList.map((car, index) => (
                <div key={index} style={styles.compareCard}>
                  <h4 style={{ color: '#38bdf8' }}>{car.title}</h4>
                  <p><strong>HP:</strong> {car.hp}</p>
                  <p><strong>Accel:</strong> {car.accel}</p>
                  <p><strong>Speed:</strong> {car.speed}</p>
                  <p><strong>Engine:</strong> {car.engine}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowComparison(false)} style={styles.closeCompareBtn}>
              Close Comparison
            </button>
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
    fontFamily: 'Inter, sans-serif'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '650px',
    border: '1px solid #334155'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#38bdf8'
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  error: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px'
  },
  resultContainer: {
    marginTop: '25px'
  },
  carCard: {
    backgroundColor: '#0f172a',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #334155'
  },
  carImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  carTitle: {
    fontSize: '20px',
    color: '#f8fafc',
    marginBottom: '15px',
    textAlign: 'center'
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    fontSize: '14px',
    marginBottom: '15px'
  },
  specItem: {
    backgroundColor: '#1e293b',
    padding: '8px 12px',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  compareBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  comparisonSection: {
    marginTop: '25px',
    padding: '15px',
    backgroundColor: '#0f172a',
    borderRadius: '12px',
    border: '1px solid #38bdf8'
  },
  comparisonGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px'
  },
  compareCard: {
    backgroundColor: '#1e293b',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px'
  },
  closeCompareBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default App;