import * as fs from "fs";
import dotenv from "dotenv";
import { WebClient } from "@slack/web-api";

dotenv.config();
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN!;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL!;

async function notify(message: string, imagePath: string) {
  const slack = new WebClient(SLACK_BOT_TOKEN);

  try {
    const result = await slack.files.uploadV2({
      channel_id: SLACK_CHANNEL,
      initial_comment: message,
      file: fs.createReadStream(imagePath),
      filename: "screenshot.png",
    });

    if (!result.ok) {
      console.error("❌ Slack通知失敗:", result.error);
    } else {
      console.log("✅ Slack通知成功！");
    }
  } catch (err) {
    console.error("❌ Slack API呼び出しエラー:", err);
  }
}

export { notify };
