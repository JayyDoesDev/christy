import { Interaction, Message } from "discord.js";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "@antibot/interactions";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";

export default class PingCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "ping",
      description: "Sends you pong back",
      interaction: {
        name: "ping",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "Sends you pong back!",
        options: [],
      },
    });
  }

  async onInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    interaction.reply({ content: "Pong 🏓" });
  }
}
