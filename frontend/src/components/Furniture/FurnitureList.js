import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import './FurnitureList.css'; 

const FurnitureList = () => {
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFurniture = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/api/furniture/');
        setFurniture(response.data);
      } catch (error) {
        setError('Error al cargar los muebles');
        console.error('Error fetching furniture:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();
  }, []);

  if (loading) {
    return <p>Cargando muebles...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Nuestros Muebles</h2>
      <ul className="furniture-grid"> {/* Aplica la clase al <ul> */}
        {furniture.map((item) => (
          <li key={item.id} className="furniture-item"> {/* Aplica la clase a cada <li> */}
            {item.image && <img src={item.image} alt={item.name} style={{ maxWidth: '100%', height: 'auto' }} />}
            <Link to={`/furniture/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FurnitureList;