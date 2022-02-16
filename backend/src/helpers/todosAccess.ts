import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate';
import {createLogger} from '../utils/logger'
import {createDynamoDBClient} from "./awsUtils";

const logger = createLogger('TodosAccess')

const TODOS_TABLE = process.env.TODOS_TABLE

export class TodosAccess {
  constructor(
    private readonly client: DocumentClient = createDynamoDBClient(true)
  ) {
  }

  async getTodoItems(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting TODO Items for User ${userId}`)

    const result = await this.client.query({
      TableName: TODOS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    logger.info(`Retrieved ${items.length} TODO Items for User ${userId}`)

    return items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem) {
    logger.info(`Creating TODO Item ${todoItem.todoId}`)

    await this.client.put({
      TableName: TODOS_TABLE,
      Item: todoItem,
    }).promise()
  }

  async updateTodoItem(todoId: string, todoUpdate: TodoUpdate, userId: string) {
    logger.info(`Updating TODO Item`, {
      todoId,
      userId,
    })

    await this.client.update({
      TableName: TODOS_TABLE,
      Key: {
        todoId,
        userId,
      },
      ConditionExpression: "userId = :userId and todoId = :todoId",
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":todoId": todoId,
        ":name": todoUpdate.name,
        ":dueDate": todoUpdate.dueDate,
        ":done": todoUpdate.done
      },
      ReturnValues: "ALL_NEW"
    }).promise()
  }

  async deleteItem(userId: string, todoId: string) {
    await this.client
      .delete({
        TableName: TODOS_TABLE,
        Key: {
          userId,
          todoId,
        },
        ConditionExpression: "userId = :userId and todoId = :todoId",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":todoId": todoId,
        },
      })
      .promise();
  }
}
