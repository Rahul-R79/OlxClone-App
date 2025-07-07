import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar'
import { UserProfileProvider } from './context/UserProfileContext';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';


function App() {
  return (
    <AuthProvider>
        <UserProfileProvider>
                <Navbar />
                <Home />
                <Footer/>
        </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;