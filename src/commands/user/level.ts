import { CommandInteraction, Interaction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { prisma } from "@/lib/prisma";
import { xpInfo } from "@/utils/user";

module.exports = {
    data: new SlashCommandBuilder().setName("level").setDescription("Get your current level"),
    async execute(interaction: CommandInteraction) {
        const user = await prisma.user.findUnique({
            where: {
                id: interaction.user.id,
            },
        });
        if (!user) {
            await interaction.reply({
                content: "No profile info",
                ephemeral: true,
            });
            return;
        }

        const info = xpInfo(user?.experience);

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s level info`)
            .setColor("#8f46e8")
            .addFields(
                { name: "Current Level", value: `${info.currentLevel}` },
                {
                    name: "Current Experience",
                    value: `${info.xpThisLevel} / ${info.nextLevelXP}\n${createProgressBar((info.xpThisLevel / info.nextLevelXP) * 100, 20)}`,
                },
                { name: "Experience until next level", value: `${info.xpRemaining}` }
            );
        await interaction.reply({
            embeds: [embed],
        });
    },
};

function createProgressBar(percent: number, width: number) {
    const filledChar = "\u2593";
    const emptyChar = "\u2591";

    const filledCount = Math.floor((percent * width) / 100);
    const emptyCount = width - filledCount;

    const progressBar = filledChar.repeat(filledCount) + emptyChar.repeat(emptyCount);

    return progressBar;
}
