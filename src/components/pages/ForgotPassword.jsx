/* Imports the files needed for the Forgot Password component */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/forgotpassword.module.css';

function ForgotPassword() {

   /* Handles navigation between application pages */
   const navigate = useNavigate();

   /* Tracks the current password recovery step */
   const [step, setStep] = useState(1);

   /* Stores the user's password recovery information */
    const [resetData, setResetData] = useState({
       email: '',
       securityAnswer: '',
       newPassword: '',
       confirmPassword: ''
    });

   /* Stores the security question retrieved from the backend */
    const [securityQuestion, setSecurityQuestion] = useState('');

   /* Stores the temporary token after the security answer is verified */
   const [resetToken, setResetToken] = useState('');

   /* Tracks whether the email is being checked */
   const [isLoading, setIsLoading] = useState(false);

   /* Stores password recovery error messages */
   const [error, setError] = useState('');

   /* Retrieves the security question linked to the entered email */
   const handleEmailSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            setError('');

            /* Sends the email address to the backend */
            const response = await fetch('/api/auth/forgot-password/security-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: resetData.email
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to find your security question.');
            }

            /* Stores the returned security question */
            setSecurityQuestion(data.securityQuestion);

            /* Moves to the security answer step */
            setStep(2);

        } catch (err) {
            console.error('Password recovery error:', err);
            setError(err.message);

        } finally {
            setIsLoading(false);
        }
    };

    /* Verifies the security answer entered by the user */
    const handleVerifyAnswer = async (event) => {
       event.preventDefault();

       try {
          setIsLoading(true);
          setError('');

          /* Sends the email and security answer to the backend */
          const response = await fetch('/api/auth/forgot-password/verify-answer', {
             method: 'POST',
             credentials: 'include',
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                email: resetData.email,
                securityAnswer: resetData.securityAnswer
             })
          });

          const data = await response.json();

          if (!response.ok) {
             throw new Error(data.message || 'Unable to verify your answer.');
          }

          /* Stores the temporary password reset token */
          setResetToken(data.resetToken);

          /* Moves to the new password step */
          setStep(3);

       } catch (err) {
          console.error('Security answer verification error:', err);
          setError(err.message);

       } finally {
           setIsLoading(false);
       }
    };

    /* Submits the new password to the backend */
    const handlePasswordReset = async (event) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            setError('');

            /* Check whether the passwords match */
            if (resetData.newPassword !== resetData.confirmPassword) {
                throw new Error('The passwords do not match.');
            }

            /* Sends the reset token and new password to the backend */
            const response = await fetch('/api/auth/forgot-password/reset-password', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resetToken,
                    newPassword: resetData.newPassword,
                    confirmPassword: resetData.confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to reset your password.');
            }

            /* Displays a success message and returns the user to login */
            alert(data.message);
            navigate('/SignIn');

        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.message);

        } finally {
            setIsLoading(false);
        }
    };

    return (
       <main className={styles.forgotPasswordPage}>
          <div className={styles.forgotPasswordContainer}>
             <div className={styles.formContainer}>
                <div className={styles.formContent}>

                <div className={styles.formHeader}>
                   <h1>Forgot Password?</h1>
                      <p>Follow the steps to reset your password.</p>
                </div>

                {/* Step 1: Enter registered email address */}
                {step === 1 && (
                   <form onSubmit={handleEmailSubmit}>

                      <div className={styles.input}>
                         <label htmlFor="email">Email Address</label>

                         <input
                            className={styles.input_form}
                            type="email"
                            id="email"
                            name="email"
                            value={resetData.email}
                            onChange={(event) => setResetData({
                              ...resetData,
                              email: event.target.value
                            })}
                            placeholder="Enter your registered email"
                            required
                         />
                      </div>

                      {/* Displays email lookup errors */}
                      {error && (
                         <div className={styles.forgotPasswordError}>
                            {error}
                         </div>
                      )}

                      <div className={styles.createButton}>
                         <button
                            className={styles.buttonStyle}
                            type="submit"
                            disabled={isLoading}
                         >
                            {isLoading ? 'Checking...' : 'Continue'}
                         </button>
                      </div>

                      <div className={styles.createButton}>
                         <button
                            className={styles.buttonStyle}
                            type="button"
                            onClick={() => navigate('/SignIn')}
                         >
                            Back to Login
                         </button>
                      </div>

                   </form>
                )}
                
                {/* Step 2: Answer the security question */}
                {step === 2 && (
                    <form onSubmit={handleVerifyAnswer}>

                        <div className={styles.input}>
                           <label>Security Question</label>

                           <p className={styles.securityQuestion}>{securityQuestion}</p>
                        </div>

                        <div className={styles.input}>
                           <label htmlFor="securityAnswer">
                              Your Answer
                           </label>

                           <input
                              className={styles.input_form}
                              type="text"
                              id="securityAnswer"
                              name="securityAnswer"
                              value={resetData.securityAnswer}
                              onChange={(event) => setResetData({
                                 ...resetData,
                                 securityAnswer: event.target.value
                              })}
                                placeholder="Enter your answer"
                                required
                           />
                        </div>

                        {/* Displays security answer verification errors */}
                        {error && (
                           <div className={styles.forgotPasswordError}>
                              {error}
                           </div>
                        )}

                        <div className={styles.createButton}>
                           <button
                              className={styles.buttonStyle}
                              type="submit"
                              disabled={isLoading}
                           >
                              {isLoading ? 'Verifying...' : 'Verify Answer'}
                           </button>
                        </div>

                        <div className={styles.createButton}>
                           <button
                              className={styles.buttonStyle}
                              type="button"
                              onClick={() => {
                                 setStep(1);
                                 setSecurityQuestion('');
                                 setError('');
                              }}
                           >
                              Back
                           </button>
                        </div>

                    </form>
                )}

                {/* Step 3: Enter a new password */}
                {step === 3 && (
                    <form onSubmit={handlePasswordReset}>
                        
                        <div className={styles.input}>
                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                className={styles.input_form}
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={resetData.newPassword}
                                onChange={(event) => setResetData({
                                    ...resetData,
                                    newPassword: event.target.value
                                })}
                                placeholder="Enter your new password"
                                required
                            />
                        </div>

                        <div className={styles.input}>
                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                className={styles.input_form}
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={resetData.confirmPassword}
                                onChange={(event) => setResetData({
                                    ...resetData,
                                    confirmPassword: event.target.value
                                })}
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>

                        {/* Displays password reset errors */}
                        {error && (
                           <div className={styles.forgotPasswordError}>
                              {error}
                           </div>
                        )}

                        <div className={styles.createButton}>
                           <button
                              className={styles.buttonStyle}
                              type="submit"
                              disabled={isLoading}
                           >
                              {isLoading ? 'Resetting...' : 'Reset Password'}
                           </button>
                        </div>

                    </form>
                )}
                </div>
             </div>
          </div>
       </main>
   );
}

export default ForgotPassword;
