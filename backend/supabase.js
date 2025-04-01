require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;


if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase credentials are missing! Check your .env file.");
  process.exit(1); // Exit if credentials are missing
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    const { data, error } = await supabase.from('questions').select('*').limit(1);
    if (error) throw error;
    console.log("✅ Supabase connection successful!)");
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
  }
})();

module.exports = {supabase};
