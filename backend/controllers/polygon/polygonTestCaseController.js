const { submitfxn } = require ('./polygonController');
const { handleApiError } = require('../../utils/errorHandler');


const getTests = async (req, res) => {
    try {
      console.log("get tests hit", req.body);
      const { apiKey, secret, problemId, pin, testset } = req.body;
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId
      };
      
      if (testset) params.testset = testset;
      else params.testset='tests'
      if (pin) params.pin = pin;
      
      const data = await submitfxn(params, secret, 'problem.tests');
      return res.status(200).json({
        status: "success",
        tests: data.result
      });
    } catch (error) {
      handleApiError(error, res, "Failed to get tests");
    }
  };

const getTestById=async(req,res)=>{
  
}
  
  const saveTest = async (req, res) => {
    try {
      console.log("save test hit", req.body);
      const { apiKey, secret, problemId, pin, testset, testIndex, testInput, testGroup, checkExisting, ...testData } = req.body;
      
      if (!testset || !testIndex || !testInput) {
        return res.status(400).json({
          status: "failed",
          message: "Testset, test index, and test input are required"
        });
      }
      
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000),
        problemId: problemId,
        testset: testset,
        testIndex: testIndex,
        testInput: testInput,
        ...testData // This can include testGroup, testPoints, testDescription, etc.
      };
      
      if (testGroup) params.testGroup = testGroup;
      if (checkExisting) params.checkExisting = checkExisting;
      if (pin) params.pin = pin;
      
      await submitfxn(params, secret, 'problem.saveTest');
      return res.status(200).json({
        status: "success",
        message: "Test saved successfully"
      });
    } catch (error) {
      handleApiError(error, res, "Failed to save test");
    }
  };

  module.exports={saveTest,getTests}
  