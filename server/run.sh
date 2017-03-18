#!/bin/sh

# Load environment variables
aws s3 cp s3://sekure-archive-ec2/.env .

# Run server
npm run produce
