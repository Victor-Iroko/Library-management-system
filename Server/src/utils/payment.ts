import https from 'https'
import ck from 'ckey'

export const makePayment = async (email, amount) => {
  const params = JSON.stringify({
    "email": email,
    "amount": amount // 200 naira is 20000
  });
  
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ck.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  // Wrapping the request in a Promise
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error("Invalid JSON response"));
        }
      });
      
    }).on('error', error => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
};


export const verifyPaymentFunction = async (reference) => {
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ck.PAYSTACK_SECRET_KEY}`
    }
  }

  return new Promise ((resolve, reject) => {
    https.request(options, res => {
      let data = ''
  
      res.on('data', (chunk) => {
        data += chunk
      });
  
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject(new Error("Invalid JSON response"))
        }
      })
    }).on('error', error => {
      reject(error)
    })
  })
}



