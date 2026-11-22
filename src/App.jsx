/* Imports the files needed for the App component */
import React from 'react';
import Navbar from './components/Navbar';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  useLocation
} from 'react-router-dom';
import './App.css';
import ScrollToTop from './ScrollToTop';
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import FindRecipes from './components/pages/FindRecipes';
import SignIn from './components/pages/SignIn';
import HowItWorks from './components/pages/HowItWorks';
import Favourites from './components/pages/Favourites';
import UserProfile from './components/pages/UserProfile';
import Footer from './components/Footer';

function AppContent() {
  /* Gets the current URL path */
  const location = useLocation();

  /* Checks whether the current page is Sign In */
  const isSignInPage = location.pathname === '/SignIn';

  return (
    <> 
      {/* Automatically scrolls to the top when changing pages */}
      <ScrollToTop />

      {/* Displays the navigation bar on all pages except Sign In */}
      {!isSignInPage && <Navbar />}

      {/* Defines the available application routes */}
      <Routes>

        {/* Route for the Home page */}
        <Route path='/' element={<Home />} />  

        {/* Route for the About Us page */}
        <Route path='/AboutUs' element={<AboutUs />} />
        
        {/* Route for the Find Recipes page */}
        <Route path='/FindRecipes' element={<FindRecipes />} />

        {/* Route for the Sign In page */}
        <Route path='/SignIn' element={<SignIn />} />

        {/* Route for the How It Works page */}
        <Route path='/HowItWorks' element={<HowItWorks />} />

        {/* Route for the User Profile page */}
        <Route path='/UserProfile' element={<UserProfile />} />

        {/* Route for the Favourites page */}
        <Route path='/Favourites' element={<Favourites />} />

      </Routes>

      {/* Displays the footer on all pages except Sign In */}
      {!isSignInPage && <Footer />}

    </>
  );  
}

function App() {
  return (

    /* Provides routing functionality for the application */
    <Router>
      <AppContent />
    </Router>

  );
}

/* Exports the App component for use in other files */
export default App;
