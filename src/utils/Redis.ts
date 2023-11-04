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

  export async function lock(
    key: string,
    identifier: string
  ): Promise<boolean> {
    const formattedKey: string = `lock:${key}:${identifier}`;
    const lockValue: number = Date.now();
    const setLock = await redis.set(formattedKey, lockValue, "EX", 10000, "NX");
    return setLock === "OK";
  }

  export async function unlock(key: string, identifier: string): Promise<void> {
    const formattedKey: string = `lock:${key}:${identifier}`;
    await redis.del(formattedKey);
  }
}
