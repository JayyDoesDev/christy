import { Event } from "../../../structures/Event";
import { Context } from "../../../structures/Context";
import { Command } from "../../../structures/Command";
import { Interaction, ChannelType, InteractionResponse } from "discord.js";
import {
  Permissions,
  PermissionBitToNumber,
  PermissionsToHuman,
  PlantPermission,
} from "@antibot/interactions";
import { MessageUtil } from "../../../utils/MessageUtil";
import { ZillaCollection } from "@antibot/zilla";
import { GoodieController } from "../../../controllers/GoodieController";
export default class InteractionEvent extends Event {
  constructor(ctx: Context) {
    super(ctx, {
      name: "interactionCreate",
      once: false,
    });
  }

  async onEvent(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }
    if (interaction.channel.type === (ChannelType.DM as any)) {
      return;
    }

    const command: Command = this.ctx.interactions.get(interaction.commandName);
    if (command) {
      if (!this.ctx.cooldown.has(command.name)) {
        this.ctx.cooldown.set(command.name, new ZillaCollection<any, any>());
      }
      const now: number = Date.now();
      const timestamps: any = this.ctx.cooldown.get(command.name);
      const cooldown: number = Number(process.env.COMMANDCOOLDOWN);
      if (timestamps.has(interaction.user.id)) {
        const ex: number = timestamps.get(interaction.user.id) + cooldown;
        if (now < ex) {
          await interaction.deferReply({ ephemeral: true });
          return interaction.editReply({
            content: MessageUtil.Error(MessageUtil.Translate("cooldown")),
          }) as any;
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldown);

      if (command.permissions) {
        const perms: any[] = [];
        let permDisplay: string = "";
        if (!interaction.appPermissions.has(command.permissions)) {
          //@ts-ignore
          for (var i = 0; i < command.permissions.length; i++) {
            perms.push(
              PermissionsToHuman(PlantPermission(command.permissions[i]))
            );
          }
          if (perms.length <= 2) {
            permDisplay = perms.join(" & ");
          } else {
            permDisplay = perms.join(", ");
          }
          //@ts-ignore
          return interaction.reply({
            content: MessageUtil.Error(
              `I'm missing permissions! (${permDisplay})`
            ),
          });
        }
      }

      if (await GoodieController.findUser(interaction.user.id)) {
        if (await GoodieController.isBlackListed(interaction.user.id)) {
          await interaction.deferReply({ ephemeral: true });
          return interaction.editReply({ content: "You are blacklisted." }) as any;
        } else {
          command.onInteraction(interaction)
        }
      } else {
        command.onInteraction(interaction);
      }
    }
  }
}
