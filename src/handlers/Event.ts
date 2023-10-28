import { Channel, Message, TextChannel } from "discord.js";
import { Context } from "../structures/Context";
import { Event } from "../structures/Event";
import glob from "glob";
import path from "path";
import { Timer } from "../utils/Timer";
import { MessageUtil } from "../utils/MessageUtil";
import { nanoid } from "nanoid";
import { Redis } from "../utils/Redis";
import { goodify } from "../utils/goodify";

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
  const userId: string = process.env.BOTID;
  const guildId: string = process.env.GUILDID;
  const redisTimerIdentifier: string = "candy";
  const redisKey: string = "christy";
  const redisIdentifier: string = "code";
  setInterval(async () => {
    const goodies: string[] = ["present", "candy"];
    const goodie = goodies[Math.floor(Math.random() * goodies.length)];
    const redisValue: string = `${nanoid(7)}:${goodie}`;
    const channel: Channel | any = ctx.channels.cache.get(
      process.env.DROPCHANNEL
    );
    const timers: number[] = [3600000, 7200000, 10800000]; //[3600000, 7200000, 10800000];
    if (await Timer.exists(userId, guildId, redisTimerIdentifier)) {
      console.log("Timer does exist");
      if (await Timer.expired(userId, guildId, redisTimerIdentifier)) {
        Redis.set(redisKey, redisKey, redisIdentifier);
        const getRedisValue: string = await Redis.get(
          redisKey,
          redisIdentifier
        );
        const getRedisClaimID: string = getRedisValue.slice(0, 7);
        channel.send({
          content: MessageUtil.Success(
            `**A wild ${goodify(
              goodie
            )} has spawned! Claim it with \`/claim ${getRedisClaimID}\`!**`
          ),
        });
        console.log(await Redis.get(redisKey, redisIdentifier));
        return await Timer.start(
          userId,
          guildId,
          redisTimerIdentifier,
          timers[Math.floor(Math.random() * timers.length)]
        );
      } else {
        console.log("Timer is NOT expired");
        return;
      }
    } else {
      Redis.set(redisKey, redisValue, redisIdentifier);
      const getRedisValue: string = await Redis.get(redisKey, redisIdentifier);
      const getRedisClaimID: string = getRedisValue.slice(0, 7);
      channel.send({
        content: MessageUtil.Success(
          `**A wild ${goodify(
            goodie
          )} has spawned! Claim it with \`/claim ${getRedisClaimID}\`!**`
        ),
      });
      return await Timer.start(
        userId,
        guildId,
        redisTimerIdentifier,
        timers[Math.floor(Math.random() * timers.length)]
      );
    }
  }, 10000);
}
