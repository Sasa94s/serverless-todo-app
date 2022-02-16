import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import {addAttachmentUrl} from "../../helpers/todos";
import {getUserId} from '../utils'
import {createLogger} from "../../utils/logger";

const logger = createLogger("generateUploadUrl")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Event Request", {request: event?.body})
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const todoItem = await addAttachmentUrl(todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(todoItem)
  }
}
