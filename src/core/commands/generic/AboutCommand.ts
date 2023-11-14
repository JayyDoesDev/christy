import { ButtonStyle, ComponentType, Interaction } from "discord.js";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { MessageUtil } from "../../../utils/MessageUtil";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "@antibot/interactions";

export default class AboutCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "about",
      description: "About the bot!",
      interaction: {
        name: "about",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "About the bot!",
        options: [],
      },
    });
  }

  async onInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    interaction.reply({
      embeds: [
        {
          color: 0x7289da,
          title: "About the Bot",
          description: MessageUtil.Translate("cmds.about.aboutDescription"),
          footer: {
            text: MessageUtil.Translate("footer"),
          },
          thumbnail: {
            url: interaction.user.displayAvatarURL(),
          },
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Link,
              label: "Github",
              url: "https://www.github.com/JayyDoesDev/christy",
            },
          ],
        },
      ],
    });
  }
}
