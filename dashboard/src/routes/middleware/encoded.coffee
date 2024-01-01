{ Router } = require "@antibot/server"
express = require "express"
router = Router()

router.use express.urlencoded { extended: true }

exports.default = router