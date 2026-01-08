# Docker Setup Guide - Restaurant Management System

This guide will help you run the Restaurant Management System using Docker and Docker Compose.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Docker Desktop** (version 20.10 or higher)
  - Windows: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
  - Mac: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
  - Linux: Install Docker Engine and Docker Compose

- **Git** (to clone the repository, if needed)

### Verify Installation

```bash
docker --version
docker-compose --version
```

You should see version numbers for both commands.

---

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Configure Environment Variables

1. Open the `.env.docker` file in the root directory
2. **IMPORTANT:** Change the `JWT_SECRET` to a secure random string:

```bash
# Generate a secure JWT secret (run this in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Copy the generated string and replace `JWT_SECRET` value in `.env.docker`:

```env
JWT_SECRET=your_generated_secure_secret_here
```

### Step 2: Build and Start Containers

Open terminal in the project root directory and run:

```bash
docker-compose up --build
```

This command will:
- Build Docker images for the server and client
- Download MongoDB image
- Create a network for the containers
- Start all services

**First-time build takes 5-10 minutes.** Subsequent starts are much faster.

### Step 3: Access the Application

Once all containers are running (you'll see logs), open your browser:

- **Frontend Application:** http://localhost
- **API Server:** http://localhost:5000
- **MongoDB:** localhost:27017 (for database tools)

---

## 🎯 What Gets Created

### Containers
1. **restaurant_client** - Nginx serving React frontend (port 80)
2. **restaurant_server** - Node.js Express backend (port 5000)
3. **restaurant_mongodb** - MongoDB database (port 27017)

### Network
- **restaurant-network** - Internal network for container communication

### Volumes
- **mongodb_data** - Persistent MongoDB data (survives container restarts)
- **./server/public/images** - Uploaded images (menu items, categories)

---

## 📱 First Time Setup

After containers are running, you need to seed the database with initial data.

### Option 1: Using Docker Exec (Recommended)

```bash
# Seed all data (users, tables, menu items)
docker exec restaurant_server npm run seed:all
```

### Option 2: Manual Seeding

```bash
# Access the server container
docker exec -it restaurant_server sh

# Inside container, run seeding commands
npm run seed:users    # Create test users
npm run seed:tables   # Create tables
npm run seed:data     # Create menu items and categories

# Exit container
exit
```

### Default Test Users (After Seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@restaurant.com | admin123 | Admin |
| manager@restaurant.com | manager123 | Manager |
| chef@restaurant.com | chef123 | Chef |
| waiter@restaurant.com | waiter123 | Waiter |
| cashier@restaurant.com | cashier123 | Cashier |
| customer@restaurant.com | customer123 | Customer |

---

## 🔧 Common Docker Commands

### Start Containers (After First Build)
```bash
# Start in foreground (see logs)
docker-compose up

# Start in background (detached mode)
docker-compose up -d
```

### Stop Containers
```bash
# Stop all containers (keeps data)
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

### View Logs
```bash
# All containers
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# Specific service
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb
```

### Restart a Service
```bash
# Restart specific service
docker-compose restart server
docker-compose restart client

# Restart all
docker-compose restart
```

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose build server
docker-compose build client

# Rebuild and restart
docker-compose up --build
```

### Access Container Shell
```bash
# Server container
docker exec -it restaurant_server sh

# MongoDB shell
docker exec -it restaurant_mongodb mongosh restaurant_db
```

---

## 🗄️ Database Management

### View Database

```bash
# Access MongoDB shell
docker exec -it restaurant_mongodb mongosh restaurant_db

# Inside MongoDB shell, run:
show collections
db.users.find().pretty()
db.orders.find().pretty()
exit
```

### Backup Database

```bash
# Create backup
docker exec restaurant_mongodb mongodump --db restaurant_db --out /backup

# Copy backup to host
docker cp restaurant_mongodb:/backup ./mongodb_backup
```

### Restore Database

```bash
# Copy backup to container
docker cp ./mongodb_backup restaurant_mongodb:/backup

# Restore
docker exec restaurant_mongodb mongorestore /backup
```

---

## 🐛 Troubleshooting

### Problem: Containers won't start

**Check if ports are already in use:**
```bash
# Windows
netstat -ano | findstr "80"
netstat -ano | findstr "5000"
netstat -ano | findstr "27017"

