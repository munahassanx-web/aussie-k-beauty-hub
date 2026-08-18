import { auditComposites } from '@/lib/inventory-mapping';
const rows = auditComposites();
console.log(rows.filter(r=>r.status==='unmapped'));
console.log('total', rows.length, 'mapped', rows.filter(r=>r.status==='mapped').length);
