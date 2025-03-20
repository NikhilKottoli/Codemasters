const express = require('express');
const router = express.Router();
const { getProblemInfo, updateProblemInfo, createProblem } = require( '../controllers/polygon/polygonProblemController.js');
const { verifyCredentials,fetchproblems, } = require('../controllers/polygon/polygonController.js');
const {getStatements,saveStatement}=require('../controllers/polygon/polygonStatementController.js')
const {viewFile,saveFile,getFiles}=require('../controllers/polygon/polygonfileController.js')
const {getChecker,setChecker} =require('../controllers/polygon/polygonCheckerController.js')
const {getTests,saveTest}= require('../controllers/polygon/polygonTestCaseController.js')
const {getScript,saveScript}=require('../controllers/polygon/polygonScriptController.js')
const {getSolutions,saveSolution,viewSolution}=require('../controllers/polygon/polygonSolutionController.js')
router.post('/verify-credentials', verifyCredentials)

router.post('/problems',fetchproblems)
router.get('/problems',fetchproblems)
router.post('/create-problem', createProblem);

router.post('/problem-info', getProblemInfo);
router.post('/update-problem-info', updateProblemInfo);

router.post('/statements', getStatements);
router.post('/save-statement', saveStatement);

router.post('/files', getFiles);
router.post('/save-file',  saveFile);
router.post('/view-file', viewFile);

router.post('/checker', getChecker);
router.post('/set-checker',  setChecker);

router.post('/tests', getTests);
router.post('/save-test', saveTest);

router.post('/script', getScript);
router.post('/save-script', saveScript);

router.post('/solutions', getSolutions);
router.post('/save-solution', saveSolution);
router.post('/view-solution', viewSolution);

module.exports=router;