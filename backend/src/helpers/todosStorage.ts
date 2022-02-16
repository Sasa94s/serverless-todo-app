import {createS3Client} from "./awsUtils";


const ATTACHMENT_S3_BUCKET = process.env.ATTACHMENT_S3_BUCKET
const SIGNED_URL_EXPIRATION = Number(process.env.SIGNED_URL_EXPIRATION)

export class TodosStorage {
  constructor(
    private readonly s3 = createS3Client(true)
  ) {
  }

  public static getAttachmentUrl(attachmentId: string): string {
    return `https://${ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${attachmentId}`
  }

  public getUploadUrl(attachmentId: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: ATTACHMENT_S3_BUCKET,
      Key: attachmentId,
      Expires: SIGNED_URL_EXPIRATION
    })
  }
}
