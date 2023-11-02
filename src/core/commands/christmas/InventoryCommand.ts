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
          "**<:candy:1165849590415753287> Here is your inventory! <:present:1165862478018773013>**"
        ),
        embeds: [
          {
            title: "Your Inventory",
            color: 1338170,
            thumbnail: {
              url: interaction.user.displayAvatarURL({ forceStatic: true }),
            },
            description: `<:candy:1165849590415753287> **Candies Collected:** ${data.candyCount}\n<:present:1165862478018773013> **Presents Collected:** ${data.presentCount}`,
            footer: {
              icon_url:
                "https://banner2.cleanpng.com/20180417/zae/kisspng-emoji-sticker-text-messaging-christmas-sms-christmas-5ad5ecc8ef0007.160354341523969224979.jpg",
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
          "**<:candy:1165849590415753287> Here is your inventory! <:present:1165862478018773013>**"
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
            description: `<:candy:1165849590415753287> **Candies Collected:** ${data.candyCount}\n<:present:1165862478018773013> **Presents Collected:** ${data.presentCount}`,
            footer: {
              icon_url:
                "https://banner2.cleanpng.com/20180417/zae/kisspng-emoji-sticker-text-messaging-christmas-sms-christmas-5ad5ecc8ef0007.160354341523969224979.jpg",
              text: "Created by the NTTS Staff team, Merry Christmas!",
            },
          },
        ],
      })) as any;
    }
  }
}
