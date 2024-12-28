import { createContext } from "react";

const CartContext = createContext({});

export function CartContextProvider({ children }: any) {
  <CartContext.Provider value={{}}>{children}</CartContext.Provider>;
}
