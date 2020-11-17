export interface ICurrencyMap {
  [key: string]: IValute
}

export interface IValute {
  ID: string
  NumCode: number
  CharCode: string
  Nominal: number
  Name: string
  Value: number
  Previous: number
}
