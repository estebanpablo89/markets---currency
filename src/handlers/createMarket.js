import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createMarket(event, context) {
  const {
    country,
    currency,
    code_symbol,
    show_cents,
    display,
  } = event.body;

  const now = new Date();

  const market = {
    id: uuid(),
    country,
    currency,
    format: {
      code_symbol,
      show_cents,
      display,
    },
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.MARKETS_TABLE_NAME,
        Item: market,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(market),
  };
}

export const handler = commonMiddleware(createMarket);
