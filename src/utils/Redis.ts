import { Redis as RD } from "ioredis";

export namespace Redis {
  const redis: RD = new RD({
    host: process.env.REDISHOST as string,
    port: process.env.REDISPORT as unknown as number,
  });

  export async function set(
    key: string,
    value: string,
    identifier: string
  ): Promise<void> {
    const formattedKey: string = `${key}:${identifier}`;
    await redis.set(formattedKey, value);
  }

  export async function get(
    key: string,
    identifier: string
  ): Promise<string | any> {
    const formattedKey: string = `${key}:${identifier}`;
    console.log(await redis.get(formattedKey));
    return await redis.get(formattedKey);
  }

  export async function exists(
    key: string,
    identifier: string
  ): Promise<boolean> {
    const formattedKey: string = `${key}:${identifier}`;
    if (await redis.exists(formattedKey)) {
      return true;
    } else {
      return false;
    }
  }

  export async function deleteKey(
    key: string,
    identifier: string
  ): Promise<void> {
    const formattedKey: string = `${key}:${identifier}`;
    await redis.del(formattedKey);
  }
}
