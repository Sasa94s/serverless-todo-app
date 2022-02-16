import 'source-map-support/register'

import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {createLogger} from "./logger";


const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AWSUtils')

export function createDynamoDBClient(enableTracing: boolean): DocumentClient {
  if (process.env.IS_OFFLINE) {
    logger.info("Creating a local DynamoDB client")
    return new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }
  if (enableTracing) {
    // @ts-ignore
    return new XAWS.DynamoDB.DocumentClient()
  }
  return new AWS.DynamoDB.DocumentClient()
}

export function createS3Client(enableTracing: boolean) {
  if (enableTracing) {
    return new XAWS.S3({signatureVersion: 'v4'})
  }

  return new AWS.S3({signatureVersion: 'v4'});
}
