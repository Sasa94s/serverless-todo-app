import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {TodoItem} from "../models/TodoItem";
import {createDynamoDBClient} from "../utils/awsUtils";
import {createLogger} from "../utils/logger";

const logger = createLogger('AttachmentUtils')

const TODOS_TABLE = process.env.TODOS_TABLE

export class AttachmentRepository {

  constructor(
    private readonly client: DocumentClient = createDynamoDBClient(true)
  ) {
  }

  async addAttachmentUrl(userId: string, todoId: string, url: string): Promise<TodoItem> {
    logger.info("Add Attachment URL", {
      todoId,
      userId,
    })

    const updateResult = await this.client
      .update({
        TableName: TODOS_TABLE,
        Key: {
          userId,
          todoId,
        },
        ConditionExpression: "userId = :userId and todoId = :todoId",
        ExpressionAttributeNames: {
          "#urls": "attachmentUrl"
        },
        ExpressionAttributeValues: {
          ":userId": userId,
          ":todoId": todoId,
          ":newUrl": url
        },
        UpdateExpression: "SET #urls = :newUrl",
        ReturnValues: "ALL_NEW"
      })
      .promise()

    return updateResult.Attributes as TodoItem
  }
}
