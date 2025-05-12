const Eris = require("eris");
const keep_alive = require('./keep_alive.js');

// Comprehensive Rich Presence Configuration
const RICH_PRESENCE_CONFIG = {
  // Global settings
  interval: 30000, // Change interval in milliseconds
  
  // Array of rich presence configurations
  activities: [
    {
      // Discord Rich Presence Details
      status: "online", // online, idle, dnd, offline
      
      // Activity Metadata
      type: 0, // 0 = Game, 1 = Streaming, 2 = Listening, 3 = Watching
      name: "Home", // Main activity name
      
      // Detailed Rich Presence
      details: "Using discord... i think", // First line of details
      state: "Just chilling", // Second line of details
      
      // Timestamps (optional)
      timestamps: {
        start: Date.now(), // Show elapsed time
      },
      
      // Large Image Settings
      largeImage: {
        key: "default_large", // Image key from Discord Developer Portal
        text: "My Status" // Hover text for large image
      },
      
      // Small Image Settings
      smallImage: {
        key: "default_small", // Image key from Discord Developer Portal
        text: "Online" // Hover text for small image
      },
      
      // Buttons (max 2 buttons allowed)
      buttons: [
        {
          label: "GitHub Profile",
          url: "https://github.com/xm5o"
        }
      ]
    }
  ]
};

// Bot Configuration
const BOT_CONFIG = {
  token: process.env.token,
  intents: [
    "guilds",
    "guildMessages"
  ]
};

// Create bot instance with specified intents
const bot = new Eris(BOT_CONFIG.token, { 
  intents: BOT_CONFIG.intents,
  // Add this to ensure proper presence capabilities
  getAllUsers: true,
  messageLimit: 0,
  maxShards: 1
});

// Function to set rich presence
function setRichPresence() {
  // Select a random activity configuration
  const activity = RICH_PRESENCE_CONFIG.activities[
    Math.floor(Math.random() * RICH_PRESENCE_CONFIG.activities.length)
  ];
  
  try {
    // Construct activity object specifically for Eris
    const activityObject = {
      name: activity.name,
      type: activity.type,
      url: activity.type === 1 ? "https://www.twitch.tv/discord" : undefined
    };

    // Define additional details for rich presence
    const richPresenceDetails = {
      details: activity.details,
      state: activity.state,
      timestamps: activity.timestamps ? {
        start: activity.timestamps.start
      } : undefined,
      assets: {
        large_image: activity.largeImage ? activity.largeImage.key : undefined,
        large_text: activity.largeImage ? activity.largeImage.text : undefined,
        small_image: activity.smallImage ? activity.smallImage.key : undefined,
        small_text: activity.smallImage ? activity.smallImage.text : undefined
      },
      buttons: activity.buttons || []
    };

    // Merge additional details into activity object
    Object.assign(activityObject, richPresenceDetails);

    // Set the presence with detailed information
    bot.editStatus(activity.status, activityObject);
    
    console.log(`Updated Rich Presence: ${activity.name}`);
  } catch (error) {
    console.error("Error setting rich presence:", error);
  }
}

// Error handling
bot.on("error", (err) => {
  console.error("Bot encountered an error:", err);
});

// Warn about potential issues
bot.on("warn", (message) => {
  console.warn("Bot warning:", message);
});

// Debug logging
bot.on("debug", (message) => {
  console.log("Bot debug:", message);
});

// Ready event
bot.on("ready", () => {
  console.log(`Bot is ready! Logged in as ${bot.user.username}`);
  
  // Ensure presence is set immediately
  setRichPresence();
  
  // Change rich presence periodically
  setInterval(setRichPresence, RICH_PRESENCE_CONFIG.interval);
});

// Connect the bot
bot.connect();

// Export configurations for potential external modification
module.exports = {
  RICH_PRESENCE_CONFIG,
  BOT_CONFIG
};
