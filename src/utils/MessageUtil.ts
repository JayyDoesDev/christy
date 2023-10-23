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
  }