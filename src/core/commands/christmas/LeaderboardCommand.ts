import { APIUser, Interaction, User } from "discord.js";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  Snowflake,
} from "@antibot/interactions";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { Redis } from "../../../utils/Redis";
import { MessageUtil } from "../../../utils/MessageUtil";
import { goodify } from "../../../utils/goodify";
import { GoodieController } from "../../../controllers/GoodieController";
import UserModel from "../../../controllers/models/UserModel";

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

    const collection = await UserModel.db.collection("users");
    const documents = await collection.find({}).toArray();
    const sorttedDocuments: Record<string, number>[] = documents.sort(
      (a, b) => {
        return a.presentCount + a.candyCount - (b.presentCount + b.candyCount);
      }
    );
    return (await interaction.reply({
      content: MessageUtil.Success(
        "**Leaderboard! All presents and candies are added up into goodies!**"
      ),
      embeds: [
        {
          thumbnail: {
            url: interaction.guild.iconURL({ forceStatic: true })
          },
          color: 5793266,
          title: "Server Leaderboard",
          description: `**The top 10 users with the most goodies!**\n${(
            await Promise.all(
              sorttedDocuments
                .slice(0, 10)
                .reverse()
                .map(async (x, i) => {
                  const user = await this.ctx.users.fetch(String(x.User));
                  return `**${this.randomGoodie()} ${i + 1}. ${
                    user.username
                  } (${x.presentCount + x.candyCount})**`;
                })
            )
          ).join("\n")}`,
        },
      ],
    })) as any;
  }

  randomGoodie(): string {
    const goodies: string[] = ["present", "candy"];
    let string: string = "";
    goodies[Math.floor(Math.random() * goodies.length)] === "present"
      ? string = "<:present:1165862478018773013>"
      : string = "<:candy:1165849590415753287>"; 
      return string;
  }
}
