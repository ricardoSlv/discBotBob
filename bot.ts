import dotenv from 'dotenv'
dotenv.config()

import { Client, Events, GatewayIntentBits } from 'discord.js'
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
})

import executeInteraction from './src/interaction.js'
import executeCommand from './src/command.js'

client.on(Events.ClientReady, () => {
  console.log(`${client?.user?.username} has logged in`)
})

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot === true) return

  console.log(`${message.author.tag} said: ${message.content}`)

  try {
    executeInteraction(message)
    executeCommand(message)
  } catch (error) {
    message.reply(`An error has occurred processing the message ${error}`)
  }
})

client.login(process.env.BOT_TOKEN)
