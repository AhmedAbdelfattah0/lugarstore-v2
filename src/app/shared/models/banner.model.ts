export interface Banner {
  id: string;
  fileUrl: string;
  visible: boolean;
  selected: boolean;
  created_at: string;
  order?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
