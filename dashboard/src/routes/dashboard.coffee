{ Router } = require "@antibot/server"
UserModel = require "../models/UserModel"
router = Router()

router.get "/dashboard", (req, res) ->
    if req.session.user
        if req.cookies.user and req.cookies.id and req.cookies.avatar
            user = await UserModel.findOne User : req.cookies.id
            if user 
                res.render "dashboard", user : req.cookies.user, avatar :  req.cookies.avatar, data : user
            else
               user = await new UserModel( User : req.cookies.id ).save()
               res.render "dashboard", user : req.cookies.user, avatar :  req.cookies.avatar, data : user
        else
            if req.cookies.user and req.cookies.id and req.cookies.avatar
                user = await UserModel.findOne User : req.cookies.id
                if user
                    res.render "dashboard", user : req.cookies.user, avatar :  req.cookies.avatar, data : user
                else
                    user = await new UserModel( User : req.cookies.id ).save()
                    res.render "dashboard", user : req.cookies.user, avatar :  req.cookies.avatar, data : user
    else
        res.redirect "/login"

exports.default = router