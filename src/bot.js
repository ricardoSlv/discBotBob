//@ts-check
'use strict'

import executeInteraction from './interaction.js'
import executeCommand from './command.js'

import dotenv from 'dotenv'
dotenv.config()
import { Client } from 'discord.js'

const client = new Client()

client.on('ready', () => {
  console.log(`${client.user.username} has logged in`)
})

client.on('message', async (message) => {
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
