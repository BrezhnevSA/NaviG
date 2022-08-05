#!/bin/bash

BACKUP_PATH="/mnt/c/Users/sbrez/pr/navi-dev/backup_test.dump"
TEST_SERVER_PATH="/mnt/c/Users/sbrez/pr/navi-dev/"
BETA_DB="navi_back_development"
BETA_USER="navi_back"
TEST_DB="navi_back"
TEST_USER="postgres"
POSTGRES_USER="postgres"
SERVER_PID_PATH="tmp/pids/server.pid"
ERROR_CODE=0

# echo "-01-of-11---creating backup of beta to $BACKUP_PATH---"
# /usr/pgsql-12/bin/pg_dump -F custom -U $BETA_USER $BETA_DB > $BACKUP_PATH || ERROR_CODE=1 
# echo "-01-of-11---creation of backup completed---"

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-02-of-11---go to $TEST_SERVER_PATH---"
  cd $TEST_SERVER_PATH || ERROR_CODE=2
  echo "-02-of-11---ok, we are here. let's start migration process---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  if test -f "$SERVER_PID_PATH"
  then
    echo "-03-of-11---stopping test server---"
    kill `cat $SERVER_PID_PATH` || ERROR_CODE=3
    echo "-03-of-11---test server was stopped---"
  else
    echo "-03-of-11---skip this step, server not running---"
  fi
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-04-of-11---dropping $TEST_DB if exists---"
  /usr/pgsql-12/bin/dropdb -U $POSTGRES_USER $TEST_DB --if-exists || ERROR_CODE=4
  echo "-04-of-11---table was dropped---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-05-of-11---creating $TEST_DB with template0---"
  /usr/pgsql-12/bin/createdb -U $POSTGRES_USER -T template0 $TEST_DB || ERROR_CODE=5
  echo "-05-of-11---creation of $TEST_DB completed---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-06-of-11---restoring $TEST_DB from $BACKUP_PATH---"
  /usr/pgsql-12/bin/pg_restore -U $POSTGRES_USER -d $TEST_DB $BACKUP_PATH || ERROR_CODE=6
  echo "-06-of-11---restoring completed---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-07-of-11---granting all privilegies to $TEST_BD for $TEST_USER---"
  /usr/pgsql-12/bin/psql -U $POSTGRES_USER -d $TEST_DB -c "GRANT ALL PRIVILEGES ON DATABASE $TEST_DB TO $TEST_USER;" || ERROR_CODE=7
  echo "-07-of-11---granting completed---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-08-of-11---changing owner for tables in $TEST_DB to $TEST_USER---"
  for tbl in `/usr/pgsql-12/bin/psql -qAt -U $POSTGRES_USER -d $TEST_DB -c "select tablename from pg_tables where schemaname='public';"`
  do 
    /usr/pgsql-12/bin/psql -U $POSTGRES_USER -d $TEST_DB -c "alter table \"$tbl\" owner to $TEST_USER" || ERROR_CODE=8
  done
  echo "-08-of-11---changing completed---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-09-of-11---changing owner for sequences in $TEST_DB to $TEST_USER---"
  for tbl in `/usr/pgsql-12/bin/psql -qAt -U $POSTGRES_USER -d $TEST_DB -c "select sequence_name from information_schema.sequences where sequence_schema = 'public';"`
  do 
    /usr/pgsql-12/bin/psql -U $POSTGRES_USER -d $TEST_DB -c "alter sequence \"$tbl\" owner to $TEST_USER" || ERROR_CODE=9
  done
  echo "-09-of-11---changing completed---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "-10-of-11---changing onwer for sequences in $TEST_DB to $TEST_USER---"
  for tbl in `/usr/pgsql-12/bin/psql -qAt -U $POSTGRES_USER -d $TEST_DB -c "select table_name from information_schema.views where table_schema = 'public';"`
  do 
    /usr/pgsql-12/bin/psql -U $POSTGRES_USER -d $TEST_DB -c "alter view \"$tbl\" owner to $TEST_USER" || ERROR_CODE=10
  done
  echo "-10-of-11---changing completed---"
fi

if [[ "$ERROR_CODE" == "0" ]]
then
  echo "------------migration from $BETA_DB to $TEST_DB completed---"
  echo "-11-of-11---try to run test server---"
  rails server -b 0.0.0.0 -p 5000 -d || ERROR_CODE=11
  echo "-11-of-11---test server is running now---"
elif [[ "$ERROR_CODE" == "1" ]]
then
  echo "error creating backup, check path to pg_dump, name of user ($BETA_USER) and db ($BETA_DB), path for backup file ($BACKUP_PATH)"
elif [[ "$ERROR_CODE" == "2" ]]
then
  echo "check path for test server ($TEST_SERVER_PATH)"
elif [[ "$ERROR_CODE" == "3" ]]
then
  echo "check path for server.pid file"
elif [[ "$ERROR_CODE" == "4" ]]
then
  echo "check that database $TEST_DB and user $TEST_USER exists"
elif [[ "$ERROR_CODE" == "5" ]]
then
  echo "check that database $TEST_DB and user $POSTGRES_USER exists"
elif [[ "$ERROR_CODE" == "6" ]]
then
  echo "check that user $POSTGRES_USER exists and path $BACKUP_PATH is valid"
elif [[ "$ERROR_CODE" == "7" ]] || [[ "$ERROR_CODE" == "8" ]] || [[ "$ERROR_CODE" == "9" ]] || [[ "$ERROR_CODE" == "10" ]]
then
  echo "check that users $POSTGRES_USER and $TEST_USER exists and database $TEST_DB exists"
elif [[ "$ERROR_CODE" == "11" ]]
then
  echo "check test server settings"
fi



