

const access = (roles) => {
    return (req, res, next) => {
      if (roles.includes(req.role)) {
        next();
      } else {
        res.json({ msg: "You are not authorized" });
      }
    };
  };
  
  module.exports = {
    access,
  };