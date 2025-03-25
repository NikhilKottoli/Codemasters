const { submitfxn } = require ('./polygonController');
const { handleApiError } = require('../../utils/errorHandler');


const getFiles = async (req, res) => {
    try {
      console.log("get files hit", req.body);
      const { apiKey, secret, problemId, pin } = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId
      };
      
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.files');
      return res.status(200).json({
        status: "success",
        files: data.result
      });
    } catch (error) {
      handleApiError(error, res, "Failed to get files");
    }
  };
  
  const saveFile = async (req, res) => {
    try {
      console.log("save file hit", req.body);
      const { apiKey, secret, problemId, pin, type, name, file, sourceType, checkExisting } = req.body;
      
      if (!type || !name || !file) {
        return res.status(400).json({
          status: "failed",
          message: "File type, name, and content are required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        type: type, // resource, source, or aux
        name: name,
        file: file
      };
      
      if (sourceType) params.sourceType = sourceType;
      if (checkExisting) params.checkExisting = checkExisting;
      if (pin) params.pin = pin;
      
      await submitfxn(params, secret, 'problem.saveFile');
      return res.status(200).json({
        status: "success",
        message: "File saved successfully"
      });
    } catch (error) {
      handleApiError(error, res, "Failed to save file");
    }
  };
  
  const viewFile = async (req, res) => {
    try {
      console.log("view file hit", req.body);
      const { apiKey, secret, problemId, pin, type, name } = req.body;
      
      if (!type || !name) {
        return res.status(400).json({
          status: "failed",
          message: "File type and name are required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        type: type,
        name: name
      };
      
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.viewFile');
     
      return res.status(200).json({
        status: "success",
        file: data
      });
    } catch (error) {
      handleApiError(error, res, "Failed to view file");
      // console.log("error",error);
    }
  };
  

module.exports={viewFile,getFiles,saveFile}