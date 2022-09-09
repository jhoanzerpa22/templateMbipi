const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      /*verifySignUp.checkRolesExisted*/
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.put("/api/auth/update-password/:id/:pass_recovery_token", controller.updatePassword);

  let router = require("express").Router();

  //Forgot Password
  router.put('/forgot-password', controller.forgotPassword);

  //Verify Code
  router.put("/verify-code", controller.verifyCode);

  //Change Password
  router.put('/change-password', controller.changePassword);

  app.use('/api/auth', router);

};
