import { createContext, ReactNode, useContext, useState } from 'react';
// import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, /* Stock */ } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // const storagedCart = localStorage.getItem('@RocketShoes:cart');
    
    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO

      const product = await api.get(`/products/${productId}`)
        .then(response => response.data);

      if(cart.length === 0) {
        setCart([
          {
            amount: 1,
            id: product.id,
            image: product.image,
            price: product.price,
            title: product.title,
          },
        ]);
      } else {
        cart.map(product => {
          if(product.id === productId) {
            console.log('amount product')
            setCart([...cart, {
              amount: product.amount ++,
              id: product.id,
              image: product.image,
              price: product.price,
              title: product.title,
            }]);
          } else {
            console.log('add product')
            setCart([...cart, product]);
          }               
        });
      }
      
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
