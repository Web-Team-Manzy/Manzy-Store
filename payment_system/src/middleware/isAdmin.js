const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            EC: 1,
            EM: "You are not authorized to access this resource",
            DT: {},
        });
    }

    next();
};

module.exports = isAdmin;
