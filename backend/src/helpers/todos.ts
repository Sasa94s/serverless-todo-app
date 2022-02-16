import {TodosAccess} from './todosAccess'
import {TodosStorage} from "./todosStorage";
import {AttachmentUtils} from './attachmentUtils';
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import {UpdateTodoRequest} from '../requests/UpdateTodoRequest'
import {TodoItem} from '../models/TodoItem'
import * as uuid from 'uuid'

const todoAccess = new TodosAccess()
const todoStorage = new TodosStorage()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(userId: string) {
  return await todoAccess.getTodoItems(userId);
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()

  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createTodoRequest
  }

  await todoAccess.createTodoItem(newItem)

  return newItem
}

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest, userId: string): Promise<void> {
  await todoAccess.updateTodoItem(todoId, updateTodoRequest, userId)
}

export async function deleteTodo(todoId: string, userId: string) {
  await todoAccess.deleteItem(userId, todoId)
}

export async function addAttachmentUrl(todoId: string, userId: string): Promise<TodoItem> {
  const attachmentId = uuid.v4()
  const attachmentUrl = TodosStorage.getAttachmentUrl(attachmentId)
  const uploadUrl = todoStorage.getUploadUrl(attachmentId)

  const todoItem = await attachmentUtils.addAttachmentUrl(userId, todoId, attachmentUrl)
  todoItem.attachmentUrl = uploadUrl

  return todoItem
}
