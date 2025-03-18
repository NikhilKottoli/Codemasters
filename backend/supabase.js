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


const supabaseUrl1 = process.env.SUPABASE_URL1;
const supabaseKey1 = process.env.SUPABASE_KEY1;


if (!supabaseUrl1 || !supabaseKey1) {
  console.error("❌ Supabase credentials are missing! Check your .env file.");
  process.exit(1); // Exit if credentials are missing
}

const supabase1 = createClient(supabaseUrl1, supabaseKey1);

(async () => {
  try {
    const { data, error } = await supabase1.from('contests').select('*').limit(1);
    if (error) throw error;
    console.log("✅ Supabase1 connection successful!)");
  } catch (err) {
    console.error("❌ Supabase1 connection failed:", err.message);
  }
})();

module.exports = {supabase, supabase1};
