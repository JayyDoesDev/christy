import { Context } from "../structures/Context";
import { Command } from "../structures/Command";
import glob from "glob";
import path from "path";
import { ZillaCollection } from "@antibot/zilla";

export default async function (ctx: Context): Promise<void> {
  const collection: ZillaCollection<string, Command> = ctx.commands;

  for (const [key, value] of collection) {
    const array: Command[] = [];
    array.push(value);
    if (Array.isArray(array)) {
      array.forEach((x) => {
        ctx.interactions.set(x.interaction.name, x);
      });
    } else if (value instanceof Command) {
      ctx.interactions.set(value.interaction.name, value);
    }
  }
  ctx.interactions.forEach(async (x) => {
    await ctx.interact.createGuildCommand(process.env.GUILDID, x.interaction);
  });
}
