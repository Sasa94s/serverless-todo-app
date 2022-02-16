import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {createTodo} from '../../helpers/todos'
import {getUserId} from '../utils';
import {createLogger} from "../../utils/logger";

const logger = createLogger('createTodo')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Event Request", {request: event?.body})
  const request: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

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
