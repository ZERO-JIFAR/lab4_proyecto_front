import { Routes, Route } from 'react-router-dom';
import Landing from '../components/screens/landing/landing';
import SearchItem from '../components/screens/searchItem/searchItem';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/SearchItem" element={<SearchItem />} /> {/* Ruta a la página SearchItem */}
    </Routes>
  );
};

export default AppRoutes;
