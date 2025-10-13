db = db.getSiblingDB('sudden');

db.createUser({
  user: 'deeka',
  pwd: 'wwmib3112',
  roles: [
    {
      role: 'readWrite',
      db: 'sudden'
    }
  ]
});

print('MongoDB user created successfully');
