import data from './csv.json'

export const compareSTDwithArea = (pincode: number, std: string): boolean => {
  return data.some((e: any) => e.Pincode === pincode && e['STD Code'] === std)
}

export const compareCitywithPinCode = (pincode: number, city: string): boolean => {
  return data.some((e: any) => e.Pincode === pincode && e.City === city.toUpperCase())
}
