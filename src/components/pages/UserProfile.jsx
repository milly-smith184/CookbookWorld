/* Imports the files needed for the User Profile component */
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import '../../css/UserProfile.css';

function UserProfile() {

    /* Retrieves the logged-in user's authentication information */
    const { user, setUser, loading } = useContext(AuthContext);

    /* Stores the user's profile information */
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        created_at: ''
    });

    /* Controls whether the profile is being edited */
    const [isEditing, setIsEditing] = useState(false);

    /* Tracks profile loading and saving */
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    /* Stores success and error messages */
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    /* Backend API address */
    const API_URL = 'http://192.168.0.18:5001/api/auth/profile';

    /* Retrieves the user's profile from the backend */
    useEffect(() => {

        if (loading) return;

        if (!user) {
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await fetch(API_URL, {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load profile.');
                }

                setProfile(data.user);

            } catch (err) {
                console.error('Profile loading error:', err);
                setError(err.message);

            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();

    }, [user, loading]);

    /* Updates the profile form when a field changes */
    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    /* Enables profile editing */
    const handleEdit = () => {
        setMessage('');
        setError('');
        setIsEditing(true);
    };

    /* Cancels editing and restores the saved information */
    const handleCancel = async () => {
        setIsEditing(false);
        setMessage('');
        setError('');

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to reload profile.');
            }

            setProfile(data.user);

        } catch (err) {
            setError(err.message);
        }
    };

    /* Saves the updated profile information */
    const handleSave = async (event) => {
        event.preventDefault();

        try {
            setIsSaving(true);
            setMessage('');
            setError('');

            const response = await fetch(API_URL, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                    contact_number: profile.contact_number
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to update profile.');
            }

            /* Updates the displayed profile information */
            setProfile(data.user);

            /* Updates the global authentication context */
            setUser(prevUser => ({
                ...prevUser,
                ...data.user
            }));

            setIsEditing(false);
            setMessage('Your profile has been updated successfully!');

        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.message);

        } finally {
            setIsSaving(false);
        }
    };

    /* Displays a loading message while checking authentication */
    if (loading || isLoading) {
       return (
          <main className="user-profile-page">
             <div className="profile-loading">
                Loading your profile...
             </div>
          </main>
       );
    }

    /* Displays a message when the user is not logged in */
    if (!user) {
       return (
          <main className="user-profile-page">
             <div className="profile-container">
                <div className="profile-notice">
                   Please sign in to view your account.
                </div>
             </div>
          </main>
       );
    }

    /* Displays the user profile */
    return (
       <main className="user-profile-page">

          <div className="profile-container">

             {/* Profile heading */}
             <div className="profile-heading">
                <h1>My Account</h1>
             </div>

             {/* Profile information card */}
             <section className="profile-card">

                {/* Profile header */}
                <div className="profile-header">

                   <div className="profile-avatar">
                      <i className="fa-solid fa-user"></i>
                   </div>

                   <div className="profile-header-info">
                      <h2>
                         {profile.first_name} {profile.last_name}
                      </h2>

                      <p>{profile.email}</p>

                      <span className="profile-status">
                         <i className="fa-solid fa-circle-check"></i>
                         Active Account
                      </span>
                   </div>

                   {!isEditing && (
                      <button
                         type="button"
                         className="profile-edit-btn"
                         onClick={handleEdit}
                      >
                         <i className="fa-solid fa-pen"></i>
                         Edit Profile
                      </button>
                   )}

                </div>

                {/* Profile messages */}
                {message && (
                   <div className="profile-success">
                      <i className="fa-solid fa-circle-check"></i>
                      {message}
                   </div>
                )}

                {error && (
                   <div className="profile-error">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      {error}
                   </div>
                )}

                {/* Personal information form */}
                 <form className="profile-form" onSubmit={handleSave}>

                    <div className="profile-section-heading">
                       <h3>Personal Information</h3>
                       <p>Your personal and contact details.</p>
                    </div>

                    <div className="profile-form-grid">

                       {/* First name */}
                       <div className="profile-field">
                          <label htmlFor="first_name">
                             First Name
                          </label>

                          <input
                             type="text"
                             id="first_name"
                             name="first_name"
                             value={profile.first_name}
                             onChange={handleChange}
                             disabled={!isEditing || isSaving}
                             required
                             maxLength={60}
                          />
                       </div>

                       {/* Last name */}
                       <div className="profile-field">
                          <label htmlFor="last_name">
                             Last Name
                          </label>

                          <input
                             type="text"
                             id="last_name"
                             name="last_name"
                             value={profile.last_name}
                             onChange={handleChange}
                             disabled={!isEditing || isSaving}
                             required
                             maxLength={60}
                          />
                       </div>

                       {/* Email */}
                       <div className="profile-field">
                          <label htmlFor="email">
                             Email Address
                          </label>

                          <input
                             type="email"
                             id="email"
                             name="email"
                             value={profile.email}
                             onChange={handleChange}
                             disabled={!isEditing || isSaving}
                             required
                             maxLength={254}
                          />
                       </div>

                       {/* Contact number */}
                       <div className="profile-field">
                          <label htmlFor="contact_number">
                             Contact Number
                          </label>

                          <input
                             type="tel"
                             id="contact_number"
                             name="contact_number"
                             value={profile.contact_number || ''}
                             onChange={handleChange}
                             disabled={!isEditing || isSaving}
                             placeholder="Enter your contact number"
                             maxLength={20}
                          />
                       </div>

                    </div>

                    {/* Account information */}
                    <div className="profile-account-info">

                       <h3>Account Information</h3>

                       <div className="profile-account-row">
                          <span>Member Since</span>
                          <span>
                             {profile.created_at
                                ? new Date(profile.created_at).toLocaleDateString()
                                : 'Not available'}
                           </span>
                       </div>

                    </div>

                    {/* Edit mode buttons */}
                    {isEditing && (
                       <div className="profile-actions">

                          <button
                             type="button"
                             className="profile-cancel-btn"
                             onClick={handleCancel}
                             disabled={isSaving}
                          >
                             Cancel
                          </button>

                          <button
                             type="submit"
                             className="profile-save-btn"
                             disabled={isSaving}
                          >
                             {isSaving ? (
                                'Saving...'
                             ) : (
                                 <>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    Save Changes
                                 </>
                                )}
                          </button>

                       </div>
                    )}

                 </form>

             </section>

          </div>

       </main>
    );
}

export default UserProfile;
