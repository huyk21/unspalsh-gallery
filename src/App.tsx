import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PhotoGallery from './components/PhotoGallery';
import PhotoDetails from './components/PhotoDetails'; // Import your PhotoDetails component
import Login from './components/Login'; // Import Login component
import Register from './components/Register'; // Import Register component
import Profile from './components/Profile';

function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<PhotoGallery />} />
        <Route path="/login" element={<Login />} />       {/* Login route */}
        <Route path="/register" element={<Register />} /> {/* Register route */}
        <Route path="/profile" element={<Profile />} /> {/* Register route */}
      </Routes>

      {/* Render PhotoDetails as a modal if the route matches */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/photos/:id" element={<PhotoDetails />} />
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
