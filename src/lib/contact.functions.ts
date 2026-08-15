import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Please enter a valid email').max(255, 'Email must be less than 255 characters'),
  topic: z.enum(['Routine guidance', 'Order help', 'Vending machine partnerships', 'Something else'], {
    message: 'Please select a topic',
  }),
  message: z.string().trim().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const submitContactForm = createServerFn({ method: 'POST' })
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: true }> => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    const { error } = await supabaseAdmin
      .from('contact_submissions' as any)
      .insert({
        name: data.name,
        email: data.email,
        topic: data.topic,
        message: data.message,
        source: 'website',
      });

    if (error) {
      console.error('Contact submission error:', error);
      throw new Error('Failed to send message. Please try again.');
    }

    return { success: true };
  });
