export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: any;
  expires_in: number;
  token_type: string;
}
