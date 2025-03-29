const {supabase} = require("../supabase");

// Get all contests
const getContests = async (req, res) => {
   try {
      const { data, error } = await supabase
      .from("contests")
      .select("*");
      if (error) throw error;
      res.json(data);
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Error fetching contests" });
      }
};

// Add a Contest
const addContest = async (req, res) => {
   const {
      name, 
      desc, 
      public,
      start_time,
      end_time
   } = req.body;

   if(!name || !desc || !public || !start_time || !end_time) {
      return res.status(400).json({ message: "Please fill in all fields" });
      }
      try {
         const { data, error } = await supabase
         .from("contests")
         .insert([
            {
               name,
               desc,
               public,
               start_time,
               end_time
            }
         ]);
            if (error) throw error;
            res.json(data);
            } catch (error) {
               console.error(error);
               res.status(500).json({ message: "Error adding contest" });
               }
};
   

// Get a contest
const getContest = async (req, res) => {
   try {
      const { data, error } = await supabase
      .from("contests")
      .select("*")
      .eq("id", req.params.id);
      if (error) throw error;
      res.json(data);
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Error fetching contest" });
      }
};

module.exports = { getContests, addContest, getContest };
