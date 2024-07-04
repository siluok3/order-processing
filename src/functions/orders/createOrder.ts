import {DynamoDB} from 'aws-sdk'
import AWS from 'aws-sdk'
import {OrderStatus} from './types';

type CreateOrderRequestParams = {
  TableName: string
  Item: OrderParams
}

type CreateOrderResponse = {
  statusCode: number;
  body: string;
}

type OrderParams = {
  orderId: string
  customerName: string
  orderStatus: OrderStatus
  createdAt: string
}

AWS.config.update({
  region: 'eu-central-1',
});

const dynamoDB = new DynamoDB.DocumentClient()

export const createOrderHandler = async (event: any): Promise<CreateOrderResponse> => {
  const data = JSON.parse(event.body)

  const params: CreateOrderRequestParams = {
    TableName: 'Orders',
    Item: {
      orderId: data.orderId,
      customerName: data.customerName,
      orderStatus: OrderStatus.Pending,
      createdAt: new Date().toISOString(),
    }
  }

  try {
    await dynamoDB.put(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order created successfully' })
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create order', error })
    }
  }
}