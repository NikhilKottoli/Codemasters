# Codemasters
Exec-proj-2025 : A programming based online assessment platform 


# Steps to run

## Install dependencies
```
cd backend
npm i
```

## Start Redis
Mac:
```
redis-server
```
Windowns:
```
redis-server.exe
```

# PISTON API CALLS
```
GET  https://emkc.org/api/v2/piston/runtimes
```
```
POST https://emkc.org/api/v2/piston/execute
```

example request
```
{
  "language": "python",
  "version": "3.10.0",
  "files": [
    {
      "name": "dummy.py",
      "content": "a = 5\nb = 5\nprint(a + b)"
    }
  ]
}
```

# To Start De-Queue process to dequeue from redis and send response to pistion.The response will be logged onto your console.
```
node sendPostRequestToPiston.js
```
 