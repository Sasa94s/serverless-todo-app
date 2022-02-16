import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import {deleteTodo} from '../../services/todos'
import {parseUserId} from '../../auth/utils'
import {createLogger} from "../../utils/logger";

const logger = createLogger("deleteTodo")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Event Request", {request: event?.body})
  const todoId = event.pathParameters.todoId
  const userId = parseUserId(event.headers.Authorization)
  await deleteTodo(todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
