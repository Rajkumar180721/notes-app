import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Notes from './components/Notes/Notes';
import { supabase } from './lib/supabase';
import ForgotPassword from './components/ForgotPassword';

function App() {
  const { user, setUser } = useAuthStore();

  React.useEffect(() => {
    // Set initial user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'PASSWORD_RECOVERY') {
        window.location.href = '/login/forgot-password';
        return;
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login/forgot-password' element={<ForgotPassword />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/notes" /> : <Login />}
        />
        <Route
          path="/notes"
          element={user ? <Notes /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/notes" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;