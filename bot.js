const conversation = require("./coversations");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "local-bot" }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// === CONFIG ===
const chatId = "917075471676@c.us"; // target user
const MIN_DELAY_AFTER_REPLY_MS = 2500;

// === RUNTIME STATE ===
let step = 0;
let conversationStartedAt = 0; // ms epoch — only accept replies after this
let waitingForReply = false; // true after we send a step
let sending = false; // prevent overlapping sends
const processedMsgIds = new Set();

// === HELPERS ===
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendStep() {
  if (sending) return;
  if (step >= conversation.length) {
    console.log("✅ Conversation finished");
    waitingForReply = false;
    return;
  }
  sending = true;

  const current = conversation[step];
  try {
    if (current.type === "text") {
      await client.sendMessage(chatId, current.content);
    } else if (current.type === "image") {
      const media = MessageMedia.fromFilePath(current.file);
      await client.sendMessage(chatId, media);
    }
    step += 1;

    waitingForReply = true;
  } finally {
    sending = false;
  }
}

// === EVENTS ===
client.on("qr", (qr) => {
  console.log("Scan this QR with WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => console.log("✅ Authenticated"));

client.on("ready", async () => {
  console.log("✅ Client is ready");

  conversationStartedAt = Date.now();
  waitingForReply = false;
  await sendStep();
});

// Only react to *incoming* messages from the target user
client.on("message", async (msg) => {
  // Guard: correct chat + not our own message
  if (msg.from !== chatId) return;
  if (msg.fromMe) return;

  // Only handle messages **newer** than our start ime
  const msgTimeMs = (msg.timestamp || 0) * 1000;
  if (!conversationStartedAt || msgTimeMs < conversationStartedAt) return;

  const id =
    (msg.id && (msg.id._serialized || msg.id.id)) || `${msgTimeMs}:${msg.from}`;
  if (processedMsgIds.has(id)) return;
  processedMsgIds.add(id);

  if (!waitingForReply) return;

  waitingForReply = false;
  await sleep(MIN_DELAY_AFTER_REPLY_MS);
  await sendStep();
});

// (Optional) For debugging, you can see both incoming/outgoing creates:
client.on("message_create", (m) => {
  console.log("message_create", {
    fromMe: m.fromMe,
    from: m.from,
    body: m.body,
  });
});

client.initialize();
