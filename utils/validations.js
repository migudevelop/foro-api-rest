const validator = require('validator');

const validateCreateUserParams = ({ name, surname, email, password }) => {
  try {
    let validate_name = !validator.isEmpty(name);
    let validate_surname = !validator.isEmpty(surname);
    let validate_email = !validator.isEmpty(email) && validator.isEmail(email);
    let validate_password = !validator.isEmpty(password);
    return validate_name && validate_surname && validate_email && validate_password;
  } catch (error) {
    return false;
  }
};

const validateUpdateUserParams = ({ name, surname, email }) => {
  try {
    let validate_name = !validator.isEmpty(name);
    let validate_surname = !validator.isEmpty(surname);
    let validate_email = !validator.isEmpty(email) && validator.isEmail(email);
    return validate_name && validate_surname && validate_email;
  } catch (error) {
    return false;
  }
};

const validateUserLoginParams = ({ email, password }) => {
  try {
    let validate_email = !validator.isEmpty(email) && validator.isEmail(email);
    let validate_password = !validator.isEmpty(password);
    return validate_email || validate_password;
  } catch (error) {
    return false;
  }
};

module.exports = { validateCreateUserParams, validateUserLoginParams, validateUpdateUserParams };
