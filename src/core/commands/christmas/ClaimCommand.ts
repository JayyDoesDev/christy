import {
  APIEmbed,
  ChatInputCommandInteraction,
  Interaction,
  InteractionEditReplyOptions,
  MessagePayload,
} from "discord.js";
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
import { getGoodie } from "../../../utils/Goodie";

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
    await interaction.deferReply();
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
        const embed: InteractionEditReplyOptions = {
          content: MessageUtil.Success(
            MessageUtil.Translate("cmds.claim.congrats").replace(
              "{goodieName}",
              getGoodie(getRedisGoodie).name
            )
          ),
          embeds: [
            {
              title: "Claimed!",
              color: getGoodie(getRedisGoodie).color,
              description: MessageUtil.Translate("cmds.claim.claimed").replace(
                "{goodieName}",
                getGoodie(getRedisGoodie).name
              ),
              thumbnail: {
                url: getGoodie(getRedisGoodie).emojiIcon,
              },
              footer: {
                text: getGoodie(getRedisGoodie).quotes[
                  Math.floor(
                    Math.random() * getGoodie(getRedisGoodie).quotes.length
                  )
                ],
              },
            },
          ],
        };
        if (await Redis.lock(redisKey, redisIdentifier)) {
          try {
            if (getRedisGoodie.includes("present")) {
              if (await GoodieController.findUser(interaction.user.id)) {
                await GoodieController.incrementPresent(interaction.user.id);
                await interaction.editReply(embed);
                return await Redis.deleteKey(redisKey, redisIdentifier);
              } else {
                await GoodieController.createUser(interaction.user.id);
                await GoodieController.incrementPresent(interaction.user.id);
                await interaction.editReply(embed);
                return await Redis.deleteKey(redisKey, redisIdentifier);
              }
            } else {
              if (await GoodieController.findUser(interaction.user.id)) {
                await GoodieController.incrementCandy(interaction.user.id);
                await interaction.editReply(embed);
                return await Redis.deleteKey(redisKey, redisIdentifier);
              } else {
                await GoodieController.createUser(interaction.user.id);
                await GoodieController.incrementCandy(interaction.user.id);
                await interaction.editReply(embed);
                return await Redis.deleteKey(redisKey, redisIdentifier);
              }
            }
          } finally {
            await Redis.unlock(redisKey, redisIdentifier);
            await Redis.deleteKey(redisKey, redisIdentifier);
          }
        } else {
          return (await interaction.editReply({
            content: MessageUtil.Error(
              MessageUtil.Translate("cmds.claim.error")
            ),
          })) as any;
        }
      } else {
        return (await interaction.editReply({
          content: MessageUtil.Error(MessageUtil.Translate("cmds.claim.error")),
        })) as any;
      }
    } else {
      await Redis.deleteKey(redisKey, redisIdentifier);
      return (await interaction.editReply({
        content: MessageUtil.Error(MessageUtil.Translate("cmds.claim.error")),
      })) as any;
    }
  }
}
