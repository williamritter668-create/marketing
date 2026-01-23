const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized: Please log in." });
};

const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ message: "Forbidden: Admins only." });
};

module.exports = { isAuthenticated, isAdmin };
