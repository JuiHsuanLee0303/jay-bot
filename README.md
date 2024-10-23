# Auto Ticket System (TixCraft)

This is an automated ticket purchasing system developed using Puppeteer and Node.js. The system will automatically execute the ticket purchasing process, including selecting ticket areas, filling in the number of tickets, agreeing to terms, and handling captchas.

## Project Background

The Auto Ticket System (TixCraft) was developed to help users purchase tickets more efficiently and avoid the hassle of manual ticket purchasing. This system is particularly useful for high-demand events where tickets sell out quickly. By automating the process, users can increase their chances of securing tickets.

## Features

- **Automated Ticket Selection**: Automatically selects the desired ticket areas.
- **Captcha Handling**: Assists in handling captchas during the purchasing process.
- **Terms Agreement**: Automatically agrees to the terms and conditions.
- **Ticket Count Selection**: Fills in the number of tickets to purchase.

## System Architecture

The system is built using Puppeteer and Node.js. Below is a high-level overview of the system architecture:

1. **Browser Automation**: Puppeteer is used to control a headless browser for navigating the ticket purchasing website.
2. **Environment Configuration**: Environment variables are used to configure the system.
3. **Script Execution**: The main script (`main.js`) orchestrates the entire ticket purchasing process.

## Table of Contents

- [Auto Ticket System (TixCraft)](#auto-ticket-system-tixcraft)
  - [Project Background](#project-background)
  - [Features](#features)
  - [System Architecture](#system-architecture)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Environment Variables](#environment-variables)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/juihsuanlee0303/jay-bot.git
   cd jay-bot
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create and configure the `.env` file:

   ```bash
   cp .env.example .env
   ```

## Usage

1. Ensure the environment variables in the `.env` file are correctly configured.
2. Run the ticket purchasing script:

   ```bash
   node main.js
   ```

## Environment Variables

Configure the following environment variables in the `.env` file:

- `SID`: User session ID obtained from cookies.
- `ACTIVITY_ID`: Activity ID.
- `WINDOW_WIDTH`: Browser window width. (recommended: 1280)
- `WINDOW_HEIGHT`: Browser window height. (recommended: 720)
- `TICKET_COUNT`: Number of tickets to purchase.
- `TARGET_AREAS`: Target ticket areas, separated by commas.
- `START_TIME`: Start time in HH:MM format.
- `COUNTDOWN_INTERVAL`: Countdown interval in milliseconds.

Example `.env` file:

```env
SID=1234567890
ACTIVITY_ID=1234567890
WINDOW_WIDTH=1920
WINDOW_HEIGHT=1080
TICKET_COUNT=1
TARGET_AREAS=AREA_1,AREA_2,AREA_3
START_TIME=12:00
COUNTDOWN_INTERVAL=5000
```
