const { submitfxn } = require ('./polygonController');
const { handleApiError } = require('../../utils/errorHandler');


const createProblem = async (req, res) => {
    try {
      console.log("create problem hit", req.body);
      const { apiKey, secret, name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          status: "failed",
          message: "Problem name is required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        name: name
      };
      
      const data = await submitfxn(params, secret, 'problem.create');
      return res.status(201).json({
        status: "success",
        message: "Problem created successfully",
        problem: data.result
      });
    } catch (error) {
      handleApiError(error, res, "Failed to create problem");
    }
  };

const getProblemInfo = async (req, res) => {
    try {
      // console.log("get problem info hit", req.body);
      const { apiKey, secret, problemId, pin } = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId
      };
      
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.info');
      return res.status(200).json({
        status: "success",
        problemInfo: data.result
      });
    } catch (error) {
      handleApiError(error, res, "Failed to get problem info");
    }
  };

const updateProblemInfo = async (req, res) => {
    try {
      // console.log("update problem info hit", req.body);
      const { apiKey, secret, problemId, pin, ...updates } = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        ...updates // This includes inputFile, outputFile, interactive, timeLimit, memoryLimit
      };
      
      if (pin) params.pin = pin;
      
      await submitfxn(params, secret, 'problem.updateInfo');
      return res.status(200).json({
        status: "success",
        message: "Problem info updated successfully"
      });
    } catch (error) {
      handleApiError(error, res, "Failed to update problem info");
    }
  };


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
        lang: lang,
        ...statementData // This includes name, legend, input, output, etc.
      };
      
      if (pin) params.pin = pin;
      
      await submitfxn(params, secret, 'problem.saveStatement');
      return res.status(200).json({
        status: "success",
        message: "Statement saved successfully"
      });
    } catch (error) {
      handleApiError(error, res, "Failed to save statement");
    }
  };
  


  module.exports = { getProblemInfo, updateProblemInfo ,createProblem};