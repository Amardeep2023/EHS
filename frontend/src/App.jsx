import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

import About from './pages/About';
import SuccessStories from './pages/SuccessStories';
import FreeResources from './pages/FreeResources';
import Academy from './pages/Academy';
import CourseDetail from './pages/CourseDetail';
import Shop from './pages/Shop';
import Consultation from './pages/Consultation';
import UserDashboard from './pages/UserDashboard';
import AdminPortal from './pages/AdminPortal';
import StoryForm from './pages/StoryForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import CourseForm from './components/admin/CourseForm';
import UploadFreeCourseForm from './pages/UploadFreeCourseForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-satoshi relative overflow-x-hidden">
          {/* Global Beach Background */}
          <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden bg-white/20">
  <video 
    autoPlay 
    loop 
    muted 
    playsInline
    className="w-full h-full object-cover blur-[2px] opacity-100 brightness-110 scale-[1.1]"
  >
    <source src="/assets/bgvideo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
          
          <Routes>
            {/* Admin portal - hidden, no nav/footer */}
            <Route path="/portal-access" element={<AdminPortal />} />
            <Route
              path="/portal-access/freecourse-upload"
              element={
                <ProtectedRoute adminOnly>
                  <UploadFreeCourseForm />
                </ProtectedRoute>
              }
            />

            {/* Public routes with Navbar + Footer */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/academy" element={<Academy />} />
                    <Route path="/success-stories" element={<SuccessStories />} />
                    <Route path="/free-resources" element={<FreeResources />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/consultation" element={<Consultation />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-cancel" element={<PaymentCancel />} />
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
                        
                          <CourseDetail />
                        
                      }
                    />
                    <Route
                      path="/portal-access/story-upload"
                      element={
                        <ProtectedRoute>
                          <StoryForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <UserDashboard />
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
