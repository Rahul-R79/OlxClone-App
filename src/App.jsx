// App.js
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import { UserProfileProvider } from './context/UserProfileContext';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import MyAccount from './components/MyAccount';
import SellForm from './components/SellForm/SellForm';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/sell" element={
            <ProtectedRoute>
              <SellForm />
            </ProtectedRoute>
          } />
          <Route path="/my-account" element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;