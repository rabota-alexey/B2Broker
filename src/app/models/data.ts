export interface DataModel {
  id: string;
  int: number;
  float: number;
  color: string;
  child: { id: string; color: string };
}

export interface DataToSend {
  interval: number;
  size: number;
}
