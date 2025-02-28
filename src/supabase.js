import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jpvttzcxpsqnjrrsrmdg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdnR0emN4cHNxbmpycnNybWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjQ3NDYsImV4cCI6MjA1NjI0MDc0Nn0.atFTDe41LEE6mIRBRb9bI13hVfQNWXSaJDCx1NulHFQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
