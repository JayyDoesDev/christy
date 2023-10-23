import { Context } from "../structures/Context";
import { Command } from "../structures/Command";
import glob from "glob";
import path from "path";

export default function (ctx: Context): void {
  let commands: string[] = glob.sync("./dist/core/commands/**/**/*.js");
  for (let i: number = 0; i < commands.length; i++) {
    let file: any = require(path.resolve(commands[i]));
    if (file.default) {
      file = new file.default(ctx);
    }

    if (!(file instanceof Command)) {
      return;
    }

    if (file.name) {
      ctx.commands.set(file.name, file);
    }
  }
}
