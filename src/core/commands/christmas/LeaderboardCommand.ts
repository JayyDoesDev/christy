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
import UserModel from "../../../controllers/models/UserModel";

export default class LeaderboardCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "leaderboard",
      description: "View the leaderboard for who has the most candies and presents combined!",
      interaction: {
        name: "leaderboard",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "View the leaderboard for who has the most candies and presents combined!",
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
    console.log(sorttedDocuments);
    return (await interaction.reply({
      content: MessageUtil.Success(
        "**Leaderboard! All presents and candies are added up into goodies!**"
      ),
      embeds: [
        {
          color: 1338170,
          description: MessageUtil.colorfulBlock(
            `\u001b[0;33mServer Leaderboard\u001b[0;0m\n${sorttedDocuments
              .slice(0, 10)
              .reverse()
              .map(
                (x, i) =>
                  `\u001b[0;32m${i + 1}. ${
                    x.User
                  }\n\u001b[0;31mGoodies Collected: \u001b[0;37m${
                    x.presentCount + x.candyCount
                  }\u001b[0;0m`
              )
              .join("\n")}`
          ),
        },
      ],
    })) as any;
  }
}
