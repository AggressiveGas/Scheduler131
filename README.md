
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
  npm install react-scripts
```

**Navigate to the Server Directory and Install Required Packages:**
```bash
  cd ..
  cd server
  npm install express mongoose cors morgan dotenv nodemon mongodb express-async-handler

```
