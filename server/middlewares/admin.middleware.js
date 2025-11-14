const adminCheckmiddleware = async (req, res, next) => {
    try {
        console.log(req.user)
        const adminRole = req.user.isAdmin;
        if (!adminRole) {
            return res.status(403).json({ msg: "Access Denied, User is not Admin" })
        }

        next()
    } catch (error) {
        next(error)
    }
}

export default adminCheckmiddleware