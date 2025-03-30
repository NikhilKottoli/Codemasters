

const axios = require('axios');
const { handleApiError } = require('../../utils/errorHandler');
const { getProblemInfo } = require('./polygonProblemController');

const checkcreds = async (req, res, next) => {
  if (!req.body.apiKey || !req.body.secret) {
    return res.status(400).json({
      status: "failed",
      message: "API key and secret are required"
    });
  }
  else {
    next();
  }
}

const verifyCredentials = async (req, res) => {
  try {
    console.log("verify credentials hit ", req.body);
    const { apiKey, secret } = req.body;
    const params = {
      apiKey: apiKey,
      time: Math.floor(Date.now() / 1000)
    };
    const response = await submitfxn(params, secret, 'problems.list');
    return res.status(200).json({
      status: "success",
      valid: true,
      message: "API credentials are valid"
    });
  } catch (error) {
    handleApiError(error, res, "Invalid API credentials");
  }
}

const fetchproblems = async (req, res) => {
  try {
    console.log("fetch problems hit ", req.body);
    const { apiKey, secret, id } = req.body;
    const methodName = 'problems.list';

    const params = {
      apiKey: apiKey,
      time: Math.floor(Date.now() / 1000)
    };
    if (id) {
      params.id = id;
    }



    const data = await submitfxn(params, secret, methodName);

    return res.status(200).json(data);
  } catch (error) {
    handleApiError(error, res, "Failed to fetch problems");
  }
}

const PolygonQuestion = async (req, res) => {
  try {
    const { problemId, apiKey, secret } = req.body;
    console.log("questionhit")
    const QuestionData = {};
    console.log("add question hit", problemId);
    const params = {
      apiKey: apiKey,
      time: Math.floor(Date.now() / 1000),
      problemId: problemId
    };
     console.log("started",params)

    //timelimit

    const QuestioninfoData = await submitfxn(params, secret, 'problem.info');
    console.log("questioninfodaata" ,QuestioninfoData);
    QuestionData.timeLimit = QuestioninfoData.result.timeLimit;

    //statement data

    const statementData = await submitfxn(params, secret, 'problem.statements');
    console.log("statementdata",statementData)
    const statement = statementData.result.english;
    QuestionData.title = statement.name;
    QuestionData.description = statement.legend;
    QuestionData.constraintData = `Input \n ${statement.input} \n Output \n ${statement.output}`;

    //testcases
    params.testset = 'tests';
    const TestlistData = await submitfxn(params, secret, 'problem.tests')
    const testlist = TestlistData.result;
    console.log("teslist",testlist)
    QuestionData.visibleTestCases = 0;
    QuestionData.numTestCases = testlist.length;
    QuestionData.exampleInput = {};
    QuestionData.exampleOutput = {};

    for (const obj of testlist) {
      if (obj.useInStatements) {
        QuestionData.visibleTestCases++;
      }

      if (!obj.manual) {
        params.testIndex = obj.index;
        const testcaseInputData = await submitfxn(params, secret, 'problem.testInput');
        QuestionData.exampleInput[`${obj.index}`] = testcaseInputData;
        const testcaseOutputData = await submitfxn(params, secret, 'problem.testAnswer');
        QuestionData.exampleOutput[`${obj.index}`] = testcaseOutputData;



        delete params.testIndex;
      } else {
        QuestionData.exampleInput[`${obj.index}`] = obj.input;

        const testcaseOutputData = await submitfxn(params, secret, 'problem.testAnswer');
        QuestionData.exampleOutput[`${obj.index}`] =testcaseOutputData;
      }
    }
    delete params.testset;

   

    // //checker
    // const checkerData = await submitfxn(params, secret, 'problem.checker')
    // params.type = 'source';
    // params.name = checkerData.result;
    // QuestionData.checkercode = await submitfxn(params, secret, 'problem.viewFile');

    console.log("Question object", QuestionData);

    return res.status(200).json({ status: 'success', QuestionData });
  } catch (err) {
    console.log(err);
  }
}

async function submitfxn(params, secret, methodName) {

  const rand = generateRandomString(6);
  const sortedParams = sortParamsLexicographically(params);
  const stringToHash = `${rand}/${methodName}?${sortedParams}#${secret}`;
  params.apiSig = rand + sha512(stringToHash);

  const response = await fetch(`https://polygon.codeforces.com/api/${methodName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(params)
  });
  delete params.apiSig;
  if (methodName === 'problem.viewFile' || methodName === 'problem.viewSolution' || methodName === 'problem.script' || methodName === 'problem.testInput' || methodName === 'problem.testAnswer') {
    const text = await response.text();
    return text;
  }
  return response.json();
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


function sortParamsLexicographically(params) {
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}


function sha512(str) {
  const crypto = require('crypto');
  return crypto.createHash('sha512').update(str).digest('hex');
}


module.exports = {
  verifyCredentials, fetchproblems, checkcreds, PolygonQuestion, submitfxn
};