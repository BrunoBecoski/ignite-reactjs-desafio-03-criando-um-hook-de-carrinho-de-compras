import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

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

    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    
    return [];
  });


  const addProduct = async (productId: number) => {
    try {
      // TODO
      const productFind = cart.find(product => product.id === productId)
      const newArray = cart.filter(product => product.id !== productId);

      const stock: Stock = await api.get(`stock/${productId}`).then(response => response.data);
      
      if(productFind) {
        const add = productFind.amount < stock.amount;

        if(!add) {
          toast.error('Quantidade solicitada fora de estoque');
        } else {
          await setCart([...newArray, {
            id: productFind.id,
            title: productFind.title,
            price: productFind.price,
            image: productFind.image,
            amount: productFind.amount < stock.amount ? productFind.amount  + 1 : productFind.amount,
          }]);
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
        }
      } else {
        await api.get(`products/${productId}`)
        .then(response =>  setCart([...cart, {
          id: response.data.id,
          title: response.data.title,
          price: response.data.price,
          image: response.data.image,
          amount: 1,
        }]));
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
      }      

    } catch {
      // TODO
      toast.error('Erro na adição do produto');
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
