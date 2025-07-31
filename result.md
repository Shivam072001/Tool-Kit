System Architecture & Database Design
This document outlines the complete technical architecture, code flow, and database schema for the utility website. The design prioritizes a decoupled microservices approach to ensure scalability, fault tolerance, and maintainability.

### 1. High-Level System Architecture

The architecture is composed of three primary services, a central database, a cache, a task queue, and file storage. This separation of concerns allows each part of the system to scale independently.

graph TD
subgraph User Facing
A[Frontend - React/Vite]
end

    subgraph Backend Services
        B[API Gateway - Node/Express]
        C[Compute Service - Python/Django]
    end

    subgraph Data & Infrastructure
        D[MongoDB Atlas]
        E[Redis - Cache & Message Broker]
        F[File Storage - S3/MinIO]
    end

    subgraph Asynchronous Processing
        G[Celery Workers]
    end

    A -- REST API Calls --> B
    B -- Manages/Orchestrates --> C
    B -- CRUD Operations --> D
    B -- Caching/Session --> E
    B -- File Upload/Metadata --> F

    C -- Heavy Lifting Tasks --> G
    C -- Reads/Writes Task Data --> D
    C -- Reads/Writes Files --> F
    G -- Consumes Tasks from --> E
    G -- Reports Status to --> D

- Architectural Rationale:

  - API Gateway: Serves as the single entry point for the client. It handles user-facing concerns like authentication, rate limiting, and request validation. It orchestrates calls to internal services, preventing the frontend from needing to know about the backend's complexity.

  - Compute Service (Python): Offloads all CPU/GPU-intensive tasks (AI, file conversion, etc.). It runs as a headless internal service, only accessible via the API Gateway. This prevents long-running tasks from blocking the main request-response cycle, ensuring the UI remains responsive.

  - Celery & Redis: A robust combination for managing asynchronous background jobs. When a user requests a file conversion, the API Gateway instantly responds with a task_id. The actual work is placed on the Redis queue and picked up by a Celery worker. The frontend can then poll for the task status.

  - MongoDB Atlas: A managed NoSQL database that offers flexibility and scalability, ideal for the diverse data structures required by the various tools.

  - File Storage (S3/MinIO): A dedicated object store is essential for handling large volumes of user-uploaded files securely and efficiently.

### 2. Frontend (Vite + React)

Folder Structure (Validated & Refined)
frontend/
└── src/
├── assets/ # Static assets (images, fonts, svgs)
├── components/
│ ├── atoms/ # Smallest UI elements (Button, Input, Spinner)
│ ├── molecules/ # Compositions of atoms (SearchBar, FileUpload)
│ ├── organisms/ # Complex UI sections (Header, ToolCardGrid)
│ └── layout/ # Page structure (MainLayout, Sidebar)
├── hooks/ # Custom hooks (e.g., useApi, useAuth, useTaskPoller)
├── lib/ # Third-party setups (axios instance, i18n)
├── pages/ # Top-level route components
├── services/ # API communication layer (api.js)
├── store/ # Global state (Zustand stores: userStore, taskStore)
├── styles/ # Global CSS, Tailwind config
└── utils/ # Helper functions (formatters, validators)

1. Code Flow Example: AI Background Removal

   - User Interaction (pages/AIBackgroundRemover.jsx):

   - The user drags and drops an image onto the FileUpload molecule (components/molecules/FileUpload.jsx).

   - react-dropzone handles the file selection.

   - An onClick handler triggers the upload process.

2. API Service Call (services/api.js):

   - The handler calls a function like aiApi.removeBackground(file).

   - This service function creates a FormData object and uses the configured axios instance to send a POST request to the API Gateway (/api/v1/ai/remove-background).

3. State Management (store/taskStore.js):

   - The API call immediately returns a taskId from the gateway.

   - This taskId is added to a Zustand store, e.g., taskStore.addTask(taskId).

4. Polling for Results (hooks/useTaskPoller.js):

   - A custom hook, useTaskPoller, reads the list of active taskIds from the taskStore.

   - It periodically (e.g., every 3 seconds) calls taskApi.getTaskStatus(taskId).

   - When a task's status changes to COMPLETED, it fetches the result (e.g., the URL of the processed image).

