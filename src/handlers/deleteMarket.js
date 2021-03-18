import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import { getMarketById } from './getMarket';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteMarket(event, context) {
  const { id } = event.pathParameters;

  await getMarketById(id);

  const params = {
    TableName: process.env.MARKETS_TABLE_NAME,
    Key: { id },
  };

  try {
    await dynamodb.delete(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(`Market with ID ${id} was deleted`),
  };
}

export const handler = commonMiddleware(deleteMarket);
