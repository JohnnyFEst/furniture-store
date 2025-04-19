import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      setCartItems([]); // Clear cart if not authenticated
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/cart/');
      setCartItems(response.data);
    } catch (error) {
      setError('Error al cargar el carrito');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      await api.patch(`/api/cart/${id}/`, { quantity });
      fetchCartItems(); // Refresh the cart
    } catch (error) {
      setError('Error al actualizar el carrito');
      console.error('Error updating cart item:', error);
    }
  };

  const removeCartItem = async (id) => {
    try {
      await api.delete(`/api/cart/${id}/`);
      fetchCartItems(); // Refresh the cart
    } catch (error) {
      setError('Error al eliminar el artículo del carrito');
      console.error('Error removing cart item:', error);
    }
  };

  if (!isAuthenticated) {
    return <p>Debes iniciar sesión para ver tu carrito.</p>;
  }

  if (loading) {
    return <p>Cargando carrito...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (cartItems.length === 0) {
    return <p>Tu carrito está vacío.</p>;
  }

  return (
    <div>
      <h2>Carrito de Compras</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.furniture.name} - Precio: ${item.furniture.price} - Cantidad:
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10);
                if (!isNaN(newQuantity) && newQuantity > 0) {
                  updateCartItem(item.id, newQuantity);
                }
              }}
            />
            <button onClick={() => removeCartItem(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <div>
        <strong>Total: ${cartItems.reduce((total, item) => total + item.furniture.price * item.quantity, 0).toFixed(2)}</strong>
      </div>
      <button>Finalizar Compra</button> {/* Implementar lógica de compra */}
    </div>
  );
};

export default ShoppingCart;