import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createMarket(event, context) {
  const {
    country,
    currency,
    code_symbol,
    show_cents,
    display,
  } = JSON.parse(event.body);

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

  await dynamodb
    .put({
      TableName: process.env.MARKETS_TABLE_NAME,
      Item: market,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(market),
  };
}

export const handler = createMarket;
