// assuming the last 4 fields are not nullable

export interface TrafficData {
  client: string | null;
  userId: string | null;
  date: Date | null;
  method: string;
  request: string;
  status: number;
  size: number;
}
