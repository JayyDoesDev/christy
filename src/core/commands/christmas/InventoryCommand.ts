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
          MessageUtil.Translate("cmds.inventory.inventory")
            .replace("{randomPresent}", randomGoodie("present"))
            .replace("{randomCandy}", randomGoodie("candy"))
        ),
        embeds: [
          {
            title: MessageUtil.Translate("cmds.inventory.inventoryTitle"),
            color: 1338170,
            thumbnail: {
              url: interaction.user.displayAvatarURL({
                forceStatic: true,
              }),
            },
            description: MessageUtil.Translate(
              "cmds.inventory.inventoryDescription"
            )
              .replace("{randomCandy}", randomGoodie("candy"))
              .replace("{randomPresent}", randomGoodie("present"))
              .replace("{candyCount}", String(data.candyCount))
              .replace("{presentCount}", String(data.presentCount)),
            footer: {
              icon_url: interaction.channel.guild.iconURL({
                forceStatic: true,
              }),
              text: MessageUtil.Translate("footer"),
            },
          },
        ],
      })) as any;
    } else {
      await GoodieController.createUser(interaction.user.id);
      const data = await GoodieController.getUser(interaction.user.id);
      return (await interaction.editReply({
        content: MessageUtil.Success(
          MessageUtil.Translate("cmds.inventory.inventory")
            .replace("{randomPresent}", randomGoodie("present"))
            .replace("{randomCandy}", randomGoodie("candy"))
        ),
        embeds: [
          {
            title: MessageUtil.Translate("cmds.inventory.inventoryTitle"),
            color: 1338170,
            thumbnail: {
              url: interaction.user.displayAvatarURL({
                forceStatic: true,
              }),
            },
            description: MessageUtil.Translate(
              "cmds.inventory.inventoryDescription"
            )
              .replace("{randomCandy}", randomGoodie("candy"))
              .replace("{randomPresent}", randomGoodie("present"))
              .replace("{candyCount}", String(data.candyCount))
              .replace("{presentCount}", String(data.presentCount)),
            footer: {
              icon_url: interaction.channel.guild.iconURL({
                forceStatic: true,
              }),
              text: MessageUtil.Translate("footer"),
            },
          },
        ],
      })) as any;
    }
  }
}
