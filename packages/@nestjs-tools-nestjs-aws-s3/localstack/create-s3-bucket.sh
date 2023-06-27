#!/usr/bin/env bash

# ----------------------------------------------------------------
BUCKET="my-bucket"
REGION="us-east-1"
# ----------------------------------------------------------------

DIR=$(dirname $0)
cd ${DIR}
./configure-aws.sh

BUCKETS=$(awslocal s3api list-buckets | jq '.Buckets[].Name')
echo "[BUCKETS] "$BUCKETS""

# create a bucket
if [[ ${BUCKETS} != *"${BUCKET}"* ]]; then
  RESULT=$(awslocal s3api create-bucket --bucket "${BUCKET}" --create-bucket-configuration LocationConstraint="${REGION}")
  echo "[CREATED] ${BUCKET}: $RESULT"
fi

# delete a bucket
# if [[ ${BUCKETS} != *"${BUCKET}"* ]]; then
#   RESULT=$(awslocal s3api delete-bucket --bucket "${BUCKET}")
#   echo "[DELETED] ${BUCKET}: $RESULT"
# fi
