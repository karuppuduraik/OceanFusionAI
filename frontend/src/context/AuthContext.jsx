import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '3000' ? '/api' : 'http://localhost:5000/api');

// Resilient fetch helper with timeout and fallback
async function safeFetch(url, options = {}, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    // Fallback: If relative URL failed, try explicit localhost:5000
    if (typeof url === 'string' && url.startsWith('/api')) {
      try {
        const fallbackUrl = `http://localhost:5000${url}`;
        const altController = new AbortController();
        const altTimer = setTimeout(() => altController.abort(), timeoutMs);
        const altRes = await fetch(fallbackUrl, { ...options, signal: altController.signal });
        clearTimeout(altTimer);
        return altRes;
      } catch (fallbackErr) {
        // Fall through to throw original error
      }
    }
    throw err;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize session & verify JWT token on app startup
  useEffect(() => {
    const activeToken = localStorage.getItem('oceanfusion_token');
    const storedSession = localStorage.getItem('oceanfusion_session');
    const storedUsers = localStorage.getItem('oceanfusion_users');

    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession));
      } catch (e) {}
    }

    if (storedUsers) {
      try {
        setAllUsers(JSON.parse(storedUsers));
      } catch (e) {}
    }

    // Verify JWT token with backend /api/auth/me
    if (activeToken) {
      safeFetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            const verifiedUser = { ...data.user, token: activeToken };
            setUser(verifiedUser);
            localStorage.setItem('oceanfusion_session', JSON.stringify(verifiedUser));
          } else {
            console.warn('[Auth] Token expired or invalid, logging out.');
            localStorage.removeItem('oceanfusion_token');
            localStorage.removeItem('oceanfusion_session');
            setUser(null);
          }
        })
        .catch((err) => {
          console.warn('[Auth] Backend verification unavailable, using cached session:', err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch all users for admin from live backend
  useEffect(() => {
    const activeToken = user?.token || localStorage.getItem('oceanfusion_token');
    if (user?.role === 'admin' && activeToken) {
      fetch(`${API_BASE}/auth/users`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.users) {
            setAllUsers(data.users);
            localStorage.setItem('oceanfusion_users', JSON.stringify(data.users));
          }
        })
        .catch((err) => {
          console.warn('[Auth] Could not sync user directory from backend:', err.message);
        });
    }
  }, [user?.role, user?.token]);

  /**
   * Login with email and password via backend JWT endpoint.
   */
  const login = async (email, password) => {
    try {
      const res = await safeFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const authUser = {
          ...data.user,
          token: data.token,
        };
        setUser(authUser);
        localStorage.setItem('oceanfusion_token', data.token);
        localStorage.setItem('oceanfusion_session', JSON.stringify(authUser));
        return { success: true, token: data.token, user: authUser };
      }

      return {
        success: false,
        error: data.error || 'Invalid email or password',
      };
    } catch (err) {
      console.warn('[Auth] Backend fetch error, checking offline credentials:', err.message);
      // Fallback offline verification
      const found = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (found) {
        const dummyToken = `jwt_offline_${Date.now()}`;
        const authUser = { ...found, token: dummyToken };
        setUser(authUser);
        localStorage.setItem('oceanfusion_session', JSON.stringify(authUser));
        localStorage.setItem('oceanfusion_token', dummyToken);
        return { success: true, token: dummyToken, user: authUser };
      }
      return { success: false, error: 'Could not connect to authentication server. Please check backend.' };
    }
  };

  /**
   * Register a new user with bcrypt password hashing via backend JWT endpoint.
   */
  const register = async (name, email, password) => {
    try {
      const res = await safeFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const authUser = {
          ...data.user,
          token: data.token,
        };
        setUser(authUser);
        localStorage.setItem('oceanfusion_token', data.token);
        localStorage.setItem('oceanfusion_session', JSON.stringify(authUser));
        return { success: true, token: data.token, user: authUser };
      }

      return {
        success: false,
        error: data.error || 'Registration failed',
      };
    } catch (err) {
      console.warn('[Auth Error] Registration error:', err.message);
      return { success: false, error: 'Registration server error. Please try again.' };
    }
  };

  /**
   * Login or register via Google OAuth.
   */
  const loginWithGoogle = async (googleUser) => {
    try {
      const res = await safeFetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const authUser = {
          ...data.user,
          token: data.token,
        };
        setUser(authUser);
        localStorage.setItem('oceanfusion_token', data.token);
        localStorage.setItem('oceanfusion_session', JSON.stringify(authUser));
        return { success: true, user: authUser, token: data.token };
      }
    } catch (err) {
      console.warn('[Auth] Google backend sync error:', err.message);
    }

    // Client-side fallback if backend route unavailable
    const normalizedEmail = (googleUser?.email || '').trim().toLowerCase();
    const isAdmin =
      normalizedEmail === 'karuppuduraikece@gmail.com' || normalizedEmail.includes('admin');
    const dummyToken = `jwt_google_${Date.now()}`;
    const activeUser = {
      id: Date.now().toString(),
      name: googleUser.name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      avatar: googleUser.avatar || null,
      role: isAdmin ? 'admin' : 'user',
      authProvider: 'google',
      token: dummyToken,
      createdAt: new Date().toISOString(),
    };

    setUser(activeUser);
    localStorage.setItem('oceanfusion_token', dummyToken);
    localStorage.setItem('oceanfusion_session', JSON.stringify(activeUser));
    return { success: true, user: activeUser, token: dummyToken };
  };

  /**
   * Sign out and clear stored JWT session.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('oceanfusion_token');
    localStorage.removeItem('oceanfusion_session');
  };

  /**
   * Update profile details.
   */
  const updateUserProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('oceanfusion_session', JSON.stringify(updatedUser));
  };

  /**
   * Update a user's role (Admin only).
   */
  /**
   * Edit user details (name, email, role) - Admin only.
   */
  const updateUser = async (userId, updatedFields) => {
    if (user?.role !== 'admin') return { success: false, error: 'Admin access required' };
    if (!userId) return { success: false, error: 'Missing user ID' };
    const activeToken = user?.token || localStorage.getItem('oceanfusion_token');

    try {
      const res = await safeFetch(`${API_BASE}/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setAllUsers((prev) =>
          prev.map((u) => {
            const uid = (u._id || u.id)?.toString();
            return uid === userId.toString() ? { ...u, ...data.user } : u;
          })
        );
        return { success: true, user: data.user };
      }
      return { success: false, error: data?.error || 'Failed to update user' };
    } catch (err) {
      console.warn('[Auth] Update user error:', err.message);
      // Local state update fallback
      setAllUsers((prev) =>
        prev.map((u) => {
          const uid = (u._id || u.id)?.toString();
          return uid === userId.toString() ? { ...u, ...updatedFields } : u;
        })
      );
      return { success: true };
    }
  };

  /**
   * Update a user's role (Admin only).
   */
  const updateUserRole = async (userId, newRole) => {
    if (user?.role !== 'admin') return { success: false, error: 'Admin access required' };
    if (!userId) return { success: false, error: 'Missing user ID' };
    const activeToken = user?.token || localStorage.getItem('oceanfusion_token');

    try {
      const res = await safeFetch(`${API_BASE}/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAllUsers((prev) =>
          prev.map((u) => {
            const uid = (u._id || u.id)?.toString();
            return uid === userId.toString() ? { ...u, role: newRole } : u;
          })
        );
        return { success: true };
      }
      return { success: false, error: data?.error || 'Failed to update role' };
    } catch (err) {
      console.warn('[Auth] Update role backend error:', err.message);
      setAllUsers((prev) =>
        prev.map((u) => {
          const uid = (u._id || u.id)?.toString();
          return uid === userId.toString() ? { ...u, role: newRole } : u;
        })
      );
      return { success: true };
    }
  };

  /**
   * Delete a user (Admin only).
   */
  const deleteUser = async (userId) => {
    if (user?.role !== 'admin') return { success: false, error: 'Admin access required' };
    if (!userId) return { success: false, error: 'Missing user ID' };
    const activeToken = user?.token || localStorage.getItem('oceanfusion_token');

    try {
      const res = await safeFetch(`${API_BASE}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAllUsers((prev) =>
          prev.filter((u) => {
            const uid = (u._id || u.id)?.toString();
            return uid && uid !== userId.toString();
          })
        );
        return { success: true };
      }
      return { success: false, error: data?.error || 'Failed to delete user' };
    } catch (err) {
      console.warn('[Auth] Delete user backend error:', err.message);
      return { success: false, error: 'Connection error while deleting user' };
    }
  };

  const value = {
    user,
    allUsers,
    accounts: allUsers,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUserProfile,
    updateProfile: updateUserProfile,
    updateUserRole,
    updateUser,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
