import { Trade } from '../types/trade';

const API_BASE_URL = '/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  data: T;
  message: string;
  error: string | null;
}

export const fetchTrades = async (): Promise<Trade[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Fetch Trades Response Status:', response.status);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch trades: ${response.statusText}`
      );
    }

    const apiResponse: ApiResponse<Trade[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchTradeById = async (id: string): Promise<Trade> => {
  try {
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Fetch Trade By ID Response Status:', response.status);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch trade: ${response.statusText}`
      );
    }

    const apiResponse: ApiResponse<Trade> = await response.json();
    return apiResponse.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const createTrade = async (trade: Omit<Trade, 'id'>): Promise<Trade> => {
  try {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trade),
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to create trade: ${response.statusText}`
      );
    }

    const apiResponse: ApiResponse<Trade> = await response.json();
    return apiResponse.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateTrade = async (id: string, trade: Trade): Promise<Trade> => {
  try {
    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trade),
    });

    console.log('Update Trade Response Status:', response.status);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to update trade: ${response.statusText}`
      );
    }

    const apiResponse: ApiResponse<Trade> = await response.json();
    return apiResponse.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
