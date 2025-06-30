import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../components/screens/landing/landing';
import SearchItem from '../components/screens/searchItem/searchItem';
import AdminUsersPage from '../components/screens/AdminUsersPage/AdminUsersPage';
import { useAuth } from '../context/AuthContext';
import PaymentFailure from '../components/mp/Payment/PaymentFailure';
import { PaymentSuccess } from '../components/mp/Payment/PaymentSuccess';
import AdminTipoPage from '../components/screens/AdminUsersPage/AdminTipoPage';
import AdminCategoriaPage from '../components/screens/AdminUsersPage/AdminCategoriaPage';
import AdminTipoTallePage from '../components/screens/AdminUsersPage/AdminTipoTallePage';
import AdminTallePage from '../components/screens/AdminUsersPage/AdminTallePage';


// ...rest of your code...

// Componente para proteger rutas de admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/SearchItem" element={<SearchItem />} />
      <Route path="/admin/tipos" element={<AdminTipoPage />} />
      <Route path="/admin/categorias" element={<AdminCategoriaPage />} />
      <Route path="/admin/tipo-talles" element={<AdminTipoTallePage />} />
      <Route path="/admin/talles" element={<AdminTallePage />} />
      <Route
        path="/admin-usuarios"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route path="/paymentFailure" element={<PaymentFailure />} />
      <Route path="/paymentSuccess" element={<PaymentSuccess />} />
    </Routes>
  );
};

export default AppRoutes;