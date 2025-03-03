# Codemasters Project

## Project Setup


### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory and add the following environment variables:
   ```
   REDIS_URL=redis://localhost:6379
   PORT=3000

   SUPABASE_URL=https://tdpgskzzgxitjofcunyh.supabase.co
   SUPABASE_KEY=
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Create a new terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
6. Start the de-queue process to dequeue from Redis and send responses to Piston. The response will be logged onto your console.
   ```bash
    node sendPostRequestToPiston.js
    ```

### Redis Setup
- **Mac:**
  ```bash
  redis-server
  ```
- **Windows:**
  ```bash
  redis-server.exe
  ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## PISTON API Calls

### Get Available Runtimes
- **URL:** `GET https://emkc.org/api/v2/piston/runtimes`

### Execute Code
- **URL:** `POST https://emkc.org/api/v2/piston/execute`
- **Example Request:**
  ```json
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

## De-Queue Process
To start the de-queue process to dequeue from Redis and send responses to Piston. The response will be logged onto your console.
```bash
node sendPostRequestToPiston.js
```

## API Endpoints

### User Endpoints
- **Sign Up**
  - **URL:** `POST /user/signup`
  - **Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Account created successfully"
    }
    ```

- **Sign In**
  - **URL:** `POST /user/signin`
  - **Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "token": "string"
    }
    ```

### Question Endpoints
- **Get All Questions**
  - **URL:** `GET /question/`
  - **Response:**
    ```json
    [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "difficulty": "string",
        "category": "string",
        "timeLimit": "string",
        "acceptance": "string"
      }
    ]
    ```

- **Get Question by ID**
  - **URL:** `GET /question/:id`
  - **Response:**
    ```json
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "difficulty": "string",
      "category": "string",
      "timeLimit": "string",
      "acceptance": "string",
      "example_input": "string",
      "expected_output": "string",
      "constraint_data": "string"
    }
    ```

- **Add New Question**
  - **URL:** `POST /question/`
  - **Body:**
    ```json
    {
      "title": "string",
      "description": "string",
      "difficulty": "string",
      "category": "string",
      "timeLimit": "string",
      "acceptance": "string",
      "exampleInput": "string",
      "expectedOutput": "string",
      "constraint_data": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Question added successfully"
    }
    ```

### Task Endpoints
- **Create Task**
  - **URL:** `POST /task`
  - **Body:**
    ```json
    {
      "code": "string",
      "language": "string",
      "questionId": "string",
      "action": "run" | "submit",
      "userId": "string",
      "stdin": "string",
      "output": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "taskId": "string"
    }
    ```

- **Get Task Result**
  - **URL:** `GET /task/:taskId`
  - **Response:**
    ```json
    {
      "status": "completed" | "failed" | "pending",
      "output": "string"
    }
    ```

## Frontend Pages



### Sign Up Page
- **Route:** `/user/signup`
- **Component:** `SignUp`
- **Description:** Provides a form for user registration.

### Sign In Page
- **Route:** `/user/signin`
- **Component:** `SignIn`
- **Description:** Provides a form for user login.

### Questions List Page
- **Route:** `/questions`
- **Component:** `QuestionsList`
- **Description:** Displays a list of all questions.

### Add Question Form Page
- **Route:** `/addquestion`
- **Component:** `AddQuestionForm`
- **Description:** Provides a form to add new questions.

### Task Fetcher Page
- **Route:** `/solve/:questionId`
- **Component:** `TaskFetcher`
- **Description:** Fetches and displays question details, allows code submission and execution.

## Important Formats

### Question Format
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "difficulty": "string",
  "category": "string",
  "timeLimit": "string",
  "acceptance": "string",
  "example_input": "string",
  "expected_output": "string",
  "constraint_data": "string"
}
```

### Task Format
```json
{
  "taskId": "string",
  "code": "string",
  "language": "string",
  "questionId": "string",
  "action": "run" | "submit",
  "userId": "string",
  "stdin": "string",
  "output": "string"
}
```

### User Format
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
