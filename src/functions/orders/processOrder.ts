import {DynamoDB, SNS} from 'aws-sdk'

type Record = {
  eventName: EventType
}

const dynamodb = new DynamoDB.DocumentClient()
const sns = new SNS()

exports.handler = async(event: any): Promise<void> => {
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const newOrder = record.dynomodb.newImage;

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
      const snsParams = {
        Message: `Order ${newOrder.orderId.S} processed successfully`,
        TopicArn: 'arn:aws:sns:region-tbd:account-id-tbd:orderNotifications'
      }

      await sns.publish(snsParams).promise()
    }
  }
}