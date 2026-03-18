import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import SuccessStories from './pages/SuccessStories';
import FreeResources from './pages/FreeResources';
import Academy from './pages/Academy';
import CourseDetail from './pages/CourseDetail';
import Shop from './pages/Shop';
import Consultation from './pages/Consultation';
import Dashboard from './pages/Dashboard';
import AdminPortal from './pages/AdminPortal';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-cream font-jakarta">
          <Routes>
            {/* Admin portal - hidden, no nav/footer */}
            <Route path="/portal-access" element={<AdminPortal />} />

            {/* Public routes with Navbar + Footer */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/success-stories" element={<SuccessStories />} />
                    <Route path="/free-resources" element={<FreeResources />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/consultation" element={<Consultation />} />
                    {/* Protected routes */}
                    <Route
                      path="/academy"
                      element={
                        <ProtectedRoute>
                          <Academy />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/academy/:courseId"
                      element={
                        <ProtectedRoute>
                          <CourseDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
