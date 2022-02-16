# Serverless TODO Application

A simple TODO application using AWS Lambda and Serverless framework. 

This application allows creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

**ServiceEndpoint**: https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev

**Pages screenshots** can be found at [PAGES.md](./PAGES.md)

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless 
   ```bash
   sls login
   ```
   * Deploy Changes
  ```bash
  sls deploy --aws-profile default -v
  ```

## Getting Started

### Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

### Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

## APIs

### Postman collection

You can use the Postman collection that contains sample request/response, as an alternative way to test each API.

Postman collection: [Serverless-TODO-App.postman_collection.json](./Serverless-TODO-App.postman_collection.json)

### `GET` - GetTodos
`GET` - https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos

<details>
  <summary>Expand to show sample Request/Response</summary>


Request:
```shell
curl --location --request GET 'https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos' \
--header 'Authorization: Bearer TOKEN'
```
Response:
```json
{
    "items": [
        {
            "todoId": "5230ab06-4ebc-4c58-8df2-86e365dc96f0",
            "attachmentUrl": "https://sapp-todo-images-dev.s3.amazonaws.com/1bead47d-0ac5-411a-aaef-51dcbd207728",
            "userId": "google-oauth2|110875571614653295734",
            "dueDate": "2022-02-23",
            "createdAt": "2022-02-16T01:33:54.546Z",
            "name": "TODO I#1",
            "done": false
        }
    ]
}
```
</details>

### `POST` - CreateTodo
`POST` - https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos

<details>
  <summary>Expand to show sample Request/Response</summary>


Request:
```shell
curl --location --request POST 'https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer TOKEN' \
--data-raw '{
	"name": "Water flowers",
	"dueDate": "2019-06-11"
}'
```
Response:
```json
{
    "item": {
        "userId": "google-oauth2|110875571614653295734",
        "todoId": "9962b406-a756-4e35-a537-037df04f2d80",
        "createdAt": "2022-02-16T02:21:08.011Z",
        "done": false,
        "attachmentUrl": null,
        "name": "Water flowers",
        "dueDate": "2019-06-11"
    }
}
```
</details>

### `PATCH` - UpdateTodo
`PATCH` - https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}

<details>
  <summary>Expand to show sample Request/Response</summary>

Request:
```shell
curl --location --request PATCH 'https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos/5230ab06-4ebc-4c58-8df2-86e365dc96f0' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer TOKEN' \
--data-raw '{
	"name": "Change the world",
	"dueDate": "2019-12-11",
	"done": true
}'
```
Response:
```json
{}
```
</details>

### `DELETE` - DeleteTodo
`DELETE` - https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}

<details>
  <summary>Expand to show sample Request/Response</summary>

Request:
```shell
curl --location --request DELETE 'https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos/9962b406-a756-4e35-a537-037df04f2d80' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer TOKEN' \
--data-raw ''
```
Response:
```json
{}
```
</details>

### `POST` - GetAttachmentUrl
`POST` - https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos/{todoId}/attachment

<details>
  <summary>Expand to show sample Request/Response</summary>

Request:
```shell
curl --location --request POST 'https://2z79lri4b7.execute-api.us-east-1.amazonaws.com/dev/todos/5230ab06-4ebc-4c58-8df2-86e365dc96f0/attachment' \
--header 'Authorization: Bearer TOKEN' \
--data-raw ''
```
Response:
```shell
{
    "todoId": "5230ab06-4ebc-4c58-8df2-86e365dc96f0",
    "attachmentUrl": "https://sapp-todo-images-dev.s3.amazonaws.com/1b8d9f3d-55c9-4c0a-a030-ab3046893230?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA3EYVIQZAC3K2H6G5%2F20220216%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220216T022252Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGsaCXVzLWVhc3QtMSJGMEQCIHgQjZYGwmFfKEh8oWDskc3s4M2IXc%2F9n%2BZECmpglgn4AiAinO8yohoO0ox%2BqONd9if2GqtSbB5t0MEmolibMyT8yCq3Agiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDc2NjE1OTM5MDI3MiIMdcB5HAGGMI%2Bob%2BtlKosCMu874A4N87GVqkQWsUdiz6y5lXlHOvStHPlytWakxqMZ8z%2BsHPOPezvtJ12YN1Qt2xR1BuIZ5OJ%2FPTcxYi7RUOhtkdYzxoLPuC1pPeqSMC8Wi0m%2FoiTo9l9oHAFFC2Y%2BHKGZfDUYK0zIDNwQPonEi1DGDvelGCvCs0ijk7J0Eg2dnyMbKeFZK4RK5kdPFcA7cEBmnG0MLAKeW8XidKjOnrq5%2BxiHWMC18AEtggs5fr0C3XVGRVHIkiu3Px%2F%2Fsi%2FQVAbMqXr%2Fj5Z3GplvV3XTv0aKUQTJ%2Fp9RIUFCDVq1S%2BUkOpjtii4iSa45WywluH93Zpvfrt9WvfAN9bPCSP4XCd4kJxdpABIz0f3gMPm9sZAGOpsBA0FUbw%2FrujrDGxT7iu04%2FAPSZViFMfmaLXI5WO7lRI4X7%2FxHkqqVVmOHKzZjs3SEVmVrUCytu26vCB5ls6GbiqGNhGrolWMv2xI4nKhrVtykvnOKUafac1Xn1XKiTbrhi8YthQnvTp5qkdW3dDA%2FTpCQyAjhLurPuoZuSIoYT%2BlYHPNhO7nT8NoKJK1Q9IOdUuczJQmkWeUZmWk%3D&X-Amz-Signature=a7c8ff1a9ba60efd64ca1836a162119156e878987f2a800e17565b73209e75f4&X-Amz-SignedHeaders=host",
    "userId": "google-oauth2|110875571614653295734",
    "dueDate": "2022-02-23",
    "createdAt": "2022-02-16T01:33:54.546Z",
    "name": "TODO I#1",
    "done": false
}
```
</details>


