# Quick Setup Instructions

## MongoDB Atlas Connection

### 1. Create your MongoDB Atlas account

Follow the guide: [docs/MONGODB_ATLAS_SETUP.md](docs/MONGODB_ATLAS_SETUP.md)

### 2. Configure your environment

```bash
cd server
cp .env.example .env
```

### 3. Edit `.env` file and update:

- `MONGO_URI` with your MongoDB Atlas connection string
- `JWT_SECRET` with a strong random secret
- Other configuration as needed

### 4. Install dependencies and start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

### 5. Verify connection

You should see: `MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net`

## Complete Guide

See [docs/MONGODB_ATLAS_SETUP.md](docs/MONGODB_ATLAS_SETUP.md) for detailed step-by-step instructions.
