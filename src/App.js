import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@mui/material';
import { fetchUser } from './utils/fetchUser';
import { theme } from './utils/theme';

import CssBaseline from '@mui/material/CssBaseline';

import Login from './components/Login';
import Home from './container/Home';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();

    if (!user) navigate('/login');
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </CssBaseline>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
