import { Interaction } from "discord.js";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { MessageUtil } from "../../../utils/MessageUtil";

export default class AboutCommand extends Command {
  constructor(ctx) {
    super(ctx, {
      name: "about",
      description: "About the bot",
      interaction: {
        name: "about",
        type: 1, // Assuming 1 is CHAT_INPUT, replace with the correct value
        description: "About the bot!",
        options: [],
      },
    });
  }

  async onInteraction(interaction) {
    if (!interaction.isCommand()) {
      return;
    }

    const embed = {
      color: 0x7289DA,
      title: "About the Bot",
      description: "Hello there! I'm Marie, your festive companion, spreading holiday cheer with a touch of magic.\n\n🎄✨ I'm here to infuse your holiday season with joy through a collection of delightful commands.\n\nLet the merriment begin! 🌟",
      footer: {
        text: MessageUtil.Translate("footer")
      },
      thumbnail: {
        url: "https://cdn.discordapp.com/avatars/802438374240550942/7273f5de1650181b4434d7ba3654706f.webp?size=160",
      },
    };

    const components = [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: "Github",
            url: "https://www.github.com/JayyDoesDev/christy",
          },
        ],
      },
    ];

    interaction.reply({ embeds: [embed], components: components });
  }
}
