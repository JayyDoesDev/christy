{ Router } = require "@antibot/server"

router = Router()

router.get "/", (req, res) -> 
    res.render "home", cookies : req.cookies, user : req.cookies.avatar, avatar : req.cookies.avatar

exports.default = router