const { Client } = require('discord.js-selfbot-v13');
const keep_alive = require('./keep_alive.js');

// Comprehensive Rich Presence Configuration
const RICH_PRESENCE_CONFIG = {
  // Global settings
  interval: 30000, // Change interval in milliseconds
  
  // Array of rich presence configurations
  activities: [
    {
      // Discord Rich Presence Details
      status: "online", // online, idle, dnd, invisible
      
      // Activity Metadata
      type: 'PLAYING', // PLAYING, STREAMING, LISTENING, WATCHING, COMPETING
      name: "Home", // Main activity name
      
      // Detailed Rich Presence
      details: "Using discord... i think", // First line of details
      state: "Just chilling", // Second line of details
      
      // Large Image Settings
      largeImageKey: "default_large", // Image key from Discord Developer Portal
      largeImageText: "My Status", // Hover text for large image
      
      // Small Image Settings
      smallImageKey: "default_small", // Image key from Discord Developer Portal
      smallImageText: "Online", // Hover text for small image
      
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
  // Use your account token (VERY IMPORTANT: KEEP THIS PRIVATE!)
  token: process.env.token
};

// Create client instance
const client = new Client({ 
  checkUpdate: false // Disable update checking
});

// Function to set rich presence
function setRichPresence() {
  // Select a random activity configuration
  const activity = RICH_PRESENCE_CONFIG.activities[
    Math.floor(Math.random() * RICH_PRESENCE_CONFIG.activities.length)
  ];
  
  try {
    // Prepare rich presence
    const presenceData = {
      status: activity.status,
      activities: [{
        name: activity.name,
        type: activity.type,
        details: activity.details,
        state: activity.state,
        assets: {
          largeImageKey: activity.largeImageKey,
          largeImageText: activity.largeImageText,
          smallImageKey: activity.smallImageKey,
          smallImageText: activity.smallImageText
        },
        buttons: activity.buttons
      }]
    };
    
    // Set the presence
    client.user.setPresence(presenceData);
    
    console.log(`Updated Rich Presence: ${activity.name}`);
  } catch (error) {
    console.error("Error setting rich presence:", error);
  }
}

// Error handling
client.on('error', console.error);

// Ready event
client.on('ready', () => {
  console.log(`Self-bot is ready! Logged in as ${client.user.username}`);
  
  // Set initial rich presence
  setRichPresence();
  
  // Change rich presence periodically
  setInterval(setRichPresence, RICH_PRESENCE_CONFIG.interval);
});

// Login to the client
client.login(BOT_CONFIG.token);

// Export configurations for potential external modification
module.exports = {
  RICH_PRESENCE_CONFIG,
  BOT_CONFIG
};

// IMPORTANT DISCLAIMER:
// Self-bots are against Discord's Terms of Service.
// Using this script may result in account suspension.
// Use at your own risk.
