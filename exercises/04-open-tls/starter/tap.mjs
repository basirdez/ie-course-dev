// شنود روی مسیر، بدون دسترسی مدیر سیستم:  node tap.mjs
// روی 8444 گوش می‌دهد، همه‌چیز را دست‌نخورده به 8443 می‌فرستد، و بایت‌های خام هر دو جهت را در فایل می‌نویسد.
// این برنامه همان چیزی را می‌بیند که هر دستگاه میان راه می‌بیند: بایت‌های رمزشده، نه بیشتر.
import net from 'node:net'
import { createWriteStream } from 'node:fs'
let n = 0
net.createServer((client) => {
  const id = ++n
  const c2s = createWriteStream(`conn${id}-client-to-server.bin`), s2c = createWriteStream(`conn${id}-server-to-client.bin`)
  const server = net.connect(8443, '127.0.0.1')
  client.on('data', (d) => { c2s.write(d); server.write(d) })
  server.on('data', (d) => { s2c.write(d); client.write(d) })
  const end = () => { client.destroy(); server.destroy(); c2s.end(); s2c.end(); console.log(`اتصال ${id} بسته شد`) }
  client.on('close', end); server.on('close', end); client.on('error', end); server.on('error', end)
}).listen(8444, () => console.log('tap: 127.0.0.1:8444 → 127.0.0.1:8443'))
