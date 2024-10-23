const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
// const readCaptcha = require("./captcha_reader");

const baseUrl = "https://tixcraft.com/activity/game/";

dotenv.config();

const sid = process.env.SID;
const url = baseUrl + process.env.ACTIVITY_ID;
const targetAreas = process.env.TARGET_AREAS.split(",");
const windowWidth = parseInt(process.env.WINDOW_WIDTH, 10) || 1280;
const windowHeight = parseInt(process.env.WINDOW_HEIGHT, 10) || 800;
const ticketCount = parseInt(process.env.TICKET_COUNT, 10) || 2;
const isUserDataDir = false;
const startHour = parseInt(process.env.START_TIME.split(":")[0], 10);
const startMinute = parseInt(process.env.START_TIME.split(":")[1], 10);
const countdownInterval = parseInt(process.env.COUNTDOWN_INTERVAL, 10) || 10000;

function getMillisecondsUntil(targetHour, targetMinute) {
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(targetHour, targetMinute, 0, 0);

  if (targetTime <= now) {
    // If the target time has passed, set it to the same time tomorrow
    targetTime.setDate(targetTime.getDate() + 1);
  }

  return targetTime - now;
}

async function launchBrowser() {
  const userDataDir = isUserDataDir ? "./puppeteer-profile" : undefined;
  return await puppeteer.launch({
    headless: false,
    userDataDir: userDataDir,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--window-size=${windowWidth},${windowHeight}`,
    ],
  });
}

async function setCookie(page) {
  await page.setCookie({
    name: "SID",
    value: sid,
    domain: "tixcraft.com",
    path: "/",
  });
}

async function acceptCookies(page) {
  if (!isUserDataDir) {
    try {
      await page.waitForSelector("#onetrust-accept-btn-handler", {
        timeout: 500,
      });
      const cookieButton = await page.$("#onetrust-accept-btn-handler");
      if (cookieButton) {
        await cookieButton.click();
      }
    } catch (error) {
      console.log("Cookie acceptance button not found or timed out. Continuing...");
    }
  }
}

async function clickPurchaseButton(page) {
  await page.waitForSelector(".btn.btn-primary.text-bold.m-0", {
    timeout: 5000,
  });
  const button = await page.$(".btn.btn-primary.text-bold.m-0");
  if (button) {
    await button.click();
  }
}

async function selectTicketArea(page) {
  const result = await Promise.race([
    page.waitForSelector(".select_form_b", { timeout: 10000 }).then(() => "b"),
    page.waitForSelector(".select_form_a", { timeout: 10000 }).then(() => "a")
  ]);
  
  const selector = result === "b" ? "li.select_form_b a" : "li.select_form_a a";
  
  for (const area of targetAreas) {
    console.log(`Searching for ${area}...`);
    const matchingLinks = await page.$$(selector);
    let found = false;
    for (let link of matchingLinks) {
      const linkText = await link.evaluate((node) => node.innerText);
      if (linkText.includes(area)) {
        console.log(`Found ${area}, attempting to click...`);
        await link.click();
        console.log(`Successfully clicked ${area}`);
        found = true;
        break;
      }
    }
    if (found) {
      break;
    } else {
      console.log(`${area} sold out, searching for the next seat...`);
    }
  }
}

async function fillTicketCount(page) {
  await page.waitForSelector(".form-select.mobile-select", { timeout: 5000 });
  await page.select(".form-select.mobile-select", ticketCount.toString());
}

async function agreeTerms(page) {
  await page.waitForSelector("#TicketForm_agree", { timeout: 5000 });
  const agreeCheckbox = await page.$("#TicketForm_agree");
  if (agreeCheckbox) {
    await agreeCheckbox.click();
    console.log("Checked the agree terms checkbox");
  }
}

async function focusCaptchaInput(page) {
  await page.waitForSelector("#TicketForm_verifyCode", { timeout: 5000 });
  const captchaInput = await page.$("#TicketForm_verifyCode");
  if (captchaInput) {
    await captchaInput.focus();
    console.log("Focused on the captcha input field");
  }
}

(async () => {
  const millisecondsUntilStart = getMillisecondsUntil(startHour, startMinute);
  console.log(
    `The ticket purchase will start in ${millisecondsUntilStart / 1000} seconds`
  );

  let remainingTime = millisecondsUntilStart;
  const intervalId = setInterval(() => {
    remainingTime -= countdownInterval;
    if (remainingTime > 0) {
      const remainingSeconds = Math.floor(remainingTime / 1000);
      const currentTime = new Date().toLocaleTimeString();
      console.log(
        `Remaining time: ${remainingSeconds} seconds, Current time: ${currentTime}`
      );
    } else {
      clearInterval(intervalId);
    }
  }, countdownInterval);

  setTimeout(async () => {
    clearInterval(intervalId);
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: windowWidth, height: windowHeight });
    await setCookie(page);
    await page.goto(url, { waitUntil: "networkidle2" });
    await acceptCookies(page);
    await clickPurchaseButton(page);
    await selectTicketArea(page);
    await fillTicketCount(page);
    await agreeTerms(page);
    await focusCaptchaInput(page);
  }, millisecondsUntilStart);
})();
