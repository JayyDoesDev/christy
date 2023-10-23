import { Context } from "./Context";
import {
  Interaction,
  Message,
  ApplicationCommandData,
  PermissionsBitField,
} from "discord.js";
import { ICommandOptions, CommandGroup, BaseCommand } from "./types";
import { ICommand as InteractonCommand } from "@antibot/interactions";
export class Command extends BaseCommand {
  public declare ctx: Context;
  public declare name: string;
  public declare description: string;
  public declare interaction: InteractonCommand;
  public declare group: string | CommandGroup;
  public declare permissions?: PermissionsBitField[] | any[];
  constructor(ctx: Context, options: ICommandOptions) {
    super(
      ctx,
      options.name,
      options.description,
      options.interaction,
      options.group,
      options.permissions
    );
  }
  
  async onInteraction(interaction: Interaction): Promise<void> {
    return;
  }
}