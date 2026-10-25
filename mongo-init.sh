#!/bin/bash
# MongoDB initialization script (runs once, on an empty data volume).
# Creates the application user for TalentDb. Credentials come from the
# MONGO_APP_USER / MONGO_APP_PASSWORD environment variables set in .env.
mongo --quiet -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin TalentDb <<JS
db.createUser({
  user: '$MONGO_APP_USER',
  pwd: '$MONGO_APP_PASSWORD',
  roles: [{ role: 'readWrite', db: 'TalentDb' }],
  mechanisms: ['SCRAM-SHA-1', 'SCRAM-SHA-256']
});
print('MongoDB user ' + '$MONGO_APP_USER' + ' created');
JS
