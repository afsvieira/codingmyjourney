export class Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  comment: string;
  read?: boolean;
  replied?: boolean;
  date?: Date;
}
