import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getMarkets(event, context) {
  let markets;

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.MARKETS_TABLE_NAME,
      })
      .promise();

    markets = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(markets),
  };
}

export const handler = commonMiddleware(getMarkets);
