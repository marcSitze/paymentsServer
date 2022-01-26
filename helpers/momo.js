const axios = require('axios');
const { v4 } = require('uuid');



const momo = {
    host: 'https://sandbox.momodeveloper.mtn.com',
    primaryKey: '3de38d0b2cc04d1c861f8d4d2a743e1e',
    //primaryKey: '3ffa5d893a3740c692f7fb0f632f5dcc',
    environment: 'sandbox',
    providerCallbackHost: 'webhook.site',
    callBackUrl: 'https://webhook.site/1d02fa3c-9724-42e6-966d-5fe3062fe86e',
 };

const { host, primaryKey, environment, providerCallbackHost, callBackUrl } = momo;
const getTodos = async () => {
  const res = await axios({
    url: 'https://jsonplaceholder.typicode.com/todos',
    method: 'GET'
  });

  return res;
}

const createApiUser = async (id) => {
  await axios({
    url: `${host}/v1_0/apiuser`,
    method: 'POST',
    headers: {
      'X-Reference-Id': id,
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': primaryKey,
    },
    data: {
      providerCallbackHost,
    },
  });
  return id;
};

const getApiUser = async (id) => {
  const res = await axios({
    url: `${host}/v1_0/apiuser/${id}`,
    method: 'GET',
    headers: {
      'X-Reference-Id': id,
      'Ocp-Apim-Subscription-Key': primaryKey,
    },
  });
  return { res, id };
};

const generateApiKey = async (id) => {
  const res = await axios({
    url: `${host}/v1_0/apiuser/${id}/apikey`,
    method: 'POST',
    headers: {
      'X-Reference-Id': id,
      'Ocp-Apim-Subscription-Key': primaryKey,
    },
  });
  return { data: res.data, id };
};

const generateAccessToken = async (id, apiKey) => {
  const authorization = Buffer.from(`${id}:${apiKey}`).toString('base64');
  const res = await axios({
    url: `${host}/collection/token/`,
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': primaryKey,
      Authorization: `Basic ${authorization}`,
    },
  });
  return { data: res.data, id };
};

const requestToPay = async (id, payment) => {

  try {
    const createUser = await createApiUser(id);
    const getUser = await getApiUser(createUser);
    const getApiKey = await generateApiKey(getUser.id);
    const getToken = await generateAccessToken(getApiKey.id, getApiKey.data.apiKey);
    // console.log('getToken: ', getToken.data)
    const res = await axios({
      url: `${host}/collection/v1_0/requesttopay`,
      method: 'POST',
      headers: {
        'X-Reference-Id': id,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': primaryKey,
        Authorization: `Bearer ${getToken.data.access_token}`,
        'X-Target-Environment': environment,
        'X-CallBack-Url': callBackUrl,
      },
      data: payment,
    });
    return res;
  } catch (err) {
    console.error('somethingWR: ', err);
  }

};

const getRequestToPay = async (id) => {
  try {
    const getApiKey = await generateApiKey(id);
    const getToken = await generateAccessToken(getApiKey.id, getApiKey.data.apiKey);

    const res = await axios({
      url: `${host}/collection/v1_0/requesttopay/${id}`,
      method: 'GET',
      headers: {
        'referenceId': id,
        'Ocp-Apim-Subscription-Key': primaryKey,
        Authorization: `Bearer ${getToken.data.access_token}`,
        'X-Target-Environment': environment,
      },
    });

    return res.data;
  } catch (err) {
    console.error('SomethingWR: ', err);
  }
};



//getTodos().then(data => console.log(data.data)).catch(err => console.error('somet: ', err));

// createApiUser(v4()).then(data => console.log(data.data)).catch(err => console.error('somet: ', err));

module.exports = {
  createApiUser,
  getApiUser,
  generateApiKey,
  generateAccessToken,
  requestToPay,
  getRequestToPay,
  getTodos
}
