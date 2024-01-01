path = require "path"
{ Server, Router } = require "@antibot/server"
{ config } = require "dotenv"
passport = require "passport"
session = require "express-session"
Strategy = require "passport-discord"
mongoose = require "mongoose"
config()
server = new Server
        port : process.env.port
        settings : 
            routesDirectory : path.join process.cwd(), "js/routes/"
            routesEndpoint : "/"
            useJson : true
            viewEngine : "ejs"
            views : path.join process.cwd(), "public/views"
            viewExt : "ejs"
            debug : true
        cors : 
            origin : "*"
            methods : "GET,HEAD,PUT,PATCH,POST,DELETE"
        helmet :
            contentSecurityPolicy :
                        directives :
                            imgSrc : [ "'self'", "https://media.discordapp.net", "cdn.discordapp.com", "data:", "https://raw.githubusercontent.com" ]
                            styleSrc : [ "'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net" ]
                            scriptSrc : [ "'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net" ]
        ratelimit :
            windowMs : 15 * 60 * 1000
            max : 20
            standardHeaders : true
            legacyHeaders : false

        


mongoose.connection.on "connected", () ->
    console.log "MongoDb connection has been fired."

mongoose.connection.on "disconnecteed", () -> 
    console.log "MongoDB connection has been put out."

mongoose.connection.on "error", (e) -> 
    console.log e

mongoose.connect process.env.mongoDB

server.start()