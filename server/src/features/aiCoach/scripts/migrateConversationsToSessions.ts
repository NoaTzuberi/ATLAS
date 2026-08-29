/**
 * One-off migration: copies the old single-document-per-user `conversations`
 * collection into the new `conversationsessions` collection (one document per
 * session — see conversation.model.ts). Run manually via `npx tsx` after
 * deploying the session-based schema. Safe to re-run: skips users who already
 * have a migrated session with the same startedAt. Does not delete the old
 * `conversations` collection — leaves it in place as a backup.
 */
import mongoose from 'mongoose';
import { connectDatabase } from '../../../config/database';
import { ConversationSession } from '../conversation.model';

async function main() {
  await connectDatabase();
  const db = mongoose.connection.db!;
  const oldConversations = await db.collection('conversations').find({}).toArray();

  let migrated = 0;
  let skipped = 0;

  for (const doc of oldConversations) {
    const messages = doc.messages ?? [];
    const startedAt = messages[0]?.timestamp ?? doc._id.getTimestamp();
    const lastMessageAt = messages[messages.length - 1]?.timestamp ?? startedAt;

    const alreadyMigrated = await ConversationSession.findOne({ userId: doc.userId, startedAt });
    if (alreadyMigrated) {
      skipped += 1;
      continue;
    }

    await ConversationSession.create({
      userId: doc.userId,
      startedAt,
      lastMessageAt,
      messages,
    });
    migrated += 1;
  }

  console.log(`Migrated ${migrated} conversation(s), skipped ${skipped} already-migrated.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error('migrateConversationsToSessions failed:', error);
  process.exitCode = 1;
});
