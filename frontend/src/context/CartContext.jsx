import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('plantnest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('plantnest_cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  const addToCart = (plant, quantity = 1) => {
    if (!plant.isAvailable || plant.stock <= 0) {
      toast.error(`Sorry, ${plant.name} is currently out of stock.`);
      return false;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.plant._id === plant._id);
      
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;
        
        if (newQty > plant.stock) {
          toast.error(`Cannot add more. Stock limit for ${plant.name} is ${plant.stock}.`);
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex].quantity = newQty;
        toast.success(`Updated ${plant.name} quantity in cart (${newQty})`);
        return updated;
      } else {
        if (quantity > plant.stock) {
          toast.error(`Stock limit for ${plant.name} is ${plant.stock}.`);
          return prev;
        }
        toast.success(`Added ${plant.name} to your cart!`);
        return [...prev, { plant, quantity }];
      }
    });
    return true;
  };

  const updateQuantity = (plantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(plantId);
      return;
    }

    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.plant._id === plantId) {
          if (newQuantity > item.plant.stock) {
            toast.error(`Maximum available stock for ${item.plant.name} is ${item.plant.stock}.`);
            return { ...item, quantity: item.plant.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (plantId) => {
    setCartItems((prev) => prev.filter((item) => item.plant._id !== plantId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.plant.finalPrice || item.plant.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
