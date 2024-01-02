{ Router } = require "@antibot/server"
UserModel = require "../models/UserModel"
router = Router()

router.get "/leaderboard", (req, res) ->
    collection = await UserModel.db.collection "users"
    documents = await collection.find({}).toArray()
    sorttedDocuments = documents.sort (a, b) -> a.presentCount + a.candyCount - (b.presentCount + b.candyCount)
    console.log sorttedDocuments
    res.render "leaderboard", cookies : req.cookies, user : req.cookies.avatar, avatar : req.cookies.avatar, leaderboard : sorttedDocuments

exports.default = router