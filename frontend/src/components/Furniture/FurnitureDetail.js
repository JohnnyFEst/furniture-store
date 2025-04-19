import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const FurnitureDetail = () => {
  const { id } = useParams();
  const [furnitureItem, setFurnitureItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFurnitureDetail = async () => {
      setLoading(true);
      setError('');
      setFurnitureItem(null);
      try {
        const response = await api.get(`/api/furniture/furniture/${id}/`);
        setFurnitureItem(response.data);
      } catch (error) {
        setError('Error al cargar los detalles del mueble');
        console.error('Error fetching furniture detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFurnitureDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar al carrito.');
      return;
    }
    if (!furnitureItem) return;
    try {
      await api.post('/api/cart/', { furniture_id: furnitureItem.id, quantity: quantityToAdd });
      alert(`${furnitureItem.name} agregado al carrito!`);
    } catch (error) {
      setError('Error al agregar al carrito');
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <p>Cargando detalles del mueble...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!furnitureItem) {
    return <p>Mueble no encontrado.</p>;
  }

  return (
    <div style={{ textAlign: 'center' }}> 
      <h2>{furnitureItem.name}</h2>
      {furnitureItem.image && (
        <div style={{ overflow: 'hidden', display: 'inline-block' }}>
          <img
            src={furnitureItem.image}
            alt={furnitureItem.name}
            style={{
              Width: '500px',
              height: '500px',
              transition: 'transform 0.3s ease-in-out',
              cursor: 'zoom-in',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      )}
      <p>Descripción: {furnitureItem.description}</p>
      <p>Precio: ${furnitureItem.price}</p>
      <p>Categoría: {furnitureItem.category.name}</p>
      <p>Stock: {furnitureItem.stock}</p>

      {furnitureItem.stock > 0 ? (
        <div>
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={furnitureItem.stock}
            value={quantityToAdd}
            onChange={(e) => setQuantityToAdd(parseInt(e.target.value, 10))}
          />
          <button onClick={handleAddToCart} disabled={!isAuthenticated}>
            {isAuthenticated ? 'Agregar al Carrito' : 'Iniciar Sesión para Agregar'}
          </button>
          {!isAuthenticated && <p>Debes iniciar sesión para agregar artículos al carrito.</p>}
        </div>
      ) : (
        <p style={{ color: 'orange' }}>Agotado</p>
      )}
    </div>
  );
};

export default FurnitureDetail;