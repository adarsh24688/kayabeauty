import axios from 'axios';

interface TokenData {
  token: string | null;
  expiry: number | null;
}

const tokenData: TokenData = {
  token: null,
  expiry: null,
};

export async function generateToken(): Promise<string> {
  console.log("#########Generating new token...");

  try {
    const response = await axios.post(
      `${process.env.DINGG_API_URL}/tech-partner/generate-token`,
      {},
      {
        headers: {
          'access_code': process.env.DINGG_ACCESS_CODE,
          'api_key': process.env.DINGG_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const { token, expires_in } = response.data;
    const bufferSeconds = 60;

    tokenData.token = token;
    tokenData.expiry = Date.now() + (expires_in - bufferSeconds) * 1000;

    console.log("Token generated and stored:", tokenData);
    return token;
  } catch (err: any) {
    console.error("Error in generateToken:", err.response?.data || err.message);
    throw err;
  }
}

export async function getValidToken(): Promise<string> {
  console.log("Checking token:", tokenData);

  if (!tokenData.token || !tokenData.expiry || Date.now() >= tokenData.expiry) {
    await generateToken();
  }

  return tokenData.token!;
}
