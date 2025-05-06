import { Routes, Route } from 'react-router-dom';
import Landing from '../components/screens/landing/landing';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
};

export default AppRoutes;