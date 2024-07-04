import AWS, {DynamoDB, SNS} from 'aws-sdk'

AWS.config.update({
  region: 'eu-central-1',
});

const dynamodb = new DynamoDB.DocumentClient()
const sns = new SNS()

export const processOrderHandler = async (event: any): Promise<void> => {
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const newOrder = record.dynamodb.NewImage;

      const params = {
        TableName: 'Orders',
        Key: {
          orderId: newOrder.orderId.S
        },
        UpdateExpression: 'set orderStatus = :s',
        ExpressionAttributeValues: {
          ':s': 'PROCESSED'
        }
      }

      await dynamodb.update(params).promise()
      //Notify via SNS
      // const snsParams = {
      //   Message: `Order ${newOrder.orderId.S} processed successfully`,
      //   TopicArn: 'arn:aws:sns:eu-central-1:account-id-tbd:orderNotifications'
      // }
      //
      // await sns.publish(snsParams).promise()
    }
  }
}