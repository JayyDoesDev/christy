import { Event } from "../../../structures/Event";
import { Context } from "../../../structures/Context";
import { ActivityType } from "discord.js";
import { MessageUtil } from "../../../utils/MessageUtil";

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
      name: MessageUtil.Translate("botStatus"),
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/Discord",
    });
  }
}
