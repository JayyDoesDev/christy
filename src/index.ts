import { Context } from "./structures/Context";
import { config } from "dotenv";
import mongoose from "mongoose";
config();
const ctx: Context = new Context();

["Event", "Command", "Interaction"].forEach(async (x) => {
    await require(`./handlers/${x}`).default(ctx);
});

mongoose.connect(process.env.MONGODB, {
    keepAlive: true
});

mongoose.connection.on("connected", () => {
    console.log("Database connected");
});

mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected");
});

ctx.login(process.env.TOKEN)