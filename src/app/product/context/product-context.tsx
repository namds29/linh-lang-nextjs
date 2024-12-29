import { createContext } from "react";

const ProductContext = createContext({});

export function ProductContextProvider({ children }: any) {
  <ProductContext.Provider value={{}}>{children}</ProductContext.Provider>;
}
