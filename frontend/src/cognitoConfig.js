import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,   // Cognito User Pool ID
  ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,    // Cognito App Client ID
};

export const userPool = new CognitoUserPool(poolData);
