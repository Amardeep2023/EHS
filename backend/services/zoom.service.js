import axios from 'axios';
import { Buffer } from 'node:buffer';

class ZoomService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
      console.error('❌ Missing Zoom credentials in environment variables');
      throw new Error('Zoom credentials not configured');
    }

    try {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const response = await axios.post(
        'https://zoom.us/oauth/token',
        new URLSearchParams({
          grant_type: 'account_credentials',
          account_id: accountId
        }),
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
      console.error('Zoom token error:', error.response?.data || error.message);
      throw new Error(`Failed to get Zoom access token: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  async createMeeting(topic, startTime, duration, userEmail, userName) {
    try {
      const token = await this.getAccessToken();
      
      const startDateTime = new Date(startTime);
      const formattedStartTime = startDateTime.toISOString();

      const meetingData = {
        topic: topic,
        type: 2,
        start_time: formattedStartTime,
        duration: duration,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        agenda: `Consultation session with ${userName}`,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          approval_type: 0,
          audio: 'both',
          auto_recording: 'none',
          waiting_room: false
        }
      };

      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        meetingId: response.data.id,
        meetingLink: response.data.join_url,
        startUrl: response.data.start_url,
        password: response.data.password,
        startTime: response.data.start_time
      };
    } catch (error) {
      console.error('Zoom meeting creation error:', error.response?.data || error.message);
      throw new Error('Failed to create Zoom meeting');
    }
  }
}

export default new ZoomService();