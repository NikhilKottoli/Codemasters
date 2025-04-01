const { submitfxn } = require ('./polygonController');
const { handleApiError } = require('../../utils/errorHandler');

  const getChecker = async (req, res) => {
    try {
      console.log("get checker hit", req.body);
      const { apiKey, secret, problemId, pin } = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId
      };
      
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.checker');
      return res.status(200).json({
        status: "success",
        checker: data.result
      });
    } catch (error) {
      handleApiError(error, res, "Failed to get checker");
    }
  };
  
  const setChecker = async (req, res) => {
    try {
      console.log("set checker hit", req.body);
      const { apiKey, secret, problemId, pin, checker } = req.body;
      
      if (!checker) {
        return res.status(400).json({
          status: "failed",
          message: "Checker name is required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        checker: checker
      };
      
      if (pin) params.pin = pin;
      
      await submitfxn(params, secret, 'problem.setChecker');
      return res.status(200).json({
        status: "success",
        message: "Checker set successfully"
      });
    } catch (error) {
      handleApiError(error, res, "Failed to set checker");
    }
  };
  

  module.exports={getChecker,setChecker};