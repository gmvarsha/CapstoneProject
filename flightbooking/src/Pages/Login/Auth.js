export const isAuthenticated = () => {
    return localStorage.getItem('userId') !== null;
  };
  