/* Imports the files needed for the navigation bar component */
import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Button } from './Button';
import { useAuth } from '../context/useAuth';
import '../css/Navbar.css';

function Navbar() {
	/* Controls the mobile navigation menu */	
	const [click, setClick] = useState(false);

	/* Controls whether the user dropdown menu is displayed */
	const [showUserMenu, setShowUserMenu] = useState(false);

	/*Controls whether the Sign In button appears.*/
	const [button, setButton] = useState(true);

	/* Accesses the shared authentication information */
    const { user, loading, logout } = useAuth();

    /* Handles navigation after logout */
    const navigate = useNavigate();

	/* Changes the menu icon when clicked */
	const handleClick = () => setClick(!click);

	/* Hides the mobile menu */
	const closeMobileMenu = () => setClick(false);

	/* Logs out the current user */
    const handleLogout = async () => {
       try {
          await logout();

          /* Closes the menu and redirects to the home page */
          closeMobileMenu();
          navigate('/');

       } catch (error) {
          console.error('Logout error:', error);
       }
    };

	/* Shows the button only on screens wider than 960 pixels. */
	const showButton = () => {
		if (window.innerWidth <= 960) {
		  setButton(false);
		} else {
		  setButton(true);
		}
	};

	/* Calls showButton when the component is initially rendered */
	useEffect(() => {
		showButton();

		/* Updates the Sign In button when the screen size changes. */
		window.addEventListener('resize', showButton);

		return () => {
        window.removeEventListener('resize', showButton);
        };
	}, []);


	return (
	   <>
	      <nav className="navbar"> 
	         {/* Main navigation bar */}
		     <div className="navbar-container">

			    {/* Logo link that takes users back to the home page */}
                <div className="navbar-logo-container">
                   <Link
                      to="/"
                      className="navbar-logo"
                      onClick={closeMobileMenu}
                   >
                      {/* Displays the company logo */}
                      <img
                         src={logo}
                         alt="Company Logo"
                         className="nav-logo"
                      />
				   </Link>
				</div>

				{/* Mobile menu icon */}
                <div className="menu-icon" onClick={handleClick}>
				   {/* Shows a close icon when clicked; otherwise shows a menu (hamburger) icon */}
				   <i className={click ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
				</div>
					
				{/* Displays navigation links and opens the mobile menu when active */}
				<ul className={
			       click 
			          ? "nav-menu active" 
			          : user
                         ? "nav-menu authenticated"
                         : " nav-menu"
                }>
			       
				   {/* Home link */}
				   <li className="nav-item">
				      <Link to="/" className="nav-links" onClick={closeMobileMenu}>
					     Home
				   	  </Link>
				   </li>

				   {/* About Us link */}
				   <li className="nav-item">
				      <Link to="/AboutUs" className="nav-links" onClick={closeMobileMenu}>
					     About Us
					  </Link>
				   </li>

				   {/* Find Recipes link */}
				   <li className="nav-item">
				      <Link to="/FindRecipes" className="nav-links" onClick={closeMobileMenu}>
					     Find Recipes
					  </Link>
				   </li>

				   {/* Displays account options when a user is logged in */}
                   {!loading && user && (
                      <>
                          {/* User profile link */}
                           <li className="nav-item">
                             <Link to="/UserProfile" className="nav-links" onClick={closeMobileMenu}>
                                My Profile
                             </Link>
                          </li>

                          {/* Favourites link */}
                          <li className="nav-item">
                             <Link to="/Favourites" className="nav-links" onClick={closeMobileMenu}>
                                Favourites
                             </Link>
                          </li>

                          {/* Logout button */}
                          <li className="nav-item nav-logout-mobile">
                             <button
                                type="button"
                                className="nav-links nav-logout"
                                onClick={handleLogout}
                             >
                             <i className="fa-solid fa-right-from-bracket"></i>
                                Logout
                             </button>
                          </li>
                      </>
                   )}

                         {/* Displays Sign In inside the mobile menu when logged out */}
                         {!loading && !user && (
                            <li className="nav-item">
                               <Link to="/SignIn" className="nav-links-mobile" onClick={closeMobileMenu}>
                                  Sign In
                               </Link>
                            </li>
                         )}

                    </ul>

                    {/* Displays the user's name when logged in */}
                    {!loading && user && (
                       <div className="nav-user-container">

                          <button
                             type="button"
                             className="nav-user-name"
                             onClick={() => setShowUserMenu(!showUserMenu)}
                          >
                             <i className="fa-solid fa-circle-user"></i>
                                Hi, {user.first_name}
                          </button>

                          {/* Displays the logout dropdown when a user is logged in and the menu is open */}
                          {showUserMenu && (
                             <div className="nav-user-dropdown">
                                <button type="button" onClick={handleLogout}>
                                   <i className="fa-solid fa-right-from-bracket"></i>
                                   Logout
                                </button>
                             </div>
                          )}
                       </div>
                    )}

                    {/* Displays the original outlined Sign In button when logged out */}
                    {!loading && !user && button && (
                       <Button to='/SignIn' buttonStyle='btn--outline'>
                          SIGN IN
                       </Button>
                    )}

                </div>
            </nav>
        </>
    );
}

/* Exports the Navbar component for use in other files */
export default Navbar;