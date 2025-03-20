const { submitfxn } = require ('./polygonController');
const { handleApiError } = require('../../utils/errorHandler');


const getSolutions = async (req, res) => {
    try {
      console.log("get solutions hit", req.body);
      const { apiKey, secret, problemId, pin } = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId
      };
      
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.solutions');
      return res.status(200).json({
        status: "success",
        solutions: data.result
      });
    } catch (error) {
      handleApiError(error, res, "Failed to get solutions");
    }
  };
  
  const saveSolution = async (req, res) => {
    try {
      console.log("save solution hit", req.body);
      const { apiKey, secret, problemId, pin, name, file, sourceType, tag, checkExisting } = req.body;
      
      if (!name || !file) {
        return res.status(400).json({
          status: "failed",
          message: "Solution name and file content are required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        name: name,
        file: file
      };
      
      if (sourceType) params.sourceType = sourceType;
      if (tag) params.tag = tag;
      if (checkExisting) params.checkExisting = checkExisting;
      if (pin) params.pin = pin;
      
      await submitfxn(params, secret, 'problem.saveSolution');
      return res.status(200).json({
        status: "success",
        message: "Solution saved successfully"
      });
    } catch (error) {
      handleApiError(error, res, "Failed to save solution");
    }
  };
  
  const viewSolution = async (req, res) => {
    try {
      console.log("view solution hit", req.body);
      const { apiKey, secret, problemId, pin, name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          status: "failed",
          message: "Solution name is required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        name: name
      };
      
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.viewSolution');
      return res.status(200).json({
        status: "success",
        solutionContent: data
      });
    } catch (error) {
      handleApiError(error, res, "Failed to view solution");
    }
  };

module.exports={viewSolution,saveSolution,getSolutions}