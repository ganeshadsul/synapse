export interface PostgresError {
  code: number;
  detail?: string;
  table?: string;
  message?: string;
}
