import { SHOP_PRODUCTS } from '../src/lib/shop-catalog';
import { productSlug, hasProductSpecificHowTo } from '../src/lib/product-detail';
for (const p of SHOP_PRODUCTS) if(!hasProductSpecificHowTo(p)) console.log(`${p.brand} | ${p.name} | ${p.category} | ${productSlug(p)}`);
