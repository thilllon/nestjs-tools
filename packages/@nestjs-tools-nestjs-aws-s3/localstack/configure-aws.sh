#!/usr/bin/env bash

# ----------------------------------------------------------------
REGION="us-east-1"
AWS_ACCESS_KEY_ID="ID"
AWS_SECRET_ACCESS_KEY="KEY"
# ----------------------------------------------------------------

mkdir -p ~/.aws

FILENAME=~/.aws/config
COUNT=$(grep -sc region ${FILENAME} | tr -d ' ')
if [[ $COUNT -le 0 ]]; then
  TEXT="[default]
region = ${REGION}
"
  echo "${TEXT}" >${FILENAME}
  chmod 600 ${FILENAME}
fi

FILENAME=~/.aws/credentials
COUNT=$(grep -sc aws_access_key_id ${FILENAME} | tr -d ' ')
if [[ $COUNT -le 0 ]]; then
  TEXT="[default]
aws_access_key_id = ${AWS_ACCESS_KEY_ID}
aws_secret_access_key = ${AWS_SECRET_ACCESS_KEY}
"
  echo "${TEXT}" >${FILENAME}
  chmod 600 ${FILENAME}
fi
