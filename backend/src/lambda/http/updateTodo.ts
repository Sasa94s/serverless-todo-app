import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import {parseUserId} from "../../auth/utils";
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {updateTodo} from '../../services/todos'
import {createLogger} from "../../utils/logger";

const logger = createLogger('updateTodo')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Event Request", {request: event?.body})
  const todoId = event.pathParameters.todoId
  const request: UpdateTodoRequest = JSON.parse(event.body)
  const userId = parseUserId(event.headers.Authorization)

  await updateTodo(todoId, request, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
