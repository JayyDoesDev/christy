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
export function getGoodie(goodie: Presents | Candies | string): Goodie {
  for (let i:number=0; i < goodies.length; i++) {
    if (goodies[i].technicalName == goodie) {
      return  {
        type: goodies[i].type as any,
        name: goodies[i].name,
        color: Number(goodies[i].color),
        emoji: goodies[i].emoji,
        emojiIcon: "https://raw.githubusercontent.com/JayyDoesDev/christy/main/.github/assets/presents/" + goodies[i].fileNameAndExtension,
        fileNameAndExtension: goodies[i].fileNameAndExtension,
        quotes: goodies[i].quotes
      }
    } 
  }
}
export function randomGoodie(): string {
  return goodies[Math.floor(Math.random() * goodies.length)].emoji;
}