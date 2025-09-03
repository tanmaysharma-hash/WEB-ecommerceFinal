// backend/utils/validators.js

// Email validation using regex
const isValidEmail = (email) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

// Password strength validation (min 6 characters)
const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

// Non-empty string check
const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Role check: only allow 'Buyer' or 'Seller'
const isValidRole = (role) => {
  return role === 'buyer' || role === 'seller';
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isNonEmptyString,
  isValidRole,
};
