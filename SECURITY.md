# Security Guide - Secrets Management

This document explains how to handle sensitive information (passwords, API keys, tokens) in this project.

## 🔐 Never Commit Secrets to Git

**CRITICAL:** Never commit actual passwords or credentials to the repository. This includes:

- Database passwords
- API keys
- OAuth tokens
- Private keys
- Session secrets

## 📁 File Structure

```
sudden/
├── .env                    ← YOUR REAL SECRETS (ignored by git)
├── .env.example            ← PLACEHOLDER values (committed to git)
├── .gitignore              ← Ensures .env is never committed
├── docker-compose.yml      ← References ${ENV_VARS} only
└── mongodb-init/
    └── init-mongo.js       ← Uses environment variables
```

## 🚀 Local Development Setup

### 1. Create Your Local `.env` File

```bash
# Copy the example file
cp .env.example .env

# Edit with your actual credentials
nano .env
```

### 2. Set Strong Passwords

Replace placeholder values with real credentials:

```bash
# Bad (default/weak passwords)
MONGO_APP_PASSWORD=password123

# Good (strong, unique passwords)
MONGO_APP_PASSWORD=Xk9$mP2nQ7@vL4zR8wY5tE3hU6jN
```

**Tip:** Use a password generator:
```bash
# Generate a strong password
openssl rand -base64 24
```

### 3. Start the Application

```bash
# Docker Compose automatically loads .env
docker-compose up -d --build
```

## 🌍 Environment-Specific Configuration

### Development (Local)
- Use `.env` file with local credentials
- Lower security passwords are acceptable
- Services accessible on localhost

### Staging/Production
Use one of these methods:

#### Option 1: Docker Secrets (Recommended for Docker Swarm)

```yaml
# docker-compose.prod.yml
services:
  mongodb:
    environment:
      MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/mongo_root_password
    secrets:
      - mongo_root_password

secrets:
  mongo_root_password:
    external: true
```

Deploy:
```bash
# Create secret
echo "your-strong-password" | docker secret create mongo_root_password -

# Deploy with secrets
docker stack deploy -c docker-compose.prod.yml sudden
```

#### Option 2: Cloud Provider Secret Managers

**AWS Secrets Manager:**
```bash
# Store secret
aws secretsmanager create-secret \
  --name sudden/mongo/password \
  --secret-string "your-strong-password"

# Retrieve in application
aws secretsmanager get-secret-value \
  --secret-id sudden/mongo/password
```

**Azure Key Vault:**
```bash
# Store secret
az keyvault secret set \
  --vault-name "sudden-keyvault" \
  --name "mongo-password" \
  --value "your-strong-password"
```

**Google Secret Manager:**
```bash
# Store secret
echo -n "your-strong-password" | \
  gcloud secrets create mongo-password --data-file=-
```

#### Option 3: Environment Variables (CI/CD)

For GitHub Actions, use repository secrets:

```yaml
# .github/workflows/deploy.yml
env:
  MONGO_APP_PASSWORD: ${{ secrets.MONGO_APP_PASSWORD }}
```

## 🔍 Checking for Exposed Secrets

### Before Committing

```bash
# Check what you're about to commit
git diff --cached

# Make sure .env is not being committed
git status

# Verify .env is ignored
git check-ignore .env
```

### Scan for Accidentally Committed Secrets

```bash
# Install gitleaks
brew install gitleaks

# Scan repository
gitleaks detect --source . --verbose

# Scan before commit (add to pre-commit hook)
gitleaks protect --staged
```

## 🚨 If You Accidentally Commit Secrets

### Immediate Actions:

1. **Rotate the compromised credentials immediately**
   ```bash
   # Generate new password
   NEW_PASSWORD=$(openssl rand -base64 24)
   echo "New password: $NEW_PASSWORD"

   # Update .env
   echo "MONGO_APP_PASSWORD=$NEW_PASSWORD" >> .env

   # Recreate containers
   docker-compose down -v
   docker-compose up -d
   ```

2. **Remove from Git history**
   ```bash
   # Using git-filter-repo (recommended)
   git filter-repo --path .env --invert-paths

   # Or using BFG Repo-Cleaner
   bfg --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

3. **Force push** (coordinate with team first!)
   ```bash
   git push origin --force --all
   ```

4. **Notify your team** and consider the secret compromised permanently

## ✅ Best Practices Checklist

- [ ] `.env` file exists and contains real credentials
- [ ] `.env` is listed in `.gitignore`
- [ ] `.env.example` contains only placeholder values
- [ ] All passwords are strong (20+ characters)
- [ ] `docker-compose.yml` uses `${VARIABLES}` syntax only
- [ ] No hard-coded credentials in source code
- [ ] Production uses Docker secrets or cloud secret manager
- [ ] Team members know not to commit `.env`
- [ ] CI/CD pipeline uses encrypted secrets
- [ ] Regular password rotation schedule established

## 📚 Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Docker Secrets Documentation](https://docs.docker.com/engine/swarm/secrets/)
- [Git-secrets Tool](https://github.com/awslabs/git-secrets)
- [Gitleaks - Secret Scanning](https://github.com/gitleaks/gitleaks)

## 🤝 Questions?

If you're unsure about secrets management:
1. Ask the team lead before committing
2. Review this guide
3. When in doubt, **don't commit**
