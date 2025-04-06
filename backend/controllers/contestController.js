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
         const {error} = await supabase
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
         if(error) throw error;
         const {data,new_error} = await supabase.from("contests").select("*");
            if (new_error) throw new_error;
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

const addQuestions = async (req, res) => {
   const { questions, mcq } = req.body;
   const { id } = req.params;
   const MCQ = mcq;
   if (!questions) {
      return res.status(400).json({ message: "Please fill in all fields" });
   }
   try {
      const { data, error } = await supabase
         .from("contests")
         .update({ questions, MCQ })
         .eq("id", id);
      if (error) throw error;
      res.json(data);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding questions" });
   }
}

// Register for a contest
const registerContest = async (req, res) => {
   const { user_id } = req.body; // Assuming user_id is passed in the request body
   const { id: contest_id } = req.params; // Contest ID from the route parameter

   if (!user_id || !contest_id) {
      return res.status(400).json({ message: "User ID and Contest ID are required" });
   }

   try {
      const { data, error } = await supabase
         .from("registrations") // New table to store registrations
         .insert([{ user_id, contest_id }]);

      if (error) throw error;
      res.json({ message: "Successfully registered for the contest", data });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error registering for the contest" });
   }
};

const isUserRegistered = async (req, res) => {
   const { user_id } = req.query; // Assuming user_id is passed as a query parameter
   const { id: contest_id } = req.params; // Contest ID from the route parameter

   if (!user_id || !contest_id) {
      return res.status(400).json({ message: "User ID and Contest ID are required" });
   }

   try {
      const { data, error } = await supabase
         .from("registrations")
         .select("*")
         .eq("user_id", user_id)
         .eq("contest_id", contest_id);

      if (error) throw error;

      res.json({ isRegistered: data.length > 0 });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error checking registration status" });
   }
};

const getFinalRanklist = async (req, res) => {
   const { id: contest_id } = req.params;
   if(!contest_id) {
      return res.status(400).json({ message: "Contest ID is required" });
   }
   try {
      const { data, error } = await supabase
         .from("contest_submissions")
         .select("user_id, verdict")
         .eq("contest_id", contest_id);

      if (error) throw error;
      // res.json({data});
      // Process the data to create the final ranklist
      const ranklist = data.reduce((acc, submission) => {
         if (!acc[submission.user_id]) {
            acc[submission.user_id] = { score: 0, verdicts: [] };
         }
         acc[submission.user_id].verdicts.push(submission.verdict);
         console.log(submission);
         acc[submission.user_id].score += submission.verdict === "AC" ? 2 : -1;
         return acc;
      }, {});

      res.json({ranklist});
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching final ranklist" });
   }
}
module.exports = { getFinalRanklist, isUserRegistered, registerContest, getContests, addContest, getContest, addQuestions };
