const { v4 } = require('uuid');
const { getRequestToPay, requestToPay } = require('../helpers/momo');

const makePayment = async (req, res) => {
  const { phone, amount, uid } = req.body;
  const errors = [];

  if(!phone) {
    errors.push({"msg": "please enter your phone number"});
  }
  if(!amount) {
    errors.push({"msg": "please enter the amount"});
  }
  if(!uid) {
    errors.push({"msg": "please enter the uid"});
  }
  if(errors.length > 0) {
    return res.status(400).json({success: false, errors})
  }

  try {

    // const uuid = v4();
    // console.log('uuid: ', uuid);
    const requestPayment = await requestToPay(uid, {
      amount: amount,
      currency: 'EUR',
      externalId: uid,
      payer: { partyIdType: 'MSISDN', partyId: phone },
      payerMessage: 'Payment de votre article!',
      payeeNote: `Payement de l'article par MOMO, commande ${1234564}`,
    });
    console.log('requestTopay1: ', requestPayment.status);
    if(requestPayment.status !== 202) {
      return res.status(500).json({"msg": "server error"})
    }
    // const getRequestPayment = await getRequestToPay(requestPayment.id, requestPayment.token);
    // console.log('getRequestToPay: ', getRequestPayment);
    res.status(200).json({success: true, data: { status: requestPayment.status, message: 'payment initiated...'}});
  } catch(err) {
    console.error('Some errors occured: ', err);
  }
}

const getPayment = async (req, res) => {
  const id = req.params.id;

  try {
    const getRToPay = await getRequestToPay(id);
    console.log('getRToPay: ', getRToPay);
    if(getRToPay.status !=='PENDING') {
      return res.status(200).json({success: false, data: { message: "payment failed"}});
    }
    res.status(200).json({success: true, data: {payment: getRToPay, message: "payment confirmed"}});
  } catch (err) {
    console.error('ss errors: ', err);
  }
}


module.exports = {
  makePayment,
  getPayment
}
