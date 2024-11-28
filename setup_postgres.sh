#!/bin/bash

# Path to the pg_hba.conf file
PG_HBA_CONF="/etc/postgresql/14/main/pg_hba.conf"

# Backup the original pg_hba.conf file
cp $PG_HBA_CONF $PG_HBA_CONF.bak

# Modify the pg_hba.conf file to use md5 authentication
sed -i "s/local   all             all                                     peer/local   all             all                                     md5/" $PG_HBA_CONF

# Restart PostgreSQL service
service postgresql restart