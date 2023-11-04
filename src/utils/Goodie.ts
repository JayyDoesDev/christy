import goodies from "../../data/goodies.json";
export interface Goodie {
  type: GoodieType;
  name: string;
  color: number;
  emoji: string;
  emojiIcon: string;
  fileNameAndExtension: string;
  quotes: string[];
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
export function getGoodie(goodie: string): Goodie {
  for (let i: number = 0; i < goodies.length; i++) {
    if (goodies[i].technicalName == goodie) {
      if (goodies[i].type === "present") {
        return {
          type: goodies[i].type as any,
          name: goodies[i].name,
          color: Number(goodies[i].color),
          emoji: goodies[i].emoji,
          emojiIcon:
            "https://raw.githubusercontent.com/JayyDoesDev/christy/main/.github/assets/presents/" +
            goodies[i].fileNameAndExtension,
          fileNameAndExtension: goodies[i].fileNameAndExtension,
          quotes: goodies[i].quotes,
        };
      } else if (goodies[i].type === "candy") {
        return {
          type: goodies[i].type as any,
          name: goodies[i].name,
          color: Number(goodies[i].color),
          emoji: goodies[i].emoji,
          emojiIcon:
            "https://raw.githubusercontent.com/JayyDoesDev/christy/main/.github/assets/candies/" +
            goodies[i].fileNameAndExtension,
          fileNameAndExtension: goodies[i].fileNameAndExtension,
          quotes: goodies[i].quotes,
        };
      }
    }
  }
}
export function randomGoodie(type?: "present" | "candy"): string {
  if (!type) {
    return goodies[Math.floor(Math.random() * goodies.length)].emoji;
  }
  const filteredGoodies = goodies.filter((goodie) => goodie.type === type);
  if (filteredGoodies.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * filteredGoodies.length);
  return filteredGoodies[randomIndex].emoji;
}
