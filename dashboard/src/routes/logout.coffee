{ Router } = require "@antibot/server"

router = Router()

router.get "/logout", (req, res) ->
    req.session.destroy()
    res.clearCookie "user"
    res.clearCookie "id"
    res.clearCookie "avatar"
    res.redirect "/"

exports.default = router