import { Event } from "../../../structures/Event";
import { Context } from "../../../structures/Context";
import { ActivityType } from "discord.js";

export default class ReadyEvent extends Event {
  constructor(ctx: Context) {
    super(ctx, {
      name: "ready",
      once: true,
    });
  }
  async onEvent(...event: any): Promise<void> {
    console.log(`Now logged into ${this.ctx.user.username}`);
    this.ctx.user.setActivity({
      name: "Christmas movies ",
      type: ActivityType.Watching,
    });
  }
}
