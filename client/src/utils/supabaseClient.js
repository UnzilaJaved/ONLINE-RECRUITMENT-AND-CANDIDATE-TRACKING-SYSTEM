import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cjuqiolcffnoumhjeecy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdXFpb2xjZmZub3VtaGplZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDQ0MTYsImV4cCI6MjA5MzMyMDQxNn0.6Bq2fmFXNm5bRdSrZm2mnTttRCtF78lCVaW54MqWYfo";

export const supabase = createClient(supabaseUrl, supabaseKey);