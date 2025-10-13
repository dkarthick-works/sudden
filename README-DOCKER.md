# Docker Deployment Guide for Trading Journal

This guide explains how to deploy the Trading Journal application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Project Structure

```
sudden/
├── docker-compose.yml           # Main orchestration file
├── .env.example                 # Environment variables template
├── sudden/                      # Backend (Spring Boot)
│   ├── Dockerfile
│   └── .dockerignore
└── sudden-client/
    └── trading-journal/         # Frontend (React)
        ├── Dockerfile
        ├── nginx.conf
        └── .dockerignore
```

## Services

The application consists of 4 services:

1. **MongoDB** (Port 27017) - Database
2. **Redis** (Port 6379) - Cache
3. **Backend** (Port 8081) - Spring Boot API
4. **Frontend** (Port 80) - React app served by Nginx

## Quick Start

### 1. Set Up Environment Variables

**IMPORTANT:** Before starting, create your `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials (use a text editor)
nano .env
```

Replace placeholder values with strong passwords. **Never commit the `.env` file!**

### 2. Build and Start All Services

```bash
docker-compose up -d --build
```

This command will:
- Build Docker images for backend and frontend
- Pull MongoDB and Redis images
- Start all services in the background
- Create a network for inter-service communication

### 2. Check Service Status

```bash
docker-compose ps
```

All services should show "Up" status.

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8082/api
- **MongoDB**: localhost:27018
- **Redis**: localhost:6380

## Common Commands

### Stop Services

```bash
docker-compose stop
```

### Stop and Remove Containers

```bash
docker-compose down
```

### Stop and Remove Everything (including volumes)

```bash
docker-compose down -v
```

### Rebuild a Specific Service

```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Execute Commands in Containers

```bash
# Access backend container
docker-compose exec backend sh

# Access MongoDB shell (use credentials from your .env file)
docker-compose exec mongodb mongosh -u your_app_username -p your_password sudden

# Access Redis CLI
docker-compose exec redis redis-cli
```

## Configuration

### Environment Variables

All sensitive configuration is managed through environment variables:

1. **`.env`** - Your actual credentials (NOT committed to Git)
2. **`.env.example`** - Template with placeholder values (committed to Git)

**Required environment variables:**
- `MONGO_INITDB_ROOT_USERNAME` - MongoDB root admin username
- `MONGO_INITDB_ROOT_PASSWORD` - MongoDB root admin password
- `MONGO_APP_USERNAME` - Application database user
- `MONGO_APP_PASSWORD` - Application database password
- `MONGO_DATABASE` - Database name (default: sudden)

### Security Best Practices

🔐 **See [SECURITY.md](SECURITY.md) for complete secrets management guide**

Key points:
- ✅ Use strong, unique passwords (20+ characters)
- ✅ Never commit `.env` to Git (it's in `.gitignore`)
- ✅ Use different credentials for each environment
- ✅ Rotate passwords regularly
- ❌ Never hard-code credentials in source code
- ❌ Never share credentials via chat/email

## Data Persistence

Docker volumes are used for data persistence:
- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `redis_data` - Redis data

Data persists even after containers are stopped or removed (unless you use `docker-compose down -v`).

## Health Checks

All services include health checks:
- **MongoDB**: Ping test every 10 seconds
- **Redis**: Ping test every 10 seconds
- **Backend**: Health endpoint check every 30 seconds
- **Frontend**: HTTP check every 30 seconds

## Troubleshooting

### Backend Can't Connect to MongoDB

```bash
# Check if MongoDB is healthy
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Verify network connectivity
docker-compose exec backend ping mongodb
```

### Frontend Can't Reach Backend

```bash
# Check backend health
docker-compose logs backend

# Test backend endpoint
curl http://localhost:8081/api
```

### Port Already in Use

If you get port conflict errors:

```bash
# Option 1: Stop conflicting services
# Option 2: Change ports in docker-compose.yml

# For example, change frontend port:
ports:
  - "8080:80"  # Access on port 8080 instead
```

### Clear Everything and Start Fresh

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up -d --build
```

## Production Considerations

Before deploying to production:

1. **Secrets Management**: Use Docker Secrets, AWS Secrets Manager, or similar (see [SECURITY.md](SECURITY.md))
2. **Strong Credentials**: Generate strong passwords (20+ characters, random)
3. **Enable HTTPS**: Add SSL certificates and configure Nginx
4. **Resource Limits**: Add memory and CPU limits to services
5. **Backup Strategy**: Implement regular backups for MongoDB volumes
6. **Logging**: Configure proper log rotation and aggregation
7. **Monitoring**: Add monitoring tools (Prometheus, Grafana, etc.)
8. **Network Security**: Configure firewalls and security groups
9. **Update Policy**: Regular security updates for base images

## Development vs Production

For production deployment, consider:

```yaml
# Add to each service in docker-compose.yml
resources:
  limits:
    cpus: '1.0'
    memory: 1G
  reservations:
    cpus: '0.5'
    memory: 512M
```

## Support

For issues or questions, refer to the main project documentation.
