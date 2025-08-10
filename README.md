# file-uploader

## Description

A stripped-down Google Drive app

## Live Preview

<https://file-uploader-91du.onrender.com/>

## Features

- Sign up and log in with PassportJS Local Strategy
- Fetch image URLs from Cloudinary with its API
- CRUD folders
- Upload, Download and Delete files

## Installation

### Prerequisite

- [NodeJS && npm](https://nodejs.org/en/download) (Latest LTS version)
- [psql](https://www.postgresql.org/download/)
- [Cloudinary API Key](https://cloudinary.com/)

### Instructions

1. Clone the repo
```git clone https://github.com/ZackHoang/file-uploader.git```

2. Navigate to the repo
```cd file-uploader```

3. Install dependencies
```npm install```

4. Create a .env file on the current folder with these information

    ```text
    DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
    PORT=PORT_NUM
    SECRET_KEY=YOUR_SESSION_SECRET_KEY
    CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@cloud_name
    ```

5. Populate database
```npx prisma db push```

6. Start the server
```node app.js```

## Screenshots

![Sign Up](/screenshots/sign-up.png)
![Log In](/screenshots/log-in.png)
![Home](/screenshots/home.png)
![New Folder](/screenshots/new-folder.png)
![Update Folder](/screenshots/update-folder.png)
![File Details](/screenshots/file-details.png)
