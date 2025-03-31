import React from 'react';
import AppRoutes from './routes';

import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {

  return (
    <GoogleOAuthProvider clientId="374451070201-ri3jkd7j407o9jqrh69cgofncsvi3mhp.apps.googleusercontent.com">
      <AppRoutes/>
    </GoogleOAuthProvider>

  
  );
}

export default App;