import { externalSupabase } from "@/integrations/externalSupabase/client";

export interface SupportTicketData {
  userId: string;
  subject: string;
  message: string;
}

export const supportService = {
  async createTicket(data: SupportTicketData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await externalSupabase
        .from("support_tickets")
        .insert({
          user_id: data.userId,
          subject: data.subject,
          message: data.message,
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create support ticket";
      console.error("Create support ticket error:", error);
      return { success: false, error: message };
    }
  },
};