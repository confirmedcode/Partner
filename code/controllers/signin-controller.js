const ConfirmedError = require("shared/error");
const Logger = require("shared/logger");

// Middleware
const { body, query, check, oneOf } = require("express-validator/check");
const validateCheck = require("../middleware/validate-check.js");

// Utilities
const { Email } = require("shared/utilities");

// Models
const { PartnerUser } = require("shared/models");

const DOMAIN = process.env.DOMAIN;

// Routes
const router = require("express").Router();

/*********************************************
 *
 * Sign In Page
 *
 *********************************************/

router.get("/signin",
[
  query("redirecturi")
    .trim(),
  validateCheck
],
(request, response, next) => {  
  const redirecturi = request.values.redirecturi;
  response.render("signin", {
    redirecturi: redirecturi
  });
});

router.post("/signin",
[ 
  // Email/Password in POST
  body("email")
    .exists().withMessage("Missing email address.")
    .isEmail().withMessage("Invalid email address.")
    .normalizeEmail(),
  body("password")
    .exists().withMessage("Missing password.")
    .not().isEmpty().withMessage("Missing password."),
  check("redirecturi"),
  validateCheck
],
(request, response, next) => {
  const email = request.values.email;
  const password = request.values.password;
  const redirecturi = request.values.redirecturi || "/partner";
  return PartnerUser.getWithEmailAndPassword(email, password)
    .then( user => {
      request.session.regenerate(error => {
        if (error) {
          throw new ConfirmedError(500, 2, "Couldn't regenerate session", error);
        }
        request.session.userEmail = user.email;
        request.session.save(error => {
          if (error) {
            throw new ConfirmedError(500, 2, "Couldn't save session", error);
          }
          return response.redirect(redirecturi);
        });
      });
    })
    .catch( error => { next(error); });
});

/*********************************************
 *
 * Log Out
 *
 *********************************************/

router.get("/logout",
(request, response, next) => {
  if (request.session) {
    request.session.destroy(error => {
      if (error) {
        // Deleting an invalid session is not a throwing error
        Logger.error("Couldn't delete session: " + error.stack);
      }
      return response.redirect("/signin");
    });
  }
  else {
    response.redirect("/signin");
  }
});

module.exports = router;