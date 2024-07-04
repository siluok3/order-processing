## Install dependencies
Execute: `npm install`

## Testing
For test coverage execute: `npm test`

## Setup aws credential
Download and install locally the `AWS CLI` and then set up the AWS
credential with `aws configure` and add your Access Key ID and Secret Access Key.

For mac users you can use homebrew with `brew install awscli`

## Deploy the service to serverless
Execute: `npx serverless deploy`

This will deploy all the available lambdas to AWS.