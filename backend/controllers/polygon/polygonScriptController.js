const { submitfxn } = require ('./polygonController');
const { handleApiError } = require('../../utils/errorHandler');


const getScript = async (req, res) => {
    try {
      console.log("get script hit", req.body);
      const { apiKey, secret, problemId, pin} = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId
      };
      
      if (pin) params.pin = pin;
      params.testset='tests';
      
      const data = await submitfxn(params, secret, 'problem.script');
      return res.status(200).json({
        status: "success",
        script: data
      });
    } catch (error) {
      handleApiError(error, res, "Failed to get script");
     
    }
  };
  
  const saveScript = async (req, res) => {
    try {
      console.log("save script hit", req.body);
      const { apiKey, secret, problemId, pin, testset, source } = req.body;
      
      if (!testset || !source) {
        return res.status(400).json({
          status: "failed",
          message: "Testset and script source are required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        testset: testset,
        source: source
      };
      
      if (pin) params.pin = pin;
      
      
      await submitfxn(params, secret, 'problem.saveScript');
      return res.status(200).json({
        status: "success",
        message: "Script saved successfully"
      });
    } catch (error) {
      handleApiError(error, res, "Failed to save script");
    }
  };


module.exports={saveScript,getScript}