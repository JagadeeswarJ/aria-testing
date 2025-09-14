const conversation = [
  // Core System Features
  { type: "text", content: "clear context" },
  { type: "text", content: "hi" },
  { type: "text", content: "who are u" },
  { type: "text", content: "what can u do" },

  // Navigation & Commands
  { type: "text", content: "/dashboard" },
  { type: "text", content: "/tutorials" },

  // Subscription Management
  { type: "text", content: "cancel my subscription" },
  { type: "text", content: "upgrade my subscription" },
  { type: "text", content: "downgrade my subscription" },

  // User Profile & Settings
  { type: "text", content: "what is my name" },
  { type: "text", content: "what is time" },
  { type: "text", content: "change my timezone to EST" },
  { type: "text", content: "set timezone to IST" },
  { type: "text", content: "what is my time now" },

  // Todo Management
  { type: "text", content: "list my todos" },
  {
    type: "text",
    content: "create a todo list called engineering and add ACD, DSA, WEB DEV, AI to it",
  },
  { type: "text", content: "add CNEH to engineering list" },
  {
    type: "text",
    content: "add to car cleaning todo list - wheel alignment, car wash, mat cleanup",
  },
  { type: "text", content: "mark ACD as done" },
  { type: "text", content: "list all my todos" },
  { type: "text", content: "show engineering list" },
  { type: "text", content: "delete car cleaning list" },

  // Reminders & Notifications
  { type: "text", content: "remind me to go to clg tomorrow at 10am" },
  { type: "text", content: "remind me to go on a walk at 14 H" },
  { type: "text", content: "remind dad to take tablet in 10mins" },
  { type: "text", content: "remind dad to go on a walk in 4H" },
  { type: "text", content: "remind me everyday at 10am to drink 1 liter of water" },
  { type: "text", content: "remind mom to take tablet 2H" },
  { type: "text", content: "remind Chaitanya to go to gym in 1H" },
  { type: "text", content: "remind family circle to eat dinner at 8pm" },
  { type: "text", content: "remind me to go on a walk in 10min" },
  { type: "text", content: "change it to 30mins from now" },
  { type: "text", content: "list my reminder" },

  // Contact & Circle Management
  { type: "text", content: "list my contacts" },
  { type: "text", content: "list my circles" },
  { type: "text", content: "send message to dad saying take tablets" },

  // Email Management
  {
    type: "text",
    content: "draft an email to sparkscj110@gmail.com, that we have party tomorrow",
  },
  { type: "text", content: "send this mail" },

  // File & Document Management
  { type: "image", file: "./images/leetcode24.png" },
  { type: "text", content: "analyze this screenshot" },
  { type: "document", file: "./images/Online Registration Guidelines.pdf" },
  { type: "text", content: "summarize this document" },
  { type: "text", content: "add this to drive" },

  // Search & Information Retrieval
  { type: "text", content: "search for latest iPhone 15 reviews" },
  { type: "text", content: "google search React best practices 2024" },
  { type: "text", content: "google search TypeScript migration guide" },
  { type: "text", content: "search Google for Node.js security updates" },
  { type: "text", content: "find information about AI trends 2025" },
  { type: "text", content: "google search Python async programming" },

  // Meeting & Calendar Management
  { type: "text", content: "create a Google Meet link for now" },
  { type: "text", content: "generate meet link for tomorrow's standup" },
  { type: "text", content: "schedule team meeting with meet link for Friday 10am" },
  {
    type: "text",
    content: "add to calendar: appointment for dentist tomorrow 3pm",
  },
  { type: "text", content: "calendar event team meeting Friday 10am" },
  {
    type: "text",
    content: "add to calendar lunch with colleague next Tuesday",
  },
  { type: "text", content: "appointment at 9am for medical checkup" },
  { type: "text", content: "add gym session to my calendar Monday 6pm" },

  // Daily Summary & Configuration
  { type: "text", content: "set daily summary time to 22:00" },
  { type: "text", content: "disable my daily summary" },

  // Task & Workflow Management
  { type: "text", content: "create a workflow for morning routine" },
  { type: "text", content: "automate daily standup notification" },

  // Data & Analytics
  { type: "text", content: "show my productivity stats" },
  { type: "text", content: "export my data" },

  // Integration & Sync
  { type: "text", content: "sync with Google Calendar" },
  { type: "text", content: "connect to Slack workspace" },

  // Voice & Audio
  { type: "text", content: "play my favorite playlist" },
  { type: "text", content: "record voice note" },

  // Location & Weather
  { type: "text", content: "what's the weather today" },
  { type: "text", content: "find nearby restaurants" },
];

module.exports = conversation;
