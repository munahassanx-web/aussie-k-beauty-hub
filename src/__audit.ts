import { auditComposites } from '@/lib/inventory-mapping';
console.log(JSON.stringify(auditComposites().filter(r=>r.type!=='membership'), null, 1));
