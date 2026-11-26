/* Imports the files needed for the signIn component */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import logo from '../../assets/logo.png';
import styles from "../../css/signin.module.css";

function SignIn(){

	/* Controls the sliding cover panel */
   const [isActive, setIsActive] = useState(false);

   /* Retrieves the current URL location, including the pathname and query parameters */
   const location = useLocation();

   /* Handles navigation after successful authentication */
   const navigate = useNavigate();

   /* Accesses the shared authentication state */
   const { refreshUser } = useAuth();

   /* Stores registration form input values */
   const [registerData, setRegisterData] = useState({
      name: '',
      email: '',
      password: '',
      securityQuestion: '',
      securityAnswer: ''
   });

   /* Stores login form input values */
   const [loginData, setLoginData] = useState({
      email: '',
      password: ''
   });

   /* Controls authentication messages and button loading state */
   const [message, setMessage] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   /* Tracks whether the user wants to remain signed in */
   const [rememberMe, setRememberMe] = useState(false);

   /* Updates registration form data whenever an input changes */
   const handleRegisterChange = (e) => {
      setRegisterData({
         ...registerData,
         [e.target.name]: e.target.value
      });
   };

   /* Updates login form data whenever an input changes */
   const handleLoginChange = (e) => {
      setLoginData({
         ...loginData,
         [e.target.name]: e.target.value
      });
   };

   /*---Register User---*/
   const handleRegister = async (e) => {
      e.preventDefault();

   /* Splits the entered name into individual parts */
   const nameParts = registerData.name.trim().split(/\s+/);

   /* Ensures the user enters both first name and last name */
	if (nameParts.length < 2) {
      setMessage('Please enter both your first and last name.');
      return;
   }

   	/* Clears previous messages and activates the loading state */
      setMessage('');
      setIsLoading(true);

      try {
      	/* Sends registration details to the backend API */
         const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
               credentials: 'include',
               body: JSON.stringify(registerData)
            });

         	/* Converts the server response into JSON */
            const data = await response.json();

            /* Displays an error if registration was unsuccessful */
            if (!response.ok) {
               throw new Error(data.message || 'Registration failed.');
            }

            /* Displays a success message */
            setMessage('Account created successfully!');

            /* Updates the shared authentication state */
            await refreshUser();

            /* Clears the registration form fields */
            setRegisterData({
               name: '',
               email: '',
               password: '',
               securityQuestion: '',
               securityAnswer: ''
            });

            const returnState = location.state?.returnState;

            /* Redirects the user to the home page or the recipe they originally selected */
				navigate(
  				   location.state?.returnTo || '/',
  				   {
    				   replace: true,
    				   state: returnState
  					}
				);

        } catch (error) {
             /* Displays any errors returned by the server */
             setMessage(error.message);
        } finally {
        		 /* Stops the loading state regardless of the outcome */
             setIsLoading(false);
        }
   };

   /*---Login User---*/
   const handleLogin = async (e) => {
      e.preventDefault();

      /* Clears previous messages and activates the loading state */
      setMessage('');
      setIsLoading(true);

         try {
         	/* Sends login credentials to the backend API */
            const response = await fetch('/api/auth/login', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               credentials: 'include',
               /* Sends the login details and Remember me preference */
               body: JSON.stringify({
                  ...loginData,
                  rememberMe
               })
            });

            /* Converts the server response into JSON */
            const data = await response.json();

            /* Displays an error if login was unsuccessful */
            if (!response.ok) {
               throw new Error(data.message || 'Login failed.');
            }

            /* Displays a success message */
            setMessage('Login successful!');

            /* Updates the shared authentication state */
            await refreshUser();

            /* Clear the login form fields */
            setLoginData({
               email: '',
               password: ''
            });

             /* Redirects the user to the home page or the recipe they originally selected */
				navigate(
  				   location.state?.returnTo || '/',
  				   {
    				   replace: true,
    				   state: location.state?.returnState
  					}
				);

         } catch (error) {
         	  /* Displays any errors returned by the server */
              setMessage(error.message);
         } finally {
         	  /* Stops the loading state regardless of the outcome */
              setIsLoading(false);
         }
      };

	return(
		<div className={styles.signInContainer}>

      {/* CookbookWorld Logo */}
      <div className={styles.logoContainer}>
         <img 
            src={logo} 
            alt="CookbookWorld Logo" 
            className={styles.logo}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
         />
      </div>

      <div className={`${styles.signInContent} ${isActive ? styles.active : ""}`}>
		      
		   {/*----Registration Form----*/}
		   <div className={styles.formContainer}>
		      <form onSubmit={handleRegister}>

		   	   <div className={styles.formHeader}>
		   	      <h1>Create Account</h1>
		   	   </div>

		   	   {/* User's first and last name */}
		   	   <div className={styles.input}>
		   	      <input
                     className={styles.input_form}
                     type="text"
                     name="name"
                     placeholder="First and Last Name"
                     value={registerData.name}
                     onChange={handleRegisterChange}
                     required
                  />
		   	   </div>

		   	   {/* User's email address */}
		   	   <div className={styles.input}>
		   	     	<input
                     className={styles.input_form}
                     type="email"
                     name="email"
                     placeholder="Email"
                     value={registerData.email}
                     onChange={handleRegisterChange}
                     required
                  />
		   	   </div>
		   	   
               {/* Security question selected by the user */}
               <div className={styles.input}>
                  <select
                     className={styles.input_form}
                     name="securityQuestion"
                     value={registerData.securityQuestion}
                     onChange={handleRegisterChange}
                     required
                  >
                     <option value="">Select a Security Question</option>
                     <option value="What was the name of your first school?">
                        What was the name of your first school?
                     </option>
                     <option value="What was the name of your first pet?">
                        What was the name of your first pet?
                     </option>
                     <option value="What city were you born in?">
                        What city were you born in?
                     </option>
                     <option value="What was your childhood nickname?">
                        What was your childhood nickname?
                     </option>
                  </select>
               </div>

               {/* Security answer entered by the user */}
               <div className={styles.input}>
                  <input
                     className={styles.input_form}
                     type="text"
                     name="securityAnswer"
                     placeholder="Security Answer"
                     value={registerData.securityAnswer}
                     onChange={handleRegisterChange}
                     required
                  />
               </div>

		   	   {/* User's password (minimum 8 characters) */}
		   	   <div className={styles.input}>
		   	      <input
                     className={styles.input_form}
                     type="password"
                     name="password"
                     placeholder="Password"
                     value={registerData.password}
                     onChange={handleRegisterChange}
                     minLength="8"
                     required
                  />
		   	   </div>
		   	   
		   	   {/* Registration button; disabled while processing */}
		   	   <div className={styles.createButton}>
		   	      <button
                     className={styles.buttonStyle}
                     type="submit"
                     disabled={isLoading}
                  >
                     {isLoading ? 'Please wait...' : 'Register'}
		   	   	</button>
		   	   </div>
		      </form>
		   </div>

		   {/*----Login Form----*/}
		   <div className={styles.loginContainer}>
		   	<form onSubmit={handleLogin}>

		   	   <div className={styles.formHeader}>
		   	  		<h1>Sign In</h1>
		   	   </div>
		   	   
		   	   {/* User's registered email address */}  	
		   	   <div className={styles.input}>
		   	     	<input
                     className={styles.input_form}
                     type="email"
                     name="email"
                     placeholder="Email"
                     value={loginData.email}
                     onChange={handleLoginChange}
                     required
                  />
               </div>

		   	   {/* User's account password */}
		   	   <div className={styles.input}>
		   	     	<input
                     className={styles.input_form}
                     type="password"
                     name="password"
                     placeholder="Password"
                     value={loginData.password}
                     onChange={handleLoginChange}
                     required
                  />
		        	</div>

		   	   <div className={styles.inputLogin}>
		   	   	{/* Remember me checkbox */}
		   	     	<div className={styles.formCheck}>
		   	     		<input 
		   	     			className={styles.formCheckInput} 
		   	     			type="checkbox"
		   	  				id="formcheck"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
		   	     		/>
		   	     		
		   	     		<label 
		   	     			className={styles.formCheckLabel} 
		   	     			htmlFor="formcheck"
		   	     		>
		   	     			<small>Remember me</small>
                     </label>
		   	     	</div>

		   	     	{/* Forgot password link */}
		   	     	<div className={styles.forgot}>
		   	     		<small>
		   	     			<a
                           href="/forgot-password"
                           onClick={(event) => {
                              event.preventDefault();
                              navigate('/forgot-password');
                           }}
                        >
                           Forgot Password?
                        </a>
		   	     		</small>
		   	     	</div>
		   	   </div>
		   	   
		   	   {/* Login button; disabled while processing */}
		   	   <div className={styles.createButton}>
		   	     	<button 
		   	     		className={styles.buttonStyle} 
		   	     		type="submit"
		   	     		disabled={isLoading}
		   	     	>
		   	     		{isLoading ? 'Please wait...' : 'Login'}
		   	      </button>
		   	   </div>
		   	</form>
		   </div>

		   {/*----Switch Panel----*/}
		   <div className={styles.switchContent}>
  		      <div className={styles.switch}>

  		      	{/* Panel displayed alongside the registration form */}
   			   <div className={`${styles.switchPanel} ${styles.switchLeft}`}>
                  <h1>Hello, Again</h1>
                  <p>We are happy to see you back</p>
                 
                 {/* Switches to the login panel */}
                  <button 
                 	   type="button"
                     className={styles.switchDetailsLeft}
                     onClick={() => setIsActive(false)}
                  >
                     Login
                  </button>
               </div>

               {/* Panel displayed alongside the login form */}
               <div className={`${styles.switchPanel} ${styles.switchRight}`}>
                  <h1>Welcome</h1>
                  <p>Join Our Platform, Explore a New Experience</p>
               
               	{/* Switches to the registration panel */}
                  <button 
                     type="button"
                     className={styles.switchDetailsRight}
                     onClick={() => setIsActive(true)}
                  >
                     Register
                  </button>
               </div>

            </div>
         </div>

		</div>
		
		{/* Authentication messages */}
      {message && (
         <p role="alert" aria-live="polite">
            {message}
         </p>
      )}

		</div>
	);
}

export default SignIn;