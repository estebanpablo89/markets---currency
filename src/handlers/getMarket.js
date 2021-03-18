import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getMarketById(id) {
  let market;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.MARKETS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    market = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!market) {
    throw new createError.NotFound(`Market with ID ${id} not found!`);
  }

  return market;
}

async function getMarket(event, context) {
  const { id } = event.pathParameters;

  const market = await getMarketById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(market),
  };
}

export const handler = commonMiddleware(getMarket);
