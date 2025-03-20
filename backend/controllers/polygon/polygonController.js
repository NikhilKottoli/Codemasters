// const {supabase,supabase1} = require("../supabase");

const axios = require('axios');
const crypto = require("crypto");
const { handleApiError } = require('../../utils/errorHandler');

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

  const fetchproblems = async (req, res) => {
    try {
      console.log("Fetching all problems...");
  
      const apiKey = process.env.POLYGON_KEY;
      const secret = process.env.POLYGON_SECRET;
      const methodName = "problems.list";
      const time = Math.floor(Date.now() / 1000);
      const rand = Math.random().toString(36).substring(2, 8);
  
      const params = { apiKey, time };
      const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");
  
      const hashString = `${rand}/${methodName}?${sortedParams}#${secret}`;
      const apiSig = rand + crypto.createHash("sha512").update(hashString).digest("hex");
  
      const url = `https://polygon.codeforces.com/api/${methodName}?${sortedParams}&apiSig=${apiSig}`;
  
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched all problems:", data);
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      res.status(500).json({ error: "Failed to fetch problems" });
    }
  };

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
    verifyCredentials,fetchproblems,submitfxn
  };

