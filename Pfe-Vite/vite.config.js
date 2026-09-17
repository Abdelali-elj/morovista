import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';
import vm from 'vm';
import fs from 'fs';
import path from 'path';

let cachedCookie = null;
let cookieTimestamp = 0;

function solveInfinityFreeCookie(callback) {
  const now = Date.now();
  if (cachedCookie && (now - cookieTimestamp < 1000 * 60 * 60 * 3)) {
    return callback(cachedCookie);
  }

  const aesPath = path.resolve(__dirname, 'aes.js');
  const aesCode = fs.existsSync(aesPath) ? fs.readFileSync(aesPath, 'utf8') : '';

  https.get('https://morovista.xo.je/api/hotels', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  }, (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
      const match = html.match(/var a=toNumbers\("([a-f0-9]+)"\),b=toNumbers\("([a-f0-9]+)"\),c=toNumbers\("([a-f0-9]+)"\);/);
      if (!match) {
        return callback(cachedCookie || '');
      }
      const [_, aHex, bHex, cHex] = match;
      try {
        const sandbox = { slowAES: {} };
        vm.createContext(sandbox);
        vm.runInContext(aesCode, sandbox);

        const solveScript = `
          function toNumbers(d){var e=[];d.replace(/(..)/g,function(d){e.push(parseInt(d,16))});return e}
          function toHex(d){for(var e="",f=0;f<d.length;f++)e+=(16>d[f]?"0":"")+d[f].toString(16);return e.toLowerCase()}
          var a=toNumbers("${aHex}"),b=toNumbers("${bHex}"),c=toNumbers("${cHex}");
          toHex(slowAES.decrypt(c,2,a,b));
        `;
        const cookieVal = vm.runInContext(solveScript, sandbox);
        cachedCookie = cookieVal;
        cookieTimestamp = Date.now();
        console.log('[InfinityFree Proxy] Successfully solved __test cookie:', cookieVal);
        callback(cookieVal);
      } catch (e) {
        console.error('[InfinityFree Proxy] Error solving cookie:', e);
        callback('');
      }
    });
  }).on('error', (err) => {
    console.error('[InfinityFree Proxy] Error requesting challenge:', err);
    callback('');
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'infinityfree-cookie-solver',
      configureServer(server) {
        // Pre-solve cookie on server start
        solveInfinityFreeCookie(() => {});
      }
    }
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://morovista.xo.je',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (cachedCookie) {
              proxyReq.setHeader('Cookie', `__test=${cachedCookie}`);
            }
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json');
          });
        }
      }
    }
  }
});
