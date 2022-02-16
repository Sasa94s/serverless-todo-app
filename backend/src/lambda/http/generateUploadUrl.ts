import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import {parseUserId} from "../../auth/utils";
import {addAttachmentUrl} from "../../services/todos";
import {createLogger} from "../../utils/logger";

const logger = createLogger("generateUploadUrl")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Event Request", {request: event?.body})
  const todoId = event.pathParameters.todoId
  const userId = parseUserId(event.headers.Authorization)

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
