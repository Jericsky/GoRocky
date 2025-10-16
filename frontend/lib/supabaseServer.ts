import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_Project_Url as string;
const supabaseAnonKey = process.env.SUPABASE_Anon_Key as string;

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);