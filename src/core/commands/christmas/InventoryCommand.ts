import { Interaction } from "discord.js";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "@antibot/interactions";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { Redis } from "../../../utils/Redis";
import { MessageUtil } from "../../../utils/MessageUtil";
import { goodify } from "../../../utils/goodify";
import { GoodieController } from "../../../controllers/GoodieController";
import { randomGoodie } from "../../../utils/Goodie";

export default class InventoryCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "inventory",
      description: "View your presents and candies collected!",
      interaction: {
        name: "inventory",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "View your presents and candies collected!",
        options: [],
      },
    });
  }

  async onInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }
    await interaction.deferReply();
    if (await GoodieController.findUser(interaction.user.id)) {
      const data = await GoodieController.getUser(interaction.user.id);
      return (await interaction.editReply({
        content: MessageUtil.Success(
          `**${randomGoodie()} Here is your inventory! ${randomGoodie()}**`
        ),
        embeds: [
          {
            title: "Your Inventory",
            color: 1338170,
            thumbnail: {
              url: interaction.user.displayAvatarURL({
                forceStatic: true,
              }),
            },
            description: `${randomGoodie("candy")} **Candies Collected:** ${
              data.candyCount
            }\n${randomGoodie("present")} **Presents Collected:** ${data.presentCount}`,
            footer: {
              icon_url: interaction.channel.guild.iconURL({
                forceStatic: true,
              }),
              text: "Created by the NTTS Staff team, Merry Christmas!",
            },
          },
        ],
      })) as any;
    } else {
      await GoodieController.createUser(interaction.user.id);
      const data = await GoodieController.getUser(interaction.user.id);
      return (await interaction.editReply({
        content: MessageUtil.Success(
          `**${randomGoodie("present")} Here is your inventory! ${randomGoodie("candy")}**`
        ),
        embeds: [
          {
            title: "Your Inventory",
            color: 1338170,
            thumbnail: {
              url: interaction.user.displayAvatarURL({
                forceStatic: true,
              }),
            },
            description: `${randomGoodie()} **Candies Collected:** ${
              data.candyCount
            }\n${randomGoodie()} **Presents Collected:** ${data.presentCount}`,
            footer: {
              icon_url: interaction.channel.guild.iconURL({
                forceStatic: true,
              }),
              text: "Created by the NTTS Staff team, Merry Christmas!",
            },
          },
        ],
      })) as any;
    }
  }
}