# Mac/Linux
lsof -i :80
lsof -i :5000
lsof -i :27017
```

**Solution:** Stop other services using these ports or change ports in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"    # Change frontend to port 8080
  - "5001:5000"  # Change backend to port 5001
```

### Problem: MongoDB connection failed

**Check MongoDB is running:**
```bash
docker-compose ps
```

**View MongoDB logs:**
```bash
docker-compose logs mongodb
```

**Restart MongoDB:**
```bash
docker-compose restart mongodb
```

### Problem: Frontend shows "Cannot connect to server"

**Check server is running:**
```bash
docker-compose logs server
```

**Test API directly:**
```bash
curl http://localhost:5000/api/auth/test
```

**Common causes:**
- Server container crashed (check logs)
- Database connection failed (check MongoDB)
- Nginx proxy misconfigured (check `client/nginx.conf`)

### Problem: Changes not reflecting

**For server code changes:**
```bash
docker-compose build server
docker-compose up -d server
```

**For client code changes:**
```bash
docker-compose build client
docker-compose up -d client
```

**For complete rebuild:**
```bash
docker-compose down
docker-compose up --build
```

### Problem: Out of disk space

**Clean up Docker resources:**
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (CAUTION: deletes all Docker data)
docker system prune -a --volumes
```

---

## 🔄 Updating the Application

### Pull Latest Code

```bash
# Stop containers
docker-compose down

# Pull latest code
git pull origin main

# Rebuild and start
docker-compose up --build
```

---

## 📦 Production Deployment

For production deployment, consider:

1. **Use MongoDB Atlas** instead of local MongoDB:
   - Update `MONGO_URI` in `.env.docker`
   - Remove `mongodb` service from `docker-compose.yml`

2. **Add MongoDB authentication:**
   ```yaml
   mongodb:
     environment:
       - MONGO_INITDB_ROOT_USERNAME=admin
       - MONGO_INITDB_ROOT_PASSWORD=secure_password
   ```

3. **Use environment-specific compose files:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
   ```

4. **Enable SSL/HTTPS:**
   - Add reverse proxy (Traefik, Nginx)
   - Use Let's Encrypt for certificates

5. **Add health checks:**
   ```yaml
   server:
     healthcheck:
       test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
       interval: 30s
       timeout: 10s
       retries: 3
   ```

---

## 📊 Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats restaurant_server
```

### Check Container Health

```bash
# List containers
docker-compose ps

# Inspect container
docker inspect restaurant_server
```

---

## 🛑 Complete Cleanup

To completely remove everything (fresh start):

```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker rmi restaurant-server restaurant-client

# Remove all unused Docker resources
docker system prune -a --volumes
```

---

## 📝 File Structure

```
restaurant_mng_sys/
├── docker-compose.yml          # Main orchestration file
├── .env.docker                 # Environment variables
├── server/
│   ├── Dockerfile              # Server image definition
│   ├── .dockerignore           # Files to exclude from image
│   └── ...
├── client/
│   ├── Dockerfile              # Client image definition
│   ├── nginx.conf              # Nginx configuration
│   ├── .dockerignore           # Files to exclude from image
│   └── ...
└── docs/
    └── DOCKER_GUIDE.md         # This file
```

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs:** `docker-compose logs -f`
2. **Verify environment:** Check `.env.docker` values
3. **Check ports:** Ensure no conflicts
4. **Clean rebuild:** `docker-compose down && docker-compose up --build`
5. **Check Docker status:** `docker info`

### Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

## ✅ Quick Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up --build

# Seed database
docker exec restaurant_server npm run seed:all

# Access server shell
docker exec -it restaurant_server sh

# Access MongoDB
docker exec -it restaurant_mongodb mongosh restaurant_db

# Clean restart
docker-compose down && docker-compose up -d

# Complete cleanup
docker-compose down -v && docker system prune -a
```

---

**Setup completed!** 🎉

Your restaurant management system should now be running at **http://localhost**

For testing the bug fixes, refer to [TESTING_GUIDE.md](TESTING_GUIDE.md)
