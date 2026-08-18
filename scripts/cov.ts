import { SHOP_PRODUCTS } from '../src/lib/shop-catalog';
import { productSlug, hasProductSpecificHowTo } from '../src/lib/product-detail';
const rows = SHOP_PRODUCTS.map(p=>({slug:productSlug(p),cat:p.category,spec:hasProductSpecificHowTo(p),brand:p.brand,name:p.name}));
console.log('total',rows.length,'specific',rows.filter(r=>r.spec).length);
for(const r of rows) console.log(r.spec?'SPEC':'FALL', r.cat.padEnd(11), r.slug);
