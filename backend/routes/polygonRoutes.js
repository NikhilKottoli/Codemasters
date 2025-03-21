const express = require('express');
const router = express.Router();
const { getProblemInfo, updateProblemInfo, createProblem } = require( '../controllers/polygon/polygonProblemController.js');
const { verifyCredentials,fetchproblems,checkcreds } = require('../controllers/polygon/polygonController.js');
const {getStatements,saveStatement}=require('../controllers/polygon/polygonStatementController.js')
const {viewFile,saveFile,getFiles}=require('../controllers/polygon/polygonfileController.js')
const {getChecker,setChecker} =require('../controllers/polygon/polygonCheckerController.js')
const {getTests,saveTest}= require('../controllers/polygon/polygonTestCaseController.js')
const {getScript,saveScript}=require('../controllers/polygon/polygonScriptController.js')
const {getSolutions,saveSolution,viewSolution}=require('../controllers/polygon/polygonSolutionController.js')
router.post('/verify-credentials',checkcreds, verifyCredentials)

router.post('/problems',checkcreds,fetchproblems)
router.post('/create-problem', checkcreds, createProblem);

router.post('/problem-info', checkcreds, getProblemInfo);
router.post('/update-problem-info', checkcreds, updateProblemInfo);

router.post('/statements', checkcreds, getStatements);
router.post('/save-statement', checkcreds, saveStatement);

router.post('/files', checkcreds, getFiles);
router.post('/save-file', checkcreds, saveFile);
router.post('/view-file', checkcreds, viewFile);

router.post('/checker', checkcreds, getChecker);
router.post('/set-checker', checkcreds, setChecker);

router.post('/tests', checkcreds, getTests);
router.post('/save-test', checkcreds, saveTest);

router.post('/script', checkcreds, getScript);
router.post('/save-script', checkcreds, saveScript);

router.post('/solutions', checkcreds, getSolutions);
router.post('/save-solution', checkcreds, saveSolution);
router.post('/view-solution', checkcreds, viewSolution);

module.exports=router;