import { Snowflake } from "@antibot/interactions";
import { Redis } from "ioredis";

export namespace Timer {
  const redis: Redis = new Redis({
    host: process.env.REDISHOST as string,
    port: process.env.REDISPORT as unknown as number,
  });

  export async function start(
    userId: Snowflake,
    guildId: Snowflake,
    identifier: string,
    milliseconds: number
  ): Promise<void> {
    let key: string;
    if (identifier) {
      key = `timer:${guildId}:${userId}:${identifier}`;
    } else {
      key = `timer:${guildId}:${userId}`;
    }
    const date: number = Date.now();
    const time: number = date + milliseconds;
    await redis.set(key, time);
    await redis.pexpire(key, time - date);
  }

  export async function exists(
    userId: Snowflake,
    guildId: Snowflake,
    identifier: string
  ): Promise<boolean> {
    let key: string;
    if (identifier) {
      key = `timer:${guildId}:${userId}:${identifier}`;
    } else {
      key = `timer:${guildId}:${userId}`;
    }
    if (await redis.exists(key)) {
      return true;
    } else {
      return false;
    }
  }

  export async function expired(
    userId: Snowflake,
    guildId: Snowflake,
    identifier: string
  ): Promise<boolean> {
    let key: string;
    if (identifier) {
      key = `timer:${guildId}:${userId}:${identifier}`;
    } else {
      key = `timer:${guildId}:${userId}`;
    }
    const getTimer: number = parseInt(await redis.get(key));
    const date: number = Date.now();
    if (getTimer && date >= getTimer) {
      await redis.del(key);
      return true;
    } else {
      return false;
    }
  }

  export async function get(
    userId: Snowflake,
    guildId: Snowflake,
    identifier: string
  ): Promise<string> {
    let key: string;
    if (identifier) {
      key = `timer:${guildId}:${userId}:${identifier}`;
    } else {
      key = `timer:${guildId}:${userId}`;
    }
    return redis.get(key);
  }
}