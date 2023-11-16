import { ChatInputCommandInteraction, Interaction, User } from "discord.js";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "@antibot/interactions";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { MessageUtil } from "../../../utils/MessageUtil";
import { GoodieController } from "../../../controllers/GoodieController";

export default class SnowballCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "snowball",
      description: "Snowball a random user!",
      interaction: {
        name: "snowball",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "Snowball a random user!",
        options: [
          {
            name: "user",
            type: ApplicationCommandOptionType.SUB_COMMAND,
            description: "Provide the user you want to snowball!",
            options: [
              {
                name: "user",
                type: ApplicationCommandOptionType.USER,
                description: "Provide the user you want to snowball!",
                required: true,
              },
            ],
          },
          {
            name: "count",
            type: ApplicationCommandOptionType.SUB_COMMAND,
            description: "Check the count of how many people you snowballed!",
          },
        ],
      },
    });
  }

  async onInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }
    const subCommand: string = interaction.options.getSubcommand();
    if (subCommand === "count") {
      const userExists = await GoodieController.findUser(interaction.user.id);
      if (userExists) {
        const user = await GoodieController.getUser(interaction.user.id);
        if (user.snowballCount === 0) {
          await interaction.deferReply();
          return interaction.editReply({
            content: MessageUtil.Success(
              MessageUtil.Translate("cmds.snowball.snowballNever")
            ),
          }) as any;
        }
        await interaction.deferReply();
        return interaction.editReply({
          content: MessageUtil.Success(
            `${
              user.snowballCount === 1
                ? MessageUtil.Translate("cmds.snowball.snowballOnce")
                : MessageUtil.Translate("cmds.snowball.snowballCount").replace(
                    "{snowballCount}",
                    String(user.snowballCount)
                  )
            }`
          ),
        }) as any;
      } else {
        await GoodieController.createUser(interaction.user.id);
        const user = await GoodieController.getUser(interaction.user.id);
        if (user.snowballCount === 0) {
          await interaction.deferReply();
          return interaction.editReply({
            content: MessageUtil.Success(
              MessageUtil.Translate("cmds.snowball.snowballNever")
            ),
          }) as any;
        }
        await interaction.deferReply();
        return interaction.editReply({
          content: MessageUtil.Success(
            `${
              user.snowballCount === 1
                ? MessageUtil.Translate("cmds.snowball.snowballOnce")
                : MessageUtil.Translate("cmds.snowball.snowballCount").replace(
                    "{snowballCount}",
                    String(user.snowballCount)
                  )
            }`
          ),
        }) as any;
      }
    } else {
      await interaction.deferReply();
      const user: User = interaction.options.getUser("user");
      if (user.id === interaction.user.id) {
        interaction.editReply({
          content: MessageUtil.Success(
            MessageUtil.Translate("cmds.snowball.snowballSelf")
          ),
        });
      } else if (user.id === this.ctx.user.id) {
        interaction.editReply({
          content: MessageUtil.Success(
            MessageUtil.Translate("cmds.snowball.snowballMe")
          ),
        });
      } else {
        if (await GoodieController.findUser(interaction.user.id)) {
          await GoodieController.incrementSnowball(interaction.user.id);
        } else {
          await GoodieController.createUser(interaction.user.id);
          await GoodieController.incrementSnowball(interaction.user.id);
        }
        interaction.editReply({
          content: MessageUtil.Success(
            MessageUtil.Translate("cmds.snowball.snowball")
              .replace("{authorName}", interaction.user.username)
              .replace("{mentionedUsername}", user.username)
          ),
        });
      }
    }
  }
}
