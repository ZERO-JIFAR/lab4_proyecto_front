import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import "./App.css";
import { CartProvider } from './context/CartContext';
import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";

function App() {
  useEffect(() => {
    if (import.meta.env.VITE_MP_PUBLIC_KEY) {
      initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
    }
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}
export default App;