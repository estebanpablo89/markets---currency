const url =
  'https://zwc0k6q37a.execute-api.us-east-2.amazonaws.com/dev';

const request = require('supertest')(url);

const validMarket = {
  country: 'Ecuador',
  currency: 'USD',
  code_symbol: 'symbol',
  currency_before_price: true,
  show_cents: true,
  display: '#.###',
};

const postMarket = (market = validMarket) => {
  return request.post('/market').send(market);
};

describe('Market', () => {
  it('returns 201 OK when a market is created', async () => {
    const response = await postMarket();
    expect(response.status).toBe(201);
    request.delete(`/market/${response.body.id}`);
  });

  it('returns 201 OK with data when a market is created', async () => {
    const response = await postMarket();
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.country).toBeDefined();
    expect(response.body.currency).toBeDefined();
    request.delete(`/market/${response.body.id}`);
  });

  it('returns saved market from database', async () => {
    const response = await postMarket();
    const market = await request.get(`/market/${response.body.id}`);
    expect(response.body.id).toBe(market.body.id);
    request.delete(`/market/${response.body.id}`);
  });

  it('returns 400 status and Missing fields message if a value in market is falsy', async () => {
    const response = await postMarket({
      country: 'Ecuador',
      currency: 'USD',
      code_symbol: 'symbol',
      currency_before_price: true,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing fields');
  });

  it('returns 400 status and Incorrect currency message if currency in market is incorrect', async () => {
    const response = await postMarket({
      country: 'Ecuador',
      currency: 'lh4jk32h',
      code_symbol: 'symbol',
      currency_before_price: true,
      show_cents: true,
      display: '#.###',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      'Incorrect currency, supported format values are: USD, CAD, EUR...'
    );
  });
});
