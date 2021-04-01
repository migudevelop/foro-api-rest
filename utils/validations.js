const validator = require('validator');

const validateCreateUserParams = ({ name, surname, email, password }) => {
  let validate_name = !validator.isEmpty(name);
  let validate_surname = !validator.isEmpty(surname);
  let validate_email = !validator.isEmpty(email) && validator.isEmail(email);
  let validate_password = !validator.isEmpty(password);
  return validate_name && validate_surname && validate_email && validate_password;
};

const validateUserLoginParams = ({ email, password }) => {
  let validate_email = !validator.isEmpty(email) && validator.isEmail(email);
  let validate_password = !validator.isEmpty(password);
  return validate_email || validate_password;
};

module.exports = { validateCreateUserParams, validateUserLoginParams };
