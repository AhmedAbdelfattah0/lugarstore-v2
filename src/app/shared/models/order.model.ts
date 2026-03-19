export interface CreateOrderPayload {
  name: string;
  phoneNumber: string;
  address: string;
  state: string;
  statusId: 2;        // always hardcoded to 2
  date: Date;
  email: string;
  products: { productId: number; qty: number }[];
}