## Authentication

Auth0 is used as a third-party OAuth provider using asymmetrically encrypted JWT tokens with `RS256` signature algorithm.
<details>
  <summary>Expand to show Configurations Summary</summary>

Configurations Summary:
```yaml
Application Type: Single Page Application
Allowed Callback URLs: http://localhost:3000/callback
Allowed Web Origins: http://localhost:3000/
ID Token Expiration: 432000
Absolute Lifetime: 2592000
Inactivity Lifetime: 1296000
JSON Web Token (JWT) Signature Algorithm: RS256
OIDC Conformant: False
```
</details>

## Best practices

- Optimized Code Size by adding the below in `serverless.yaml`:
  ```yaml
  package:
    individually: true
  ```
  <details>
    <summary>Expand to show code size of <code>zip</code> packages</summary>
  
  <pre>
  ls -lash .serverless
  total 22024
  0 drwxr-xr-x  12 melsheikh  staff   384B Feb 16 04:16 .
  0 drwxr-xr-x  12 melsheikh  staff   384B Feb 16 04:16 ..
  1160 -rw-r--r--   1 melsheikh  staff   523K Feb 16 04:16 Auth.zip
  4104 -rw-r--r--   1 melsheikh  staff   1.8M Feb 16 04:16 CreateTodo.zip
  4104 -rw-r--r--   1 melsheikh  staff   1.8M Feb 16 04:16 DeleteTodo.zip
  4104 -rw-r--r--   1 melsheikh  staff   1.8M Feb 16 04:16 GenerateUploadUrl.zip
  4104 -rw-r--r--   1 melsheikh  staff   1.8M Feb 16 04:16 GetTodos.zip
  4104 -rw-r--r--   1 melsheikh  staff   1.8M Feb 16 04:16 UpdateTodo.zip
  8 -rw-r--r--   1 melsheikh  staff   2.0K Feb 16 04:13 cloudformation-template-create-stack.json
  120 -rw-r--r--   1 melsheikh  staff    60K Feb 16 04:16 cloudformation-template-update-stack.json
  24 -rw-r--r--   1 melsheikh  staff    10K Feb 16 04:16 custom-resources.zip
  192 -rw-r--r--   1 melsheikh  staff    93K Feb 16 04:16 serverless-state.json
  </pre>
  </details>

- Enabled AWS X-Ray Metrics by adding the below in `serverless.yaml`:
  ```yaml
  tracing:
    lambda: true
    apiGateway: true
  ```
  <details>
    <summary>Expand to show X-Ray Metrics</summary>

  ![AWS X-Ray - Services Map](images/aws-xray-smap.png)
  ![AWS X-Ray - Traces](images/aws-xray-traces.png)
  </details>

## Logging

Code is configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. 

<details>
  <summary>Expand to show CloudWatch Logs</summary>

![CloudWatch - Log Groups](images/cloudwatch-loggroups.png)
![CloudWatch - Auth Logs](images/cloudwatch-authlogs.png)
![CloudWatch - CreateTodo Logs](images/cloudwatch-createtodologs.png)
</details>
