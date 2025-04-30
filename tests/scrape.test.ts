import { test } from "@playwright/test";
import { notify } from "../src/notify";
import { chromium } from "playwright";

test("ディズニー予約画面のスクレイピング", async ({ page }) => {
  // 2025年4月30日（水）ディズニーシー,夕食時間帯,大人2名,子ども1名3歳に予約可能なレストランを検索するURL
  const targetUrl =
    "https://reserve.tokyodisneyresort.jp/restaurant/search/?useDate=20250430&mealDivList%5B2%5D=3&adultNum=2&childNum=1&childAgeInform=03%7C&restaurantType%5B1%5D=5&nameCd=&wheelchairCount=0&stretcherCount=0&keyword=&reservationStatus=1";

  console.log("アクセス開始");
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

  console.log("ネットワーク安定待機");
  await page
    .waitForLoadState("networkidle", { timeout: 10_000 })
    .catch(() => console.log("networkidleタイムアウト。次に進みます"));

  // 順番待ち中かどうか判定
  const url = page.url();
  if (url.includes("reserve-q.tokyodisneyresort.jp")) {
    console.log("順番待ち画面を検知。リダイレクト待機中...");

    // 元のページに戻るまで最大3分待機
    await page.waitForFunction(
      () => location.hostname === "reserve.tokyodisneyresort.jp",
      null,
      { timeout: 180_000 }
    );

    console.log("リダイレクト完了");
  }

  // モーダル確認＆閉じる
  console.log("モーダルチェック");
  const modal = page.locator("#modalDialog");

  try {
    await modal.waitFor({ state: "visible", timeout: 5000 });
    console.log("モーダル検出");
    await page.locator('#modalDialog .close02 img[alt="閉じる"]').click();
    await page.waitForTimeout(1000);
  } catch {
    console.log("モーダルは表示されていませんでした");
  }

  await page.waitForSelector(".section01", { timeout: 600_000 });
  await page.screenshot({ path: "final-screen.png", fullPage: true });

  const restaurantElements = page.locator('.section01 [id^="restaurant_"]');
  const count = await restaurantElements.count();
  const gotReservations: string[] = [];

  for (let i = 0; i < count; i++) {
    const el = restaurantElements.nth(i);
    const className = await el.getAttribute("class");

    const hasGot = className?.includes("hasGotReservation");
    if (hasGot) {
      // レストラン名を取得
      const nameText = await el.locator("h2.heading").evaluate((h2) => {
        return h2.childNodes[h2.childNodes.length - 1].textContent?.trim();
      });
      // 予約可能な時間帯を取得
      const timeElements = el.locator("ul.cf li.reservationAble p.time");
      const timeCount = await timeElements.count();
      const availableTimes: string[] = [];

      for (let j = 0; j < timeCount; j++) {
        const time = await timeElements.nth(j).textContent();
        if (time) availableTimes.push(time.trim());
      }

      gotReservations.push(`✅ ${nameText} ： ${availableTimes.join(" / ")}`);
    }
  }

  // 実行結果をまとめて通知
  if (gotReservations.length > 0) {
    const message = "レストランの空き状況\n\n" + gotReservations.join("\n");
    await notify(message, "final-screen.png");
  }
});
