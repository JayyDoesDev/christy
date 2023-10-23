import { Context } from "./Context";
import { IEventOptions, IEvent, BaseEvent } from "./types";

export class Event extends BaseEvent {
  public declare ctx: Context;
  public declare name: string;
  public declare once?: boolean;
  constructor(ctx: Context, options: IEventOptions) {
    super(ctx, options.name, options.once);
  }

  async onEvent(...event: any): Promise<void> {
    return;
  }
}