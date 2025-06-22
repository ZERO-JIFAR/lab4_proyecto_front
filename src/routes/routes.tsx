import { Routes, Route } from 'react-router-dom';
import Landing from '../components/screens/landing/landing';
import SearchItem from '../components/screens/searchItem/searchItem';
import AdminUsersPage from '../components/screens/AdminUsersPage/AdminUsersPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/SearchItem" element={<SearchItem />} />
      <Route path="/admin-usuarios" element={<AdminUsersPage />} />
    </Routes>
  );
};

export default AppRoutes;