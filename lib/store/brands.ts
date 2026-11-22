export const laptopBrands = [
  'Acer', 'Alienware', 'Apple', 'AORUS', 'Asus', 'Avita', 'Axioo',
  'Chuwi', 'Clevo', 'Compaq', 'Dell', 'Digital Storm', 'Durabook', 'Dynabook',
  'Eluktronics', 'Eurocom', 'Fujitsu', 'Framework', 'Gateway', 'Gigabyte',
  'Hasee', 'HCL', 'Honor', 'HP', 'Huawei', 'iBall', 'iLife', 'Infinix',
  'Jio', 'Joi', 'Jumper', 'Lava', 'Lenovo', 'LG', 'Machenike', 'Medion',
  'Mechrevo', 'Microsoft', 'MSI', 'Multilaser', 'NEC', 'Nokia', 'Notion Ink',
  'OLPC', 'Origin PC', 'Packard Bell', 'Panasonic', 'Positivo', 'Primebook',
  'Razer', 'Realme', 'Redmi', 'Samsung', 'Schenker', 'Sharp', 'Sony',
  'System76', 'Terra', 'Thomson', 'Toshiba', 'Tuxedo', 'Vaio', 'Venom',
  'Walton', 'Wings', 'Wipro', 'Xiaomi', 'XMG', 'Zebronics',
] as const;
const aliases: Record<string, string[]> = {
  Apple: ['MacBook', 'MacBook Air', 'MacBook Pro'],
  Asus: ['ASUS', 'ROG', 'Republic of Gamers', 'TUF', 'Vivobook', 'Zenbook'],
  Dell: ['Latitude', 'Inspiron', 'XPS', 'Vostro', 'Precision'],
  HP: ['Hewlett Packard', 'Hewlett-Packard', 'EliteBook', 'ProBook', 'Pavilion', 'Victus', 'Omen'],
  Lenovo: ['ThinkPad', 'IdeaPad', 'Yoga', 'Legion', 'ThinkBook'],
  Microsoft: ['Surface'], Acer: ['Aspire', 'Swift', 'Predator', 'TravelMate'],
  Jio: ['Reliance', 'JioBook'], Xiaomi: ['Mi', 'Mi Notebook'],
};
export const brandKeywords = (brand: string) => aliases[brand] || [];
export function canonicalBrand(value: string) {
  const clean = value.trim().replace(/\s+/g, ' ');
  return laptopBrands.find(brand => brand.toLowerCase() === clean.toLowerCase())
    || Object.keys(aliases).find(brand => aliases[brand].some(alias => alias.toLowerCase() === clean.toLowerCase()))
    || clean;
}
