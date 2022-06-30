/**
 * Return true if some of the required fields are missing, false otherwise
 */
function check_required_fields(req, required_fields) {
  return required_fields.some((item) => {
    if (!Object.hasOwn(req.body, item)) {
      return true;
    } else {
      return false;
    }
  });
}

module.exports = check_required_fields;
