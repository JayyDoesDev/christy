import { APIUser, Interaction, User } from "discord.js";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  Snowflake,
} from "@antibot/interactions";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { MessageUtil } from "../../../utils/MessageUtil";
import goodies from "../../../../data/goodies.json";
import UserModel from "../../../controllers/models/UserModel";
import { randomGoodie } from "../../../utils/Goodie";

export default class LeaderboardCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "leaderboard",
      description:
        "View the leaderboard for who has the most candies and presents combined!",
      interaction: {
        name: "leaderboard",
        type: ApplicationCommandType.CHAT_INPUT,
        description:
          "View the leaderboard for who has the most candies and presents combined!",
        options: [],
      },
    });
  }

  async onInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }
    await interaction.deferReply();
    const collection = await UserModel.db.collection("users");
    const documents = await collection.find({}).toArray();
    const sorttedDocuments: Record<string, number>[] = documents.sort(
      (a, b) => {
        return a.presentCount + a.candyCount - (b.presentCount + b.candyCount);
      }
    );
    return (await interaction.editReply({
      content: MessageUtil.Success(
        MessageUtil.Translate("cmds.leaderboard.leaderboard")
      ),
      embeds: [
        {
          thumbnail: {
            url: interaction.guild.iconURL({ forceStatic: true }),
          },
          color: 5793266,
          title: MessageUtil.Translate("cmds.leaderboard.leaderboardTitle"),
          description: MessageUtil.Translate(
            "cmds.leaderboard.leaderboardDescription"
          ).replace(
            "{goodies}",
            (
              await Promise.all(
                sorttedDocuments
                  .reverse()
                  .slice(0, 10)
                  .map(async (x, i) => {
                    const user = await this.ctx.users.fetch(String(x.User));
                    return `**${randomGoodie()} ${i + 1}. ${user.username} (${
                      x.presentCount + x.candyCount
                    })**`;
                  })
              )
            ).join("\n")
          )
          .replace("{guildGoodieCount}",
          //@ts-ignore
          documents.reduce((x, y) => x + y.presentCount + y.candyCount, 0)
          ),
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
