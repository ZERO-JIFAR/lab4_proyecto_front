import React from 'react';
import Topbar from '../../ui/topbar/topbar';
import Footer from '../../ui/footer/footer';

const Landing = () => {
  return (
    <div>
      <Topbar />

      <div style={{ minHeight: '80vh', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}><strong>Nike</strong></h1>
          <p style={{ color: '#555', fontSize: '1.2rem' }}>Just do it!</p>
        </div>

        <hr style={{ margin: '2rem 0' }} />

        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#333' }}>
          Productos Destacados
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '1rem' }}>
          <img src="/images/zapatillas/Zapatillas1.webp" alt="Zapatilla 1" style={{ height: '120px', borderRadius: '8px' }} />
          <img src="/images/zapatilla2.png" alt="Zapatilla 2" style={{ height: '120px', borderRadius: '8px' }} />
          <img src="/images/zapatilla3.png" alt="Zapatilla 3" style={{ height: '120px', borderRadius: '8px' }} />
          <img src="/images/zapatilla4.png" alt="Zapatilla 4" style={{ height: '120px', borderRadius: '8px' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ¡Compre Ahora!
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
