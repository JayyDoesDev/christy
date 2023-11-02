export interface Goodie {
  type: GoodieType;
  name: string;
  color: number;
  emoji: string;
  fileNameAndExtension: string;
}

export enum GoodieType {
  Present = "present",
}

export type Presents =
  | "blue-present"
  | "gray-present"
  | "ikea-present"
  | "light-blue-present"
  | "light-green-present"
  | "light-purple-present"
  | "pink-present"
  | "purple-present"
  | "red-present";
export type Candies = "candy";
export function getGoodie(goodie: Presents | Candies | string): Goodie {
  switch (goodie) {
    case "blue-present":
      {
        return {
          type: GoodieType.Present,
          name: "Blue Present",
          color: 0x515a91,
          emoji: "<:present:1165862478018773013>",
          fileNameAndExtension: "blue-present.png",
        };
      }
      break;
    case "gray-present":
      {
        return {
          type: GoodieType.Present,
          name: "Gray Present",
          color: 0xa5a7a8,
          emoji: ".",
          fileNameAndExtension: "gray-present.png",
        };
      }
      break;
    case "ikea-present":
      {
        return {
          type: GoodieType.Present,
          name: "Ikea Present",
          color: 0x70bbdf,
          emoji: ".",
          fileNameAndExtension: "ikea-present.png",
        };
      }
      break;
    case "light-blue-present":
      {
        return {
          type: GoodieType.Present,
          name: "Light Blue Present",
          color: 0xa2c7d1,
          emoji: ".",
          fileNameAndExtension: "light-blue-present.png",
        };
      }
      break;
    case "light-green-present":
      {
        return {
          type: GoodieType.Present,
          name: "Light Green Present",
          color: 0xd2cfac,
          emoji: ".",
          fileNameAndExtension: "light-green-present.png",
        };
      }
      break;
    case "light-purple-present":
      {
        return {
          type: GoodieType.Present,
          name: "Light Purple Present",
          color: 0x766396,
          emoji: ".",
          fileNameAndExtension: "light-purple-present.png",
        };
      }
      break;
    case "pink-present":
      {
        return {
          type: GoodieType.Present,
          name: "Pink Present",
          color: 0xeb94e8,
          emoji: ".",
          fileNameAndExtension: "pink-present.png",
        };
      }
      break;
    case "purple-present":
      {
        return {
          type: GoodieType.Present,
          name: "Purple Present",
          color: 0x6f3a82,
          emoji: ".",
          fileNameAndExtension: "purple-present.png",
        };
      }
      break;
    case "red-present":
      {
        return {
          type: GoodieType.Present,
          name: "Red Present",
          color: 0xfd5d5a,
          emoji: ".",
          fileNameAndExtension: "red-present",
        };
      }
      break;
    case "candy": {
      return {
        type: GoodieType.Present,
        name: "Candy",
        color: 0xff6377,
        emoji: "<:candy:1165849590415753287>",
        fileNameAndExtension: "candy.png",
      };
    }
  }
}
