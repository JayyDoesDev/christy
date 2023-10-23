import { Channel, Message, TextChannel } from "discord.js";
import { Context } from "../structures/Context";
import { Event } from "../structures/Event";
import glob from "glob";
import path from "path";
import { Timer } from "../utils/Timer";
import { MessageUtil } from "../utils/MessageUtil";

export default function (ctx: Context): void {
  let events: string[] = glob.sync("./dist/core/events/**/**/*.js");
  for (let i: number = 0; i < events.length; i++) {
    let file: any = require(path.resolve(events[i]));
    if (file.default) {
      file = new file.default(ctx);
    }

    if (!(file instanceof Event)) {
      return;
    }

    if (file.name) {
      file.once !== true
        ? ctx.on(file.name, (...args) => file.onEvent(...args))
        : ctx.on(file.name, (...args) => file.onEvent(...args));
    }
  }
  const userId: string = "802438374240550942";
  const guildId: string = "845605014663856158";
  const message: string = MessageUtil.Success(
    "**A wild {item} has spawned! Claim it with `/claim {id}`!**"
  );
  setInterval(async () => {
    const channel: Channel | any = ctx.channels.cache.get("984197100021624852");
    const timers: number[] = [20000]; //[3600000, 7200000, 10800000];
    if (await Timer.exists(userId, guildId, "candy")) {
      console.log("Timer does exist");
      if (await Timer.expired(userId, guildId, "candy")) {
        console.log("Timer is expired");
        channel.send({
          content: message,
        });
        return await Timer.start(
          userId,
          guildId,
          "candy",
          timers[Math.floor(Math.random() * timers.length)]
        );
      } else {
        console.log("Timer is NOT expired");
        return;
      }
    } else {
      console.log("Timer doesn't exist");
      channel.send({
        content: message,
      });
      return await Timer.start(
        userId,
        guildId,
        "candy",
        timers[Math.floor(Math.random() * timers.length)]
      );
    }
  }, 10000);
}
