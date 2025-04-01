const { submitfxn } = require ('./polygonController');
const { handleApiError } = require('../../utils/errorHandler');

const getStatements = async (req, res) => {
    try {
      console.log("get statements hit", req.body);
      const { apiKey, secret, problemId, pin } = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId
      };
      
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.statements');
      return res.status(200).json({
        status: "success",
        statements: data.result
      });
    } catch (error) {
      handleApiError(error, res, "Failed to get statements");
    }
  };
  
  const saveStatement = async (req, res) => {
    try {
      console.log("save statement hit", req.body);
      const { apiKey, secret, problemId, pin, lang, ...statementData } = req.body;
      
      if (!lang) {
        return res.status(400).json({
          status: "failed",
          message: "Statement language is required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        lang: lang // This includes name, legend, input, output, etc.
      };

      //add the values to the params only if the valus is not empyt

      for (const [key, value] of Object.entries(statementData)) {
        if (value) {
          params[key] = value;
        }
      }

      

      if (pin) params.pin = pin;
      console.log("save statement params", params);
      
      
      const response=await submitfxn(params, secret, 'problem.saveStatement');
      return res.status(200).json({
        status: "success",
        message: "Statement saved successfully",
        response: response
      });
    } catch (error) {
      handleApiError(error, res, "Failed to save statement");
    }
  };

  module.exports={saveStatement,getStatements}
  