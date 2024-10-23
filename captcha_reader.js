const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

async function readCaptcha(page) {
  // 等待驗證碼圖片加載完成
  await page.waitForSelector("#TicketForm_verifyCode-image", {
    timeout: 5000,
  });

  // 獲取驗證碼圖片的src屬性
  const captchaImageSrc = await page.$eval(
    "#TicketForm_verifyCode-image",
    (img) => img.src
  );

  // 使用axios下載驗證碼圖片
  const captchaImagePath = path.resolve(__dirname, "captcha_image.png");
  const writer = fs.createWriteStream(captchaImagePath);

  const response = await axios({
    url: captchaImageSrc,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  // 調用Python腳本來讀取驗證碼
  const pythonScriptPath = path.resolve(
    __dirname,
    "../captcha/captcha_reader.py"
  );

  const captchaCode = await new Promise((resolve, reject) => {
    exec(
      `py ${pythonScriptPath} ${captchaImagePath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
        } else if (stderr) {
          reject(`Stderr: ${stderr}`);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });

  //console.log(`驗證碼為: ${captchaCode}`);

  return captchaCode;
}

module.exports = readCaptcha;
