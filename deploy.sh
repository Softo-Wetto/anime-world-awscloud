#!/bin/bash

# Set variables
AWS_ACCOUNT_ID=901444280953
REGION=ap-southeast-2
FRONTEND_REPO_NAME=n11283602-frontend-ass1
BACKEND_REPO_NAME=n11283602-backend-ass1
FRONTEND_TAG=latest
BACKEND_TAG=latest

# Authenticate Docker to ECR
echo "Authenticating Docker to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build, tag, and push the frontend image
echo "Building frontend image..."
docker build -t $FRONTEND_REPO_NAME ./frontend

echo "Tagging frontend image..."
docker tag $FRONTEND_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$FRONTEND_REPO_NAME:$FRONTEND_TAG

echo "Pushing frontend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$FRONTEND_REPO_NAME:$FRONTEND_TAG

# Build, tag, and push the backend image
echo "Building backend image..."
docker build -t $BACKEND_REPO_NAME ./backend

echo "Tagging backend image..."
docker tag $BACKEND_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$BACKEND_REPO_NAME:$BACKEND_TAG

echo "Pushing backend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$BACKEND_REPO_NAME:$BACKEND_TAG

echo "Deployment complete."
