// const {supabase,supabase1} = require("../supabase");

const axios = require('axios');
const { handleApiError } = require('../../utils/errorHandler');

const checkcreds = async (req,res,next) => {
  if(!req.body.apiKey || !req.body.secret){
    return res.status(400).json({
      status: "failed",
      message: "API key and secret are required"
    });
  }
else{
  next();
}}

const verifyCredentials=async (req, res) => {
    try {
      console.log("verify credentials hit ",req.body);
      const { apiKey, secret } = req.body;
      const params = {
        apiKey: apiKey,
        time: Math.floor(Date.now() / 1000)
      };
      const response= await submitfxn(params,secret,'problems.list');
      return res.status(200).json({
        status: "success",
        valid: true,
        message: "API credentials are valid"
      });
    } catch (error) {
      handleApiError(error, res, "Invalid API credentials");
    }
  }

const fetchproblems= async(req,res)=>{
    try {
      console.log("fetch problems hit ",req.body);
        const { apiKey, secret ,id } = req.body;
        // console.log(req.body);
        const methodName = 'problems.list';

        const params = {
          apiKey: apiKey,
          time: Math.floor(Date.now() / 1000)
        };
        if(id){
          params.id=id;
        }
        
      
        
        const data = await submitfxn(params, secret,methodName);
        return res.status(200).json(data);
      } catch (error) {
        handleApiError(error, res, "Failed to fetch problems");
      }
}  

  async function submitfxn (params, secret,methodName) {
    const rand = generateRandomString(6);
    const sortedParams = sortParamsLexicographically(params);
    const stringToHash = `${rand}/${methodName}?${sortedParams}#${secret}`;
    params.apiSig= rand + sha512(stringToHash);
    
    const response = await fetch(`https://polygon.codeforces.com/api/${methodName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params)
    });
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
    verifyCredentials,fetchproblems,checkcreds,submitfxn
  };

