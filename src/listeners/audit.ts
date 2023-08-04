import { Channel, GuildBan, PartialMessage, Message, Role, Invite, Emoji, StageInstance, ThreadChannel, TextChannel, Collection, Snowflake, GuildMember, PartialGuildMember } from 'discord.js';
import TommyClient from '../tommy-client';

export default async (client: TommyClient): Promise<void> => {
    const channelId = '1136914094880981034';
    const channelId2 = '1136506797709066350';
    client.on('channelCreate', async (channel: Channel) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`📁 A new channel was created: ${channel.id}`);
    });

    client.on('channelDelete', async (channel: Channel) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`❌ A channel was deleted: ${channel.id}`);
    });

    client.on('channelUpdate', async (oldChannel: Channel, newChannel: Channel) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`🔄 A channel was updated: ${oldChannel.id} to ${newChannel.id}`);
    });

    client.on('guildBanAdd', async (ban: GuildBan) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`🔨 ${ban.user.username} was banned`);
    });

    client.on('guildBanRemove', async (ban: GuildBan) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`🔓 ${ban.user.username} was unbanned`);
    });

    client.on('roleCreate', async (role: Role) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`💼 A role was created: ${role.name}`);
    });

    client.on('roleDelete', async (role: Role) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`❌ A role was deleted: ${role.name}`);
    });

    client.on('inviteCreate', async (invite: Invite) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`💌 ${invite.inviter?.username} created an invite: ${invite.code}`);
    });

    client.on('inviteDelete', async (invite: Invite) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`❌ An invite was deleted: ${invite.code}`);
    });

    client.on('messageDelete', async (message: Message | PartialMessage) => {
        if (message.partial) {
             await (client.channels.cache.get(channelId) as TextChannel).send(`🗑️ A message was deleted: ${message.id}`);
        } else {
             await (client.channels.cache.get(channelId) as TextChannel).send(`🗑️ ${message.author?.username} deleted a message: ${message.content}`);
        }
    });

    client.on('emojiCreate', async (emoji: Emoji) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`😃 An emoji was created: ${emoji.name}`);
    });

    client.on('emojiDelete', async (emoji: Emoji) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`😭 An emoji was deleted: ${emoji.name}`);
    });

    client.on('emojiUpdate', async (oldEmoji: Emoji, newEmoji: Emoji) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`😃 An emoji was updated: ${oldEmoji.name} to ${newEmoji.name}`);
    });

    client.on('stageInstanceCreate', async (stageInstance: StageInstance) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`🎤 A stage instance was created: ${stageInstance.id}`);
    });

    client.on('stageInstanceDelete', async (stageInstance: StageInstance) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`❌ A stage instance was deleted: ${stageInstance.id}`);
    });

    client.on('stageInstanceUpdate', async (oldStageInstance: StageInstance | null, newStageInstance: StageInstance) => {
        if(oldStageInstance && newStageInstance) {
             await (client.channels.cache.get(channelId) as TextChannel).send(`🔄 A stage instance was updated: ${oldStageInstance.id} to ${newStageInstance.id}`);
        }
    });


    client.on('threadCreate', async (thread: ThreadChannel) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`🧵 A thread was created: ${thread.name || thread.id}`);
    });

    client.on('threadDelete', async (thread: ThreadChannel) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`❌ A thread was deleted: ${thread.name || thread.id}`);
    });

    client.on('threadUpdate', async (oldThread: ThreadChannel, newThread: ThreadChannel) => {
         await (client.channels.cache.get(channelId) as TextChannel).send(`🔄 A thread was updated: ${oldThread.name || oldThread.id} to ${newThread.name || newThread.id}`);
    });

    client.on('guildMemberUpdate', async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) => {
        // Get role collections
        const oldRoles: Collection<Snowflake, Role> = oldMember.roles.cache;
        const newRoles: Collection<Snowflake, Role> = newMember.roles.cache;

        // Find if there was an addition or removal
        const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
        const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

        if (addedRoles.size) {
            await (client.channels.cache.get(channelId) as TextChannel).send(`Role(s) ${Array.from(addedRoles.values()).map(r => r.name).join(', ')} was added to ${newMember.user.username}`);
        }
        if (removedRoles.size) {
            await (client.channels.cache.get(channelId) as TextChannel).send(`Role(s) ${Array.from(removedRoles.values()).map(r => r.name).join(', ')} was removed from ${newMember.user.username}`);
        }
    });

    client.on('guildMemberAdd', async (member: GuildMember | PartialGuildMember) => {
        await (client.channels.cache.get(channelId) as TextChannel).send(`${member.user.username} has joined the server.`);
        await (client.channels.cache.get(channelId2) as TextChannel).send(`${member.user.username} has joined the server.`);


    });
    client.on('guildMemberRemove', async (member: GuildMember | PartialGuildMember) => {
        await (client.channels.cache.get(channelId) as TextChannel).send(`${member.user.username} has left the server.`);
        await (client.channels.cache.get(channelId2) as TextChannel).send(`${member.user.username} has left the server.`);


    });
    
};