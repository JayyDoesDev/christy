{ Router } = require "@antibot/server"
passport = require "passport"
session = require "express-session"
DiscordStrategy = require("passport-discord").Strategy
UserModel = require "../models/UserModel"

router = Router()

require("../middleware/oauth2")(router)

router.get "/callback", passport.authenticate("discord", failureRedirect : "/login"), (req, res) ->
    req.session.user = user : req.user.username, userid : req.user.id, avatar : "https://cdn.discordapp.com/avatars/#{req.user.id}/#{req.user.avatar}"
    defaultOptions =
            maxAge : 90000
            httpOnly : true
            signed : true
        res.cookie "user", req.session.user.user
        res.cookie "id", req.session.user.userid
        res.cookie "avatar", req.session.user.avatar
        res.redirect "/"

exports.default = router
