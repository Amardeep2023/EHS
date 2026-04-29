import axios from 'axios';
import { Buffer } from 'node:buffer';

class PayPalService {
  constructor() {
    this.mode = process.env.PAYPAL_MODE || 'sandbox';
    this.baseUrl = this.mode === 'sandbox' 
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Missing PayPal credentials in process.env');
      throw new Error('PayPal credentials not configured in backend .env');
    }

    try {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      const errorData = error.response?.data || error.message;
      console.error('❌ PayPal token error detail:', JSON.stringify(errorData, null, 2));
      throw new Error(`Failed to get PayPal access token: ${JSON.stringify(errorData)}`);
    }
  }

  async createOrder(amount, currency, bookingId, returnUrl, cancelUrl) {
    try {
      const token = await this.getAccessToken();
      
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: bookingId,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2), // PayPal expects strings like "197.00"
          },
          description: 'Consultation Session Booking',
          custom_id: bookingId
        }],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'Embracing Higher Self',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW'
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const approvalLink = response.data.links.find(link => link.rel === 'approve');
      
      if (!approvalLink) {
        throw new Error('No approval link found in PayPal response');
      }

      return {
        orderId: response.data.id,
        approvalUrl: approvalLink.href
      };
    } catch (error) {
      const errorDetail = error.response?.data || error.message;
      console.error('❌ PayPal order creation error detail:', JSON.stringify(errorDetail, null, 2));
      throw new Error(`Failed to create PayPal order: ${JSON.stringify(errorDetail)}`);
    }
  }

  async captureOrder(orderId) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const captured = response.data.status === 'COMPLETED';
      console.log(`PayPal capture response - Status: ${response.data.status}, Captured: ${captured}`);
      
      return {
        captured: captured,
        paymentId: response.data.purchase_units[0]?.payments?.captures[0]?.id,
        amount: response.data.purchase_units[0]?.payments?.captures[0]?.amount?.value,
        currency: response.data.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code,
        status: response.data.status,
        fullResponse: response.data
      };
    } catch (error) {
      const errorDetail = error.response?.data || error.message;
      console.error('❌ PayPal capture error detail:', JSON.stringify(errorDetail, null, 2));
      console.error('❌ PayPal capture error status:', error.response?.status);
      throw new Error(`Failed to capture PayPal payment: ${JSON.stringify(errorDetail)}`);
    }
  }
}

export default new PayPalService();