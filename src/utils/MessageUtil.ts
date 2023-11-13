import messages from "../../data/messages.json";

export namespace MessageUtil {
  export function Success(content: string): string {
    return `> ${content}`;
  }

  export function Error(content: string): string {
    return `> ${content}`;
  }

  export function colorfulBlock(content: string): string {
    return `\`\`\`ansi\n${content}\`\`\``;
  }

  export function Translate(props: string): string {
    const split: string[] = props.split(".");
    let translation: any = messages;

    for (const prop of split) {
      if (translation.hasOwnProperty(prop)) {
        translation = translation[prop];
      } else {
        return "Error with translation: https://github.com/JayyDoesDev/christy/blob/main/data/messages.json";
      }
    }

    // Check if translation is a string and replace \\n with newline
    if (typeof translation === "string") {
      return translation.replace(/\\n/g, "\n");
    } else {
      return "Error with translation: https://github.com/JayyDoesDev/christy/blob/main/data/messages.json";
    }
  }
}
