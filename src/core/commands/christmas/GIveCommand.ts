import {
  ChatInputCommandInteraction,
  CommandInteractionOption,
  User,
} from "discord.js";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { GoodieController } from "../../../controllers/GoodieController";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "@antibot/interactions";
import { MessageUtil } from "../../../utils/MessageUtil";
import { randomGoodie } from "../../../utils/Goodie";

export default class GiveCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "give",
      description: "Share your presents and candies with others!",
      interaction: {
        name: "give",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "Share your presents and candies with others!",
        options: [
          {
            name: "goodie",
            type: ApplicationCommandOptionType.STRING,
            description: "Choose present or candy!",
            required: true,
            choices: [
              {
                name: "Present",
                value: "present",
              },
              {
                name: "Candy",
                value: "candy",
              },
            ],
          },
          {
            name: "user",
            type: ApplicationCommandOptionType.USER,
            description: "Choose the user you would like to gift!",
            required: true,
          },
        ],
      },
    });
  }

  async onInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }
    const goodie: string = interaction.options.getString("goodie");
    const user: User = interaction.options.getUser("user");
    if (interaction.user.id == user.id) {
      return interaction.reply({
        content: MessageUtil.Error(MessageUtil.Translate("cmds.give.giveSelf")),
      }) as any;
    } else if (this.ctx.user.id == user.id) {
      return interaction.reply({
        content: MessageUtil.Error(MessageUtil.Translate("cmds.give.giveMe")),
      }) as any;
    } else if (user.bot) {
      return interaction.reply({
        content: MessageUtil.Error(MessageUtil.Translate("cmds.give.giveBot")),
      }) as any;
    }
    if (await GoodieController.findUser(interaction.user.id)) {
      const author = await GoodieController.getUser(interaction.user.id);
      if (await GoodieController.findUser(user.id)) {
        if (goodie == "present") {
          if (author.presentCount <= 0) {
            return interaction.reply({
              content: MessageUtil.Error(
                MessageUtil.Translate("cmds.give.emptyPresent")
              ),
            }) as any;
          }
          await GoodieController.decrementPresent(interaction.user.id);
          await GoodieController.incrementPresent(user.id);
          await interaction.deferReply();
          return interaction.editReply({
            content: MessageUtil.Success(
              MessageUtil.Translate("cmds.give.gave")
                .replace("{randomGoodie}", randomGoodie(goodie))
                .replace("{author}", interaction.user.username)
                .replace("{goodie}", goodie)
                .replace("{user}", user.username)
            ),
          }) as any;
        } else {
          if (author.candyCount <= 0) {
            return interaction.reply({
              content: MessageUtil.Error(
                MessageUtil.Translate("cmds.give.emptyCandy")
              ),
            }) as any;
          }
          await GoodieController.decrementCandy(interaction.user.id);
          await GoodieController.incrementCandy(user.id);
          await interaction.deferReply();
          return interaction.editReply({
            content: MessageUtil.Success(
              MessageUtil.Translate("cmds.give.gave")
                .replace("{randomGoodie}", randomGoodie(goodie))
                .replace("{author}", interaction.user.username)
                .replace("{goodie}", goodie)
                .replace("{user}", user.username)
            ),
          }) as any;
        }
      } else {
        await GoodieController.createUser(user.id);
        if (goodie == "present") {
          if (author.presentCount <= 0) {
            return interaction.reply({
              content: MessageUtil.Error(
                MessageUtil.Translate("cmds.give.emptyPresent")
              ),
            }) as any;
          }
          await GoodieController.decrementPresent(interaction.user.id);
          await GoodieController.incrementPresent(user.id);
          await interaction.deferReply();
          return interaction.editReply({
            content: MessageUtil.Success(
              MessageUtil.Translate("cmds.give.gave")
                .replace("{randomGoodie}", randomGoodie(goodie))
                .replace("{author}", interaction.user.username)
                .replace("{goodie}", goodie)
                .replace("{user}", user.username)
            ),
          }) as any;
        } else {
          if (author.candyCount <= 0) {
            return interaction.reply({
              content: MessageUtil.Error(
                MessageUtil.Translate("cmds.give.emptyCandy")
              ),
            }) as any;
          }
          await GoodieController.decrementCandy(interaction.user.id);
          await GoodieController.incrementCandy(user.id);
          await interaction.deferReply();
          return interaction.editReply({
            content: MessageUtil.Success(
              MessageUtil.Translate("cmds.give.gave")
                .replace("{randomGoodie}", randomGoodie(goodie))
                .replace("{author}", interaction.user.username)
                .replace("{goodie}", goodie)
                .replace("{user}", user.username)
            ),
          }) as any;
        }
      }
    } else {
      await GoodieController.createUser(interaction.user.id);
      await interaction.deferReply();
      return interaction.editReply({
        content: MessageUtil.Error(
          MessageUtil.Translate("cmds.give.emptyInventory")
        ),
      }) as any;
    }
  }
}
