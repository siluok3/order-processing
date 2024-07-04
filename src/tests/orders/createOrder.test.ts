import AWSMock from 'aws-sdk-mock'
import AWS from 'aws-sdk'

import { createOrderHandler } from '../../functions/orders/createOrder'

describe('createOrder', () => {
  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('should create an order successfully', async () => {
    AWSMock.setSDKInstance(AWS)
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, {})
    })

    const event = {
      body: JSON.stringify({
        orderId: '123-456-789',
        customerName: 'Kiriakos Pap'
      })
    }

    const result = await createOrderHandler(event)

    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body).message).toBe('Order created successfully')
  })

  it('should fail when creating an order', async () => {
    AWSMock.setSDKInstance(AWS)
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(new Error('error'), {})
    })

    const event = {
      body: JSON.stringify({
        orderId: '123-456-789',
        customerName: 'Kiriakos Pap'
      })
    }

    const result = await createOrderHandler(event)

    expect(result.statusCode).toBe(500)
    expect(JSON.parse(result.body).message).toBe('Failed to create order')
  })
})