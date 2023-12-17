import {
  ChatInputCommandInteraction,
  User,
  PermissionsBitField,
} from "discord.js";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  PermissionBitToNumber,
  Permissions,
  PermissionBitToString,
  PermissionsToHuman,
} from "@antibot/interactions";
import { Command } from "../../../structures/Command";
import { Context } from "../../../structures/Context";
import { GoodieController } from "../../../controllers/GoodieController";

export default class BlacklistCommand extends Command {
  constructor(ctx: Context) {
    super(ctx, {
      name: "blacklist",
      description: "Blacklist users",
      interaction: {
        name: "blacklist",
        type: ApplicationCommandType.CHAT_INPUT,
        description: "Blacklist users",
        default_member_permissions: PermissionBitToString(
          Permissions({ KickMembers: true, BanMembers: true })
        ),
        options: [
          {
            name: "user",
            type: ApplicationCommandOptionType.USER,
            description: "Provide the uesr you would like to blacklist",
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
    // man this is awful
    for (const permission of PermissionsToHuman(
      Object.values(interaction.options.getMember("user").permissions)[0]
    )) {
      //@ts-ignore
      if (permission === "KICK_MEMBERS" || permission === "BAN_MEMBERS") {
        await interaction.deferReply({ ephemeral: true });
        return interaction.editReply({ content: "If this is you joleg, no you can't blacklist staff members"}) as any;
      }
    }
    const user = interaction.options.getUser("user");
    //@ts-ignore

    if (await GoodieController.findUser(user.id)) {
      const data = await GoodieController.getUser(user.id);
      if (data.blackListed) {
        await GoodieController.whiteList(user.id);
        await interaction.deferReply({ ephemeral: true });
        return interaction.editReply({
          content: `<@${user.id}> is now whitelisted.`,
        }) as any;
      } else {
        await GoodieController.blackList(user.id);
        await interaction.deferReply({ ephemeral: true });
        return interaction.editReply({
          content: `<@${user.id}> is now blacklisted.`,
        }) as any;
      }
    } else {
      await GoodieController.createUser(user.id);
      await GoodieController.blackList(user.id);
      await interaction.deferReply({ ephemeral: true });
      return interaction.editReply({
        content: `<@${user.id}> is now blacklisted.`,
      }) as any;
    }
  }
}
