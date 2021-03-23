import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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

  const [initialRender, setInitalRender] = useState(true);
 
  useEffect(() => {
    if(initialRender){
      setInitalRender(false);
    } else {
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
    }
  }, [cart]);

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
          addAmount(newArray, productFind, stock);
        }

      } else {
        addNewProduct(productId);
      }     

    } catch {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  function addAmount(newArray: Product[], productFind: Product, stock: Stock) {
    setCart([...newArray, {
      id: productFind.id,
      title: productFind.title,
      price: productFind.price,
      image: productFind.image,
      amount: productFind.amount < stock.amount ? productFind.amount  + 1 : productFind.amount,
    }]);
  }

  async function addNewProduct(productId: number) {
    await api.get(`products/${productId}`)
    .then(response =>  setCart([...cart, {
      id: response.data.id,
      title: response.data.title,
      price: response.data.price,
      image: response.data.image,
      amount: 1,
    }]));
  }
  
  const removeProduct = (productId: number) => {
    try {
      // TODO
      const productFind = cart.find(product => product.id === productId);

      if (productFind) {
        const newArray = cart.filter(product => product.id !== productId);
        setCart(newArray);
      } else {
        throw new Error();
      }
    } catch {
      // TODO
      toast.error('Erro na remoção do produto')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      const productFind = cart.find(product => product.id === productId)
      const newArray = cart.filter(product => product.id !== productId);

      const stock: Stock = await api.get(`stock/${productId}`).then(response => response.data);

      if(productFind) {
        if(stock.amount > amount && amount >= 1 ) {
          setCart([...newArray, {
            id: productFind.id,
            title: productFind.title,
            price: productFind.price,
            image: productFind.image,
            amount: amount,
          }]);

        } else {
          toast.error('Quantidade solicitada fora de estoque');
        }
      } 
    } catch {
      // TODO
      toast.error('Erro na alteração de quantidade do produto');
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
