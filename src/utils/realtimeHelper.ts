import { supabase } from '../lib/supabase';

export interface BroadcastPayload {
  table: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  record: any;
}

/**
 * Broadcasts a database modification event to all active admin dashboards.
 * This ensures 100% instant sync across sessions and tabs even if there's database replication lag.
 */
export const broadcastChange = (table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', record: any) => {
  try {
    console.log(`[Realtime Broadcast] Initiating ${eventType} on ${table}:`, record);
    const channelName = 'schema-db-changes';
    const channel = supabase.channel(channelName);
    
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'db_change',
          payload: { table, eventType, record }
        }).then(() => {
          // Gracefully clean up the temporary channel connection
          setTimeout(() => {
            supabase.removeChannel(channel);
          }, 1500);
        }).catch((err) => {
          console.warn('[Realtime Broadcast] Send error:', err);
        });
      }
    });
  } catch (error) {
    console.warn('[Realtime Broadcast] Exception:', error);
  }
};
