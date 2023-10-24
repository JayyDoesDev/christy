import { ChatInputCommandInteraction, Interaction } from "discord.js";
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

export default class ClaimCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "claim",
      description: "Claim a present or candy!",
      interaction: {
        name: "claim",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "Claim a present or candy!",
        options: [
          {
            name: "id",
            type: ApplicationCommandOptionType.STRING,
            description: "Provide the present/candy id to claim it.",
            required: true,
            max_length: 7,
          },
        ],
      },
    });
  }

  async onInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }
    const redisKey: string = "christy";
    const redisIdentifier: string = "code";
    if (await Redis.exists(redisKey, redisIdentifier)) {
      const input: string = interaction.options.getString("id");
      const getRedisValue: string = await Redis.get(redisKey, redisIdentifier);
      const getRedisClaimID: string = getRedisValue.slice(0, 7);
      const getRedisGoodie: string = getRedisValue.slice(
        8,
        getRedisValue.length
      );
      if (input === getRedisClaimID) {
        if (getRedisGoodie === "present") {
          if (await GoodieController.findUser(interaction.user.id)) {
            await GoodieController.incrementPresent(interaction.user.id);
          } else {
            await GoodieController.createUser(interaction.user.id);
            await GoodieController.incrementPresent(interaction.user.id);
          }
        } else {
          if (await GoodieController.findUser(interaction.user.id)) {
            await GoodieController.incrementCandy(interaction.user.id);
          } else {
            await GoodieController.createUser(interaction.user.id);
            await GoodieController.incrementCandy(interaction.user.id);
          }
        }
        await interaction.reply({
          content: MessageUtil.Success(
            `**Congratulations, you have claimed a ${goodify(
              getRedisGoodie
            )} from ${getRedisClaimID}! View your inventory using \`/inventory\`!**`
          ),
        }) as any;
        return await Redis.deleteKey(redisKey, redisIdentifier);
      } else {
        return await interaction.reply({
          content: MessageUtil.Error(
            "**Sorry, this code doesn't seem to exist! This code as either been claimed or a new code needs to be generated again!**"
          ),
        }) as any;
      }
    } else {
      return await interaction.reply({
        content: MessageUtil.Error(
          "**Sorry, this code doesn't seem to exist! This code as either been claimed or a new code needs to be generated again!**"
        ),
      }) as any;
    }
  }
}
