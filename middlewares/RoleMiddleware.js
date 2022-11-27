module.exports.role = (role = []) => {
  return async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(406).json({
        message: 'Anda tidak memiliki akses'
      });
    }
    next();
  }
}