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
const getRandomDelay = () => Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
// const getRandomDelay = () => 2000;

// === RUNTIME STATE ===
let step = 0;
let conversationStartedAt = 0; // ms epoch — only accept replies after this
let waitingForReply = false; // true after we send a step
let sending = false; // prevent overlapping sends
const processedMsgIds = new Set();

// === HELPERS ===
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendStep() {
  if (sending) {
    console.log("⏳ Already sending, skipping...");
    return;
  }
  if (step >= conversation.length) {
    console.log("✅ Conversation finished");
    waitingForReply = false;
    return;
  }
  sending = true;

  const current = conversation[step];
  console.log(`📤 Sending step ${step + 1}/${conversation.length}: ${current.type} - ${current.type === 'text' ? current.content.substring(0, 50) + '...' : current.file}`);
  
  try {
    console.log("🔍 Attempting to send message...");
    
    if (current.type === "text") {
      await client.sendMessage(chatId, current.content);
      console.log("✅ Text message sent successfully");
    } else if (current.type === "image") {
      const media = MessageMedia.fromFilePath(current.file);
      await client.sendMessage(chatId, media);
      console.log("✅ Image sent successfully");
    }
    step += 1;

    waitingForReply = true;
    console.log("⏰ Now waiting for reply...");
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
    
    // If we get getChat errors, it's likely a session issue
    if (error.message.includes('getChat') || error.message.includes('undefined')) {
      console.log("💡 This looks like a WhatsApp Web session issue");
      console.log("🔧 Try: delete .wwebjs_auth folder, restart bot, scan QR again");
      process.exit(1); // Exit to allow manual session reset
    }
    
    console.log("🔄 Will retry after delay...");
    await sleep(10000);
    sending = false;
    await sendStep(); // Retry
    return;
  } finally {
    sending = false;
  }
}

// === EVENTS ===
client.on("qr", (qr) => {
  console.log("Scan this QR with WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("✅ Authenticated");
  console.log("⏳ Waiting for ready event...");
});

client.on("loading_screen", (percent, message) => {
  console.log(`🔄 Loading: ${percent}% - ${message}`);
});

client.on("disconnected", (reason) => {
  console.log("❌ Disconnected:", reason);
});

client.on("ready", async () => {
  console.log("✅ Client is ready");
  console.log(`📝 Conversation has ${conversation.length} steps`);

  // Add a small delay to ensure everything is settled
  await sleep(3000);
  
  conversationStartedAt = Date.now();
  waitingForReply = false;
  console.log("🚀 Starting conversation...");
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
  await sleep(getRandomDelay());
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

// Check if client is truly ready before starting
async function waitForClientReady() {
  let attempts = 0;
  const maxAttempts = 120; // 2 minutes max wait
  
  while (attempts < maxAttempts) {
    try {
      // Test if client can actually get chats (more thorough than getState)
      const chats = await client.getChats();
      console.log(`✅ Client fully ready - found ${chats.length} chats!`);
      return true;
    } catch (error) {
      attempts++;
      if (attempts % 10 === 0) { // Log every 10 attempts (10 seconds)
        console.log(`⏳ Client not ready yet, attempt ${attempts}/${maxAttempts}... (${error.message})`);
      }
      await sleep(1000);
    }
  }
  
  console.log("❌ Client failed to become ready after 2 minutes");
  return false;
}

// Force ready after timeout with proper checking
setTimeout(async () => {
  if (!conversationStartedAt) {
    console.log("⚠️  Ready event timeout - this might be a session issue");
    console.log("💡 Try deleting the .wwebjs_auth folder and scan QR again");
    console.log("🔄 Attempting to force start anyway...");
    
    conversationStartedAt = Date.now();
    waitingForReply = false;
    await sendStep();
  }
}, 45000); // Increased to 45 seconds
