{ Router }  = require "@antibot/server"
router = Router()
passport = require "passport"


router.get "/login", passport.authenticate "discord"

exports.default = router