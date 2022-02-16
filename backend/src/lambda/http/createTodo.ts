import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {parseUserId} from '../../auth/utils';
import {createTodo} from '../../services/todos'
import {createLogger} from "../../utils/logger";

const logger = createLogger('createTodo')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Event Request", {request: event?.body})
  const request: CreateTodoRequest = JSON.parse(event.body)
  const userId = parseUserId(event.headers.Authorization)

  const newTodoItem = await createTodo(userId, request)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({item: newTodoItem})
  }
}
