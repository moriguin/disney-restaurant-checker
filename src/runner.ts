import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runTask() {
  console.log("タスク開始: ", new Date().toLocaleString());
  try {
    const { stdout: pullOut } = await execAsync("git pull origin develop");
    console.log("✅ Git Pull 完了:\n", pullOut);
    const { stdout: testOut } = await execAsync("yarn test");
    console.log("✅ テスト完了:\n", testOut);
  } catch (err) {
    console.error("エラー:", err);
  }
}

runTask(); // 最初の実行

// 30分ごとに再実行
setInterval(runTask, 30 * 60 * 1000);
