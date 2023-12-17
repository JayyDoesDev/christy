import UserModel from "./models/UserModel";
import type { Snowflake } from "@antibot/interactions";
export namespace GoodieController {
  export async function findUser(userId: Snowflake): Promise<boolean> {
    const data = await UserModel.findOne({ User: userId });
    if (data) {
      return true;
    } else {
      return false;
    }
  }

  export async function createUser(userId: Snowflake): Promise<void> {
    await new UserModel({
      User: userId,
    }).save();
  }

  export async function getUser(userId: Snowflake): Promise<{
    User: string;
    presentCount: number;
    candyCount: number;
    snowballCount: number;
    blackListed: boolean;
  }> {
    const data = await UserModel.findOne({ User: userId });
    return {
      User: data.User,
      presentCount: data.presentCount,
      candyCount: data.candyCount,
      snowballCount: data.snowballCount,
      blackListed: data.blackListed
    };
  }

  export async function incrementPresent(
    userId: Snowflake,
    customAmount?: number
  ): Promise<void> {
    await UserModel.updateOne(
      {
        User: userId,
      },
      {
        $inc: { presentCount: customAmount ? customAmount : 1 },
      },
      {
        new: true,
      }
    );
  }

  export async function incrementCandy(
    userId: Snowflake,
    customAmount?: number
  ): Promise<void> {
    await UserModel.updateOne(
      {
        User: userId,
      },
      {
        $inc: { candyCount: customAmount ? customAmount : 1 },
      },
      {
        new: true,
      }
    );
  }

  export async function decrementPresent(
    userId: Snowflake,
    customAmount?: number
  ): Promise<void> {
    await UserModel.updateOne(
      {
        User: userId,
      },
      {
        $inc: { presentCount: customAmount ? customAmount : -1 },
      },
      {
        new: true,
      }
    );
  }

  export async function decrementCandy(
    userId: Snowflake,
    customAmount?: number
  ): Promise<void> {
    await UserModel.updateOne(
      {
        User: userId,
      },
      {
        $inc: { candyCount: customAmount ? customAmount : -1 },
      },
      {
        new: true,
      }
    );
  }

  export async function incrementSnowball(userId: Snowflake): Promise<void> {
    await UserModel.updateOne(
      {
        User: userId,
      },
      {
        $inc: { snowballCount: 1 },
      },
      {
        new: true,
      }
    );
  }

  export async function isBlackListed(userId: Snowflake): Promise<boolean> {
    const data = await UserModel.findOne({ User: userId });
    if (data.blackListed) {
      return true;
    } else {
      return false;
    }
  }

  export async function blackList(userId: Snowflake): Promise<void> {
    await UserModel.updateOne(
      {
        User: userId,
      },
      {
        $set: { blackListed: true },
      },
      {
        new: true,
      }
    );
  }

  export async function whiteList(userId: Snowflake): Promise<void> {
    await UserModel.updateOne(
      {
        User: userId,
      },
      {
        $set: { blackListed: false },
      },
      {
        new: true,
      }
    );
  }
}
