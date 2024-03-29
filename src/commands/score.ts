import {
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandBuilder,
  SlashCommandUserOption,
} from 'discord.js'
import CommandInterface from './interface.js'
import InteractionObserver from './interactionobserver.js'
import global from '../global.js'
import {
  Database
} from '../firebase/database.js'

const Score: CommandInterface = {
  name: 'score',
  description: 'Shows the given user\'s current score.',
  data: new SlashCommandBuilder()
    .addUserOption((option: SlashCommandUserOption ): SlashCommandUserOption => option
      .setName('user')
      .setDescription('The user to check the score of.')
    ),
  async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    const targetUserOption = interaction.options.getUser('user', false)
    const observer = new InteractionObserver(interaction)

    //if (interaction.guild.id !== global.arrasDiscordId) return await observer.abort(3)
    let targetUser: string = targetUserOption.id ?? interaction.user.id

    let user = Database.users.get(targetUser)
    console.log(user.data.scoregame)
    let cooldown: number = Math.floor((Date.now() - user.data.scoregame.data.cooldown.score) / 1e3)
    console.log(cooldown)
    if (cooldown < 60) {
      interaction.reply(`This command is on cooldown for **${60 - cooldown} seconds**`)
      return
    } else {
      interaction.reply(`Your current balance is **${user.data.scoregame.data.score.toLocaleString()}**`)
      await user.misc.scoreGame.setCooldown(interaction.guild, 'score', Date.now())
    }
  },
  test(): boolean {
    return true
  },
}

export default Score