5. UI Update (pages/AIBackgroundRemover.jsx):

   - The component, subscribed to the taskStore, re-renders as the task status changes.

   - It shows a loading indicator (components/atoms/Spinner.jsx) while status is PENDING or PROCESSING.

Once COMPLETED, it displays the final image in a ResultDisplay organism (components/organisms/ResultDisplay.jsx).

### 3. API Gateway (Node.js + Express)

Folder Structure (Validated & Refined)
backend-gateway/
└── src/
├── config/ # Environment variables, DB config
├── controllers/ # Handles request/response logic
├── middleware/ # Auth, validation (Zod), error handling, rate-limiting
├── models/ # Mongoose schemas
├── repositories/ # Data access layer (interacts directly with Mongoose models)
├── routes/ # API endpoint definitions
├── services/
│ ├── internal/ # Business logic (e.g., userService, urlService)
│ └── external/ # Communication with Compute Service (e.g., aiServiceProxy)
├── utils/ # Helpers (logger, custom error classes, ApiResponse)
└── server.js # Express app entry point

1. Code Flow Example: API Request (POST /api/v1/ai/remove-background)

   - Routing (routes/ai.routes.js): The request first hits the router, which applies middleware.

   - Middleware (middleware/):

   - auth.middleware.js: Verifies the JWT token to authenticate the user.

   - multer.middleware.js: Handles the multipart/form-data upload, temporarily storing the file.

   - validate.middleware.js: Uses Zod to validate request parameters if any.

   - Controller (controllers/ai.controller.js):

   - The removeBackground controller function is executed.

   - It does not contain business logic. Its job is to orchestrate.

   - It calls the service layer: const task = await aiServiceProxy.createImageTask(req.user, req.file);

   - It sends a standardized JSON response back to the client: new ApiResponse(202, { taskId: task.id }, "Processing started").

   - Service (services/external/aiServiceProxy.js):

   - This service acts as a proxy to the Python Compute Service.

   - It first creates a task record in the local MongoDB via taskRepository to track the job (status: 'QUEUED').

   - It uploads the file to the central File Storage (S3/MinIO) and gets a file URL/key.

   - It then makes an HTTP request (using axios) to the internal Django service endpoint (http://compute-service/api/process/image), passing the taskId and the file's location.

2. Repository (repositories/task.repository.js):

   - Contains the pure database logic: TaskModel.create(...). This makes the services easier to test, as the database logic is abstracted away.

### 4. Computational Service (Python + Django)

This service is internal-facing and stateless. Its only job is to execute tasks given to it by the API Gateway.

Folder Structure (Validated & Refined)
backend-compute/
├── core/ # Django project settings, urls.py
├── tasks/ # Celery task definitions (e.g., file_tasks.py, ai_tasks.py)
├── apps/
│ ├── file_processing/ # Django app for conversion, compression logic
│ └── ai_processing/ # Django app for ML model inference logic
├── utils/ # Shared utility functions
└── manage.py

1. Code Flow Example: Processing the Task

   - API Endpoint (ai_processing/views.py):

   - The internal API endpoint (/api/process/image) receives the request from the Node.js Gateway.

   - The view extracts the taskId and fileKey.

   - Task Queuing (ai_processing/views.py):

   - The view does not perform the work. It delegates it to Celery.

   - It calls the async task: remove_background_task.delay(taskId, fileKey).

   - It immediately returns a 200 OK to the API Gateway to acknowledge receipt of the task.

2. Celery Worker (tasks/ai_tasks.py):

   - A free Celery worker picks up the remove_background_task from the Redis queue.

   - The worker function executes the core logic:
     a. Updates the task status in MongoDB to PROCESSING (using the taskId).
     b. Downloads the image from File Storage using fileKey.
     c. Loads the rembg or other ML model.
     d. Processes the image.
     e. Uploads the resulting image back to File Storage.
     f. Updates the task in MongoDB with status: 'COMPLETED' and the resultUrl.
     g. If an error occurs, it updates the task with status: 'FAILED' and an error message.

# 5. Detailed Database Schema (MongoDB)

This schema is designed to support all 17 features, with a focus on clear separation of concerns and efficient querying through indexing.

users
Stores core user information, authentication, and subscription status.
| Field Name | Data Type | Description | Indexes |
| :--- | :--- | :--- | :--- |
| \_id | ObjectId | Primary key | - |
| email | String | User's email address, must be unique. | Unique |
| passwordHash | String | Hashed password (using bcrypt). | - |
| authProvider | String | 'local', 'google', 'github'. | - |
| providerId | String | ID from the social login provider. | - |
| subscriptionTier | String | 'free', 'pro', 'enterprise'. | - |
| subscriptionUntil| Date | Date when the current subscription expires. | - |
| preferences | Object | User settings (e.g., theme, default language). | - |
| createdAt | Date | Timestamp of user creation. | - |
| lastLoginAt | Date | Timestamp of the last login. | - |

auth_tokens
Stores refresh tokens for persistent login sessions.
| Field Name | Data Type | Description | Indexes |
| :--- | :--- | :--- | :--- |
| \_id | ObjectId | Primary key | - |
| tokenHash | String | Hashed refresh token. | Unique |
| userId | ObjectId | Foreign key to users.\_id. | userId |
| expiresAt | Date | Expiry date of the refresh token. | TTL |

api_keys
Stores user-generated API keys for programmatic access.
| Field Name | Data Type | Description | Indexes |
| :--- | :--- | :--- | :--- |
| \_id | ObjectId | Primary key | - |
| keyHash | String | Hashed API key. | Unique |
| userId | ObjectId | Foreign key to users.\_id. | userId |
| label | String | User-defined name for the key. | - |
| lastUsedAt | Date | Timestamp of last use. | - |
| createdAt | Date | Timestamp of key creation. | - |

tasks
A generic collection to track all asynchronous background jobs.
| Field Name | Data Type | Description | Indexes |
| :--- | :--- | :--- | :--- |
| \_id | ObjectId | Primary key | - |
| userId | ObjectId | Foreign key to users.\_id. | userId |
| type | String | Type of task (e.g., 'FILE_CONVERT', 'BG_REMOVE'). | type |
| status | String | 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'. | status |
| inputPayload | Object | Data needed for the task (e.g., { from: 'pdf', to: 'docx' }). | - |
| resultPayload| Object | Result of the task (e.g., { fileUrl: '...' }). | - |
| errorMessage | String | Error details if the task failed. | - |
| createdAt | Date | Timestamp of task creation. | - |
| completedAt | Date | Timestamp of task completion. | - |

shortened_urls
Stores data for the URL Shortener tool.
| Field Name | Data Type | Description | Indexes |
| :--- | :--- | :--- | :--- |
| \_id | ObjectId | Primary key | - |
| shortCode | String | The unique short identifier. | Unique |
| originalUrl | String | The full URL to redirect to. | - |
| userId | ObjectId | Foreign key to users.\_id (can be null for anonymous). | userId |
| passwordHash | String | Optional password protection for the link. | - |
| expiresAt | Date | Optional expiration date for the link. | TTL |
| createdAt | Date | Timestamp of creation. | - |

url_analytics
Stores click data for shortened URLs.
| Field Name | Data Type | Description | Indexes |
| :--- | :--- | :--- | :--- |
| \_id | ObjectId | Primary key | - |
| urlId | ObjectId | Foreign key to shortened_urls.\_id. | urlId |
| timestamp | Date | Time of the click. | urlId, timestamp |
| ipAddress | String | Anonymized IP address of the clicker. | - |
| userAgent | String | User agent of the clicker. | - |
| geo | Object | Geographic information (e.g., { country: 'US' }). | - |

stored_passwords
Stores encrypted data for the Password Manager.
| Field Name | Data Type | Description | Indexes |
| :--- | :--- | :--- | :--- |
| \_id | ObjectId | Primary key | - |
| userId | ObjectId | Foreign key to users.\_id. | userId |
| encryptedData| String | The vault item (username, password, notes) encrypted with the user's master password hash. The server never sees the unencrypted data. | - |
| siteName | String | A non-sensitive label for the entry. | - |
| createdAt | Date | Timestamp of creation. | - |
