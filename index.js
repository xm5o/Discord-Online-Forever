const Eris = require("eris");
const keep_alive = require('./keep_alive.js');

// Configuration object for easy customization
const CONFIG = {
  // Bot token (preferably set as an environment variable)
  TOKEN: process.env.token,
  
  // Custom game activities
  ACTIVITIES: [
    { name: "with code", type: 0 },
    { name: "Discord Bot", type: 0 },
    { name: "Coding Adventures", type: 0 }
  ],
  
  // Activity change interval (in milliseconds)
  ACTIVITY_CHANGE_INTERVAL: 60000, // 1 minute
  
  // Command prefix
  PREFIX: '!'
};

// Create the bot instance
const bot = new Eris(CONFIG.TOKEN);

// Function to set a random game activity
function setRandomActivity() {
  const activity = CONFIG.ACTIVITIES[Math.floor(Math.random() * CONFIG.ACTIVITIES.length)];
  bot.editStatus("online", activity);
}

// Error handling
bot.on("error", (err) => {
  console.error("Bot encountered an error:", err);
});

// Ready event
bot.on("ready", () => {
  console.log(`Bot is ready! Logged in as ${bot.user.username}`);
  
  // Set initial activity
  setRandomActivity();
  
  // Change activity periodically
  setInterval(setRandomActivity, CONFIG.ACTIVITY_CHANGE_INTERVAL);
});

// Command to add a new activity
bot.on("messageCreate", async (msg) => {
  // Ignore messages from bots and messages without prefix
  if (msg.author.bot || !msg.content.startsWith(CONFIG.PREFIX)) return;
  
  const args = msg.content.slice(CONFIG.PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  // Add activity command
  if (command === "addactivity") {
    const activityName = args.join(" ");
    if (!activityName) {
      return msg.channel.createMessage("Please provide an activity name!");
    }
    
    CONFIG.ACTIVITIES.push({ name: activityName, type: 0 });
    msg.channel.createMessage(`Added new activity: "${activityName}"`);
  }
  
  // List activities command
  if (command === "listactivities") {
    const activitiesList = CONFIG.ACTIVITIES.map((activity, index) => 
      `${index + 1}. ${activity.name}`
    ).join("\n");
    msg.channel.createMessage(`Current Activities:\n${activitiesList}`);
  }
  
  // Remove activity command
  if (command === "removeactivity") {
    const index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= CONFIG.ACTIVITIES.length) {
      return msg.channel.createMessage("Invalid activity index!");
    }
    
    const removedActivity = CONFIG.ACTIVITIES.splice(index, 1)[0];
    msg.channel.createMessage(`Removed activity: "${removedActivity.name}"`);
  }
});

// Interactive buttons for activity management
bot.on("interactionCreate", async (interaction) => {
  if (!interaction.type === Eris.Constants.InteractionTypes.MESSAGE_COMPONENT) return;
  
  // Activity management buttons
  if (interaction.data.custom_id === "add_activity") {
    await interaction.createModal({
      title: "Add New Activity",
      custom_id: "add_activity_modal",
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: "activity_name",
              label: "Activity Name",
              style: 1,
              type: "text_input",
              required: true
            }
          ]
        }
      ]
    });
  }
});

// Modal submit handler
bot.on("interactionCreate", async (interaction) => {
  if (!interaction.type === Eris.Constants.InteractionTypes.MODAL_SUBMIT) return;
  
  if (interaction.data.custom_id === "add_activity_modal") {
    const activityName = interaction.data.components[0].components[0].value;
    
    CONFIG.ACTIVITIES.push({ name: activityName, type: 0 });
    
    await interaction.createMessage({
      content: `Added new activity: "${activityName}"`,
      flags: 64 // Ephemeral message
    });
  }
});

// Command to send activity management buttons
bot.on("messageCreate", async (msg) => {
  if (msg.content.startsWith(`${CONFIG.PREFIX}activitymanager`)) {
    const buttons = {
      type: 1,
      components: [
        {
          type: 2,
          label: "Add Activity",
          style: 1,
          custom_id: "add_activity"
        }
      ]
    };
    
    msg.channel.createMessage({
      content: "Manage Bot Activities",
      components: [buttons]
    });
  }
});

// Connect the bot
bot.connect();
