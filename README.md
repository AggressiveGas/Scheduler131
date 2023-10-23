
# Scheduler131

The scheduling app for code monkeys of csc 131



## Installation

### Pre-requisites Before     Cloning:                                                             
Before cloning the repository, it's essential to configure your Git settings to ensure there are no issues with npm packages due to end-of-line character differences between operating systems.

**For Windows:**

```bash
  git config --global core.autocrlf true
```
    
**For MacOS:**

```bash
  git config --global core.autocrlf input
```

### Installation Instructions

**Clone the repository:**

```bash
  mkdir NewFolderName # Replace NewFolderName with your desired folder name.
  cd NewFolderName
  git clone https://github.com/AggressiveGas/Scheduler131.git
```
**Navigate to the Client Directory and Install Required Packages:**
```bash
  cd client
  npm install @mui/material @emotion/react @emotion/styled react-router-dom axios react-scripts

```

**Navigate to the Server Directory and Install Required Packages:**
```bash
  cd ..
  cd server
  npm install express mongoose cors morgan dotenv nodemon mongodb express-async-handler bcryptjs jsonwebtoken

```

## Project Requirements

### User Management

- ~~POST /api/user: Create a new user~~ - **Complete**
- ~~GET /api/user/{user_id}: Retrieve user profile information.~~ - **Complete**
- ~~GET /api/user: Retrieve all user data~~ - **Complete**
- ~~PUT /api/user/{user_id}: Edit user info~~ - **Complete**
- ~~DELETE /api/user/{user_id}: Delete user~~ - **Complete**

### Availability Management:

- POST /api/user/{user_id}/availability: Create a new availability entry for a user.
- GET /api/user/{user_id}/availability: Retrieve all availabilities for a user (useful for showing your own availability).
- PUT /api/user/{user_id}/availability/{availability_id}: Update an existing availability entry.
- DELETE /api/user/{user_id}/availability/{availability_id}: Delete an availability entry.

### Meeting Management:

- POST /api/meeting: Create a new meeting.
- GET /api/meeting/{meeting_id}: Retrieve details about a specific meeting.
- GET /api/meeting: Retrieve a list of all available meetings based on user's availability.
- PUT /api/meeting/{meeting_id}: Update an existing meeting (e.g., add or remove participants).
- DELETE /api/meeting/{meeting_id}: Delete a meeting.

### Search for Available Timeslots:

- GET /api/timeslots: Retrieve available timeslots for scheduling a meeting with one or more users.

## Extra Features:

### User Registration and Authentication:

- ~~POST /api/register: Register a new user.~~ - **Complete**
- ~~POST /api/login: Authenticate a user.~~ - **Complete**

### Invitations and Notifications:
- POST /api/invite: Invite a user to a meeting.
- GET /api/notifications: Retrieve notifications (e.g., meeting
invitations, updates).
