import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CountryPricingProvider, useCountryPricing } from './context/CountryPricingContext';
import CountrySelectorModal from './components/common/CountrySelectorModal';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import CoursePaymentSuccess from './pages/CoursePaymentSuccess';
import CoursePaymentCancel from './pages/CoursePaymentCancel';
import CourseContent from './pages/CourseContent';
import CourseDetail from './pages/CourseDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';
import SuccessStories from './pages/SuccessStories';
import FreeResources from './pages/FreeResources';
import Academy from './pages/Academy';
import Courses from './pages/Courses';

import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Consultation from './pages/Consultation';
import UserDashboard from './pages/UserDashboard';
import AdminPortal from './pages/AdminPortal';
import StoryForm from './pages/StoryForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import CourseForm from './components/admin/CourseForm';
import UploadFreeCourseForm from './pages/UploadFreeCourseForm';

function AppContent() {
  const { showSelector, changeCountry } = useCountryPricing();

  return (
    <>
      {/* Country selector modal — shown on first visit, covers all routes */}
      <CountrySelectorModal
        isOpen={showSelector}
        onSelect={changeCountry}
      />

      <Router>
        <div className="min-h-screen font-satoshi relative overflow-x-hidden">
          {/* Global Beach Background */}
          <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden bg-white/20">
  <video 
    autoPlay 
    loop 
    muted 
    playsInline
    className="w-full h-full object-cover blur-[0px] opacity-100 brightness-110 scale-[1.1]"
  >
    <source src="/assets/bgvideo3.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
          
          <Routes>
            {/* Admin portal - hidden, no nav/footer */}
            <Route
              path="/portal-access"
              element={
                
                  <AdminPortal />
                
              }
            />
            <Route
              path="/portal-access/freecourse-upload"
              element={
                <ProtectedRoute adminOnly>
                  <UploadFreeCourseForm />
                </ProtectedRoute>
              }
            />

            {/* Course payment routes - no nav/footer */}
            <Route path="/course-payment-success" element={<CoursePaymentSuccess />} />
            <Route path="/course-payment-cancel" element={<CoursePaymentCancel />} />

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
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:courseId" element={<CourseDetail />} />
                    <Route path="/academy/:courseId" element={<CourseDetail />} />
                    <Route path="/checkout/:courseId" element={<Checkout />} />
                    <Route path="/success-stories" element={<SuccessStories />} />
                    <Route path="/free-resources" element={<FreeResources />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:productId" element={<ProductDetail />} />
                    <Route path="/consultation" element={<Consultation />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-cancel" element={<PaymentCancel />} />
                    
                    {/* Protected routes */}
                    <Route
                      path="/portal-access/story-upload"
                      element={
                        <ProtectedRoute>
                          <StoryForm />
                        </ProtectedRoute>
                      }
                    />                    <Route path="/course-content/:courseId" element={<CourseContent />} />
                    <Route
                      path="/dashboard"
                      element={
                        
                          <UserDashboard />
                        
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CountryPricingProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </CountryPricingProvider>
    </AuthProvider>
  );
}

export default App;
