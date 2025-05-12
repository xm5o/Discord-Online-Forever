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
      status: "idle", // online, idle, dnd, offline
      
      // Activity Metadata
      type: 0, // 0 = Game, 1 = Streaming, 2 = Listening, 3 = Watching
      name: "Home", // Main activity name
      
      // Detailed Rich Presence
      details: "Using discord... i think", // First line of details
      // state: "Developing Discord Bots", // Second line of details
      
      // Timestamps (optional)
      timestamps: {
        start: Date.now(), // Show elapsed time
        // end: null // Optional end time
      },
      
      // Large Image Settings
      // largeImage: {
      //   key: "main_logo", // Image key from Discord Developer Portal
      //   text: "Developer Mode" // Hover text for large image
      // },
      
      // Small Image Settings
      // smallImage: {
      //   key: "status_icon", // Image key from Discord Developer Portal
      //   text: "Active Coding" // Hover text for small image
      // },
      
      // Buttons (max 2 buttons allowed)
      buttons: [
        {
          label: "GitHub Profile",
          url: "https://github.com/xm5o"
        }
      ]
    }
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
const bot = new Eris(BOT_CONFIG.token, { intents: BOT_CONFIG.intents });

// Function to set rich presence
function setRichPresence() {
  // Select a random activity configuration
  const activity = RICH_PRESENCE_CONFIG.activities[
    Math.floor(Math.random() * RICH_PRESENCE_CONFIG.activities.length)
  ];
  
  try {
    // Prepare activity object for Eris
    const presenceData = {
      status: activity.status,
      game: {
        name: activity.name,
        type: activity.type,
        details: activity.details,
        state: activity.state,
        
        // Timestamps
        timestamps: activity.timestamps ? {
          start: activity.timestamps.start,
          end: activity.timestamps.end
        } : undefined,
        
        // Assets (images)
        // assets: {
        //   large_image: activity.largeImage ? activity.largeImage.key : undefined,
        //   large_text: activity.largeImage ? activity.largeImage.text : undefined,
        //   small_image: activity.smallImage ? activity.smallImage.key : undefined,
        //   small_text: activity.smallImage ? activity.smallImage.text : undefined
        // },
        
        // Buttons
        // buttons: activity.buttons || []
      }
    };
    
    // Set the presence
    bot.editStatus(presenceData.status, presenceData.game);
    
    console.log(`Updated Rich Presence: ${activity.name}`);
  } catch (error) {
    console.error("Error setting rich presence:", error);
  }
}

// Error handling
bot.on("error", (err) => {
  console.error("Bot encountered an error:", err);
});

// Ready event
bot.on("ready", () => {
  console.log(`Bot is ready! Logged in as ${bot.user.username}`);
  
  // Set initial rich presence
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
