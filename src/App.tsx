import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PhotoGallery from './components/PhotoGallery';
import PhotoDetails from './components/PhotoDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotoGallery />} />
        <Route path="/photo/:id" element={<PhotoDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
