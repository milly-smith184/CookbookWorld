/* Imports the functions needed to render the application */
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';//path to App component
import { AuthProvider } from './context/AuthContext.jsx';

/* Renders the App component inside the root element */
createRoot(document.getElementById('root')).render(

    /* Makes authentication information available throughout the application */
    <AuthProvider>
       <App />
    </AuthProvider>
);

