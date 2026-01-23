import { externalSupabase } from "@/integrations/externalSupabase/client";

export interface FeedbackData {
  userId: string;
  rating: number | null;
  message: string;
}

export const feedbackService = {
  async submitFeedback(data: FeedbackData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await externalSupabase
        .from("feedback")
        .insert({
          user_id: data.userId,
          rating: data.rating,
          message: data.message,
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit feedback";
      console.error("Submit feedback error:", error);
      return { success: false, error: message };
    }
  },
};