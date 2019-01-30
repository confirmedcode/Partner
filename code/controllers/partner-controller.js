const ConfirmedError = require("shared/error");
const Logger = require("shared/logger");

// Middleware
const authenticate = require("../middleware/authenticate.js");
const { body } = require("express-validator/check");
const validateCheck = require("../middleware/validate-check.js");

// Models
const { PartnerSnapshot } = require("shared/models");
const { Partner } = require("shared/models");

// Routes
const router = require("express").Router();

/*********************************************
 *
 * Partner Page
 *
 *********************************************/

router.get("/partner",
authenticate,
(request, response, next) => {
  var snapshots;
  var current;
  return PartnerSnapshot.getWithCode(request.user.partnerCode)
  .then( result => {
    snapshots = result;
    return request.user.getCurrentSnapshot();
  })
  .then( result => {
    current = result;
    return Partner.getWithCode(request.user.partnerCode);
  })
  .then( partner => {
    return response.render("partner", {
      partner: partner,
      current: current,
      currentJson: JSON.stringify(current),
      snapshots: snapshots,
      snapshotsJson: JSON.stringify(snapshots)
    });
  })
  .catch(error => { next(error); });
});

/*********************************************
 *
 * Change Password
 *
 *********************************************/

router.get("/change-password",
authenticate,
(request, response, next) => {
  response.render("change-password");
});

router.post("/change-password",
[
  authenticate,
  body("currentPassword")
    .exists().withMessage("Missing current password.")
    .not().isEmpty().withMessage("Missing current password.")
    .custom((value, {req, location, path}) => {
      return req.user.assertPassword(value);
    }).withMessage("Current password is incorrect."),
  body("newPassword")
    .exists().withMessage("Missing new password.")
    .not().isEmpty().withMessage("Missing new password.")
    .isLength({ min: 8, max: 50 }).withMessage("New password must be at least 8 characters long."),
  validateCheck
],
(request, response, next) => {
  const currentPassword = request.values.currentPassword;
  const newPassword = request.values.newPassword;
  return request.user.changePassword(currentPassword, newPassword)
    .then( success => {
      request.flashRedirect("success", "Password changed successfully.", "/partner");
    })
    .catch(error => { next(error); });
});

module.exports = router;