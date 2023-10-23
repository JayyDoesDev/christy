import { Client, Collection, Partials } from "discord.js";
import { ZillaCollection } from "@antibot/zilla";
import { Command } from "./Command";
import { Interactions } from "@antibot/interactions";

export class Context extends Client {
  public commands: ZillaCollection<string, Command>;
  public cooldown: ZillaCollection<string, Command>;
  public interactions: ZillaCollection<string, Command>;
  public interact: Interactions;
  constructor() {
    super({
      intents: ["Guilds", "GuildMessages", "GuildMembers"],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      allowedMentions: {
        parse: ["everyone"],
      },
    });
    this.commands = new ZillaCollection<string, Command>();
    this.interactions = new ZillaCollection<string, Command>();
    this.interact = new Interactions({
      publicKey: process.env.PUBLICKEY,
      botID: process.env.BOTID,
      botToken: process.env.TOKEN,
      debug: true,
    });
  }
}