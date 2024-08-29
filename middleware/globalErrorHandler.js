module.exports = (error, req, res, next) => {
  console.log(error);
  return res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
