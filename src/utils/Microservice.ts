import fs from "fs";
import { GoodieController } from "../controllers/GoodieController";
import path from "path";
export namespace Microservice {
  export async function ListenForWinner(): Promise<void> {
    setInterval(async () => {
        const winnerPath: string = path.join(process.cwd(), "winners.json")
      if (fs.existsSync(winnerPath)) {
        console.log("Winner file exists")
        const winner = require(winnerPath);
        const winnerId = String(winner.id);
        const winnerAmount = winner.amount;
        if (await GoodieController.findUser(winnerId)) {
          await GoodieController.incrementCandy(winnerId, winnerAmount).then(() => {
            fs.unlink(winnerPath, (e) => {
                console.log("Winners file deleted");
              });
          })
        } else {
          await GoodieController.createUser(winnerId);
          await GoodieController.incrementCandy(winnerId, winnerAmount).then(() => {
            fs.unlink(winnerPath, (e) => {
                console.log("Winners file deleted");
              });
          })
        }
      } else {
        console.log("Not found")
        return;
      }
    }, 5000);
  }
}
