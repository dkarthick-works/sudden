// MongoDB initialization script
// This script reads credentials from environment variables
// passed by docker-compose.yml

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

db.createUser({
  user: process.env.MONGO_APP_USERNAME,
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE
    }
  ]
});

print('MongoDB user created successfully for database: ' + process.env.MONGO_INITDB_DATABASE);
