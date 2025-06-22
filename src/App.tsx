import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import "./App.css";
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}
export default App;