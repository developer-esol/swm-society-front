export interface AdminProduct {
  id: string
  productName: string
  description: string
  brandId: string
  brandName: string
  deliveryMethod: string
  imageUrl: string
  price: number
}
export interface AddProductFormData {
  brandId: string
  productName: string
  deliveryMethod: string
  description: string
  price: string
  imageUrl: string
}

export interface AddProductPayload extends Omit<AddProductFormData, 'price'> {
  price: number
}