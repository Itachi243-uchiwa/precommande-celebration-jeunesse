export type TShirtColor = 'noir' | 'blanc'
export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'XXXXL'
export type OrderStatus = 'en_attente' | 'payee' | 'annulee'

export interface CartItem {
  couleur: TShirtColor
  taille: TShirtSize
  quantite: number
  prixUnitaire: number
}

export interface Order {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  items: CartItem[]
  total: number
  statut: OrderStatus
  dateCommande: string
}
