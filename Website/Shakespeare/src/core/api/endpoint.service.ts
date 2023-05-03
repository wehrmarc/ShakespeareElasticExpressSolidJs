import axios from "axios";

export class EndpointService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/${endpoint}`);
    return response.data;
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/${endpoint}`, data);
    return response.data;
  }

  async put(endpoint: string, data: any): Promise<any> {
    const response = await axios.put(`${this.baseUrl}/${endpoint}`, data);
    return response.data;
  }

  async delete(endpoint: string): Promise<any> {
    const response = await axios.delete(`${this.baseUrl}/${endpoint}`);
    return response.data;
  }
}
