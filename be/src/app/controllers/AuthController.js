require("dotenv").config();

class AuthController {
    // [POST] /login
    async register(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;

            return res.status(200).json({
                EC: 0,
                EM: "Register successfully",
                DT: { email, firstName, lastName },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: error.message,
                DT: {},
            });
        }
    }
}

module.exports = new AuthController();
