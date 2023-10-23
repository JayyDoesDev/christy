import { Context } from "./Context";
import {
  Interaction,
  Message,
  ApplicationCommandData,
  ApplicationCommandOptionData,
  PermissionsBitField,
} from "discord.js";
import { ICommand as InteractionsCommand } from "@antibot/interactions";
export interface ICommand {
  ctx: Context;
  name: string;
  description: string;
  onInteraction: (interaction: Interaction) => void;
}

export interface ICommandOptions {
  name: string;
  description: string;
  interaction?: InteractionsCommand;
  group?: string | CommandGroup;
  permissions?: PermissionsBitField[] | any[];
}

export enum CommandGroup {}

export abstract class BaseCommand implements ICommand {
  constructor(
    public ctx: Context,
    public name: string,
    public description: string,
    public interaction?: InteractionsCommand,
    public group?: string | CommandGroup,
    public permissions?: PermissionsBitField[] | any[]
  ) {}
  abstract onInteraction(interaction: Interaction): Promise<void>;
}

export interface IEvent {
  ctx: Context;
  name: string;
  once?: boolean;
  onEvent: (...event: any) => void;
}

export interface IEventOptions {
  name: string;
  once?: boolean;
}

export abstract class BaseEvent implements IEvent {
  constructor(
    public ctx: Context,
    public name: string,
    public once?: boolean
  ) {}

  abstract onEvent(...event: any): void;
}