const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "local-bot" }),
  puppeteer: {
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

const chatId = "917075471676@c.us";

// Conversation steps (predefined)
const conversation = [
  { type: "text", content: "clear context" },
  { type: "text", content: "hi" },
  { type: "text", content: "/dashboard" },
  { type: "text", content: "/tutorials" },
  { type: "text", content: "cancel my subscription" },
  { type: "text", content: "what is my name" },
  { type: "text", content: "who are u" },
  { type: "text", content: "upgrade my subscription" },
  { type: "text", content: "what can u do" },
  { type: "text", content: "what is time" },
  { type: "text", content: "downgrade my subscription" },
  { type: "text", content: "list my todos" },
  {
    type: "text",
    content:
      "create a todo list called engineering and add ACD, DSA, WEB DEV, AI to it",
  },
  {
    type: "text",
    content: "add CNEH to engineering list",
  },
  {
    type: "text",
    content:
      "add to car cleaning todo list - wheel alignment, car wash, mat cleanup",
  },
  {
    type: "text",
    content: "mark ACD as done",
  },
  {
    type: "text",
    content: "list all my todos",
  },
  {
    type: "text",
    content: "show engineering list",
  },
  {
    type: "text",
    content: "delete car cleaning list",
  },
  {
    type: "text",
    content:
      "add to car cleaning todo list - wheel alignment, car wash, mat cleanup",
  },
  {
    type: "text",
    content:
      "add to car cleaning todo list - wheel alignment, car wash, mat cleanup",
  },
  { type: "text", content: "remind me to go to clg tomorrow at 10am" },
  { type: "text", content: "remind me to go on a walk at 14 H" },
  { type: "text", content: "remind mom to take tablet in 10mins" },
  { type: "text", content: "remind Tharun anna to take sleep in 20 mins" },
  {
    type: "text",
    content:
      "draft an email to sparkscj110@gmail.com, that we have party tomorrow",
  },
  { type: "text", content: "send this mail" },
  { type: "image", file: "./images/test1.jpg" },
  {
    type: "text",
    content: "add this to drive",
  },
  {
    type: "text",
    content: "list my reminder",
  },
  {
    type: "text",
    content: "remind me everyday at 10am to drink 1 liter of water",
  },
];

let step = 0;
let lastReplyTime = 0;

client.on("qr", (qr) => {
  console.log("Scan this QR with WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => console.log("✅ Authenticated"));

client.on("ready", async () => {
  console.log("✅ Client is ready");

  await sendStep();
});

client.on("message", async (msg) => {
  if (msg.from !== chatId) return;

  lastReplyTime = Date.now();

  setTimeout(async () => {
    await sendStep();
  }, 500);
});

async function sendStep() {
  if (step >= conversation.length) {
    console.log("✅ Conversation finished");
    return;
  }

  const current = conversation[step];

  if (current.type === "text") {
    await client.sendMessage(chatId, current.content);
  } else if (current.type === "image") {
    const media = MessageMedia.fromFilePath(current.file);
    await client.sendMessage(chatId, media, { caption: current.caption });
  }

  step++;
}

client.initialize();
