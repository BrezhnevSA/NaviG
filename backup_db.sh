#!/bin/bash

echo "creating backup of DB"
/usr/pgsql-12/bin/pg_dump -F c -U navi_back navi_back_development > /var/www/navi2020/backup.dump
echo "backup created"
