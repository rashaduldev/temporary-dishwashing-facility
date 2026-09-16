import {it,expect} from 'vitest';
import {extract} from '../scripts/import-wordpress.mjs';
it('preserves source copy and links while removing active content',()=>{
 const p=extract({id:1,link:'https://temporary123.com/example/',title:{rendered:'Original title'},content:{rendered:'<h1>Original heading</h1><p>Original service copy. <a href="https://temporary123.com/other/">Related equipment</a></p><script>alert(1)</script><iframe src="https://example.invalid"></iframe><form><input name="secret"></form><img src="https://temporary123.com/photo.jpg" onerror="alert(1)" alt="Equipment"><a href="javascript:alert(1)">Bad link</a>'},excerpt:{rendered:'Original description'}});
 expect(p.path).toBe('/example/');expect(p.title).toBe('Original heading');expect(p.html).toContain('Original service copy.');expect(p.html).toContain('href="/other/"');expect(p.html).toContain('alt="Equipment"');expect(p.html).not.toMatch(/script|iframe|form|onerror|javascript:/);expect(p.images).toHaveLength(1);
});
