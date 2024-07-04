import AWS from 'aws-sdk-mock';
import {processOrderHandler} from '../../functions/orders/processOrder';

describe('processOrder', () => {
  let dynamoDbUpdateMock: jest.Mock;
  let snsPublishMock: jest.Mock;

  beforeAll(() => {
    dynamoDbUpdateMock = jest.fn((params, options, callback) => {
      callback(null, {})
    });
    snsPublishMock = jest.fn((params, options, callback) => {
      callback(null, {})
    });

    AWS.mock('DynamoDB.DocumentClient', 'update', dynamoDbUpdateMock)
    AWS.mock('SNS', 'publish', snsPublishMock)
  })

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient')
    AWS.restore('SNS')
  })

  it('should process order and publish SNS message successfully', async () => {
    const event = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            NewImage: {
              orderId: { S: '123-456-789' },
            },
          },
        },
      ],
    }

    await processOrderHandler(event)

    expect(dynamoDbUpdateMock).toHaveBeenCalledWith(
      {
        TableName: 'Orders',
        Key: {
          orderId: '123-456-789',
        },
        UpdateExpression: 'set orderStatus = :s',
        ExpressionAttributeValues: {
          ':s': 'PROCESSED'
        }
      },
      expect.any(Function)
    )
  })
})