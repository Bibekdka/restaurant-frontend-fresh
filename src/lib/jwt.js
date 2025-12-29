// Decode JWT token to extract user info (without verification)
export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get user role from localStorage token
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return 'user';
  
  const decoded = decodeToken(token);
  return decoded?.role || 'user';
};
