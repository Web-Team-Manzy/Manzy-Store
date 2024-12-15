
// GET/
class AuthController {

    home(req, res, next) {
        res.render('home');
    }

}

module.exports = new AuthController();