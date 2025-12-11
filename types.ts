export enum Role {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface WebhookResponse {
  output?: string;
  text?: string;
  message?: string;
  [key: string]: any;
}