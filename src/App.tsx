import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PhotoGallery from './components/PhotoGallery';
import PhotoDetails from './components/PhotoDetails'; // Import your PhotoDetails component

function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<PhotoGallery />} />
      </Routes>

      {/* Render PhotoDetails as a modal if the route matches */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/photo/:id" element={<PhotoDetails />} />
        </Routes>
      )}
    </>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
