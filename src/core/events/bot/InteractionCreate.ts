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
      command.onInteraction(interaction);
    }
  }
}