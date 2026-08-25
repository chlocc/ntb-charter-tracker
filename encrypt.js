#!/usr/bin/env node
/*
 * encrypt.js — builds the password-gated index.html from the plaintext source.
 *
 * The full page content is encrypted with AES-256-GCM. The key is derived from
 * the password with PBKDF2 (SHA-256). Only ciphertext ships in index.html, so
 * the content cannot be read from page source without the password.
 *
 * Usage:
 *   NTB_PASSWORD='yourpassword' node encrypt.js
 *   node encrypt.js --password yourpassword
 *
 *   Optional: --in <plaintext> --out <encrypted> --label "<gate heading>"
 *   e.g. NTB_PASSWORD=... node encrypt.js \
 *          --in audit/provenance.html --out provenance.html --label "NTB Source Provenance Audit"
 *
 * Input:  index.source.html   (default; plaintext — keep gitignored / local only)
 * Output: index.html          (default; encrypted loader — safe to publish)
 *
 * The password is NEVER written into any committed file.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ITERATIONS = 250000;
function argVal(flag, dflt) {
  const i = process.argv.indexOf(flag);
  return (i !== -1 && process.argv[i + 1]) ? process.argv[i + 1] : dflt;
}
const SRC = path.resolve(__dirname, argVal('--in', 'index.source.html'));
const OUT = path.resolve(__dirname, argVal('--out', 'index.html'));
const LABEL = argVal('--label', 'NTB Charter Tracker');

function getPassword() {
  const argIdx = process.argv.indexOf('--password');
  if (argIdx !== -1 && process.argv[argIdx + 1]) return process.argv[argIdx + 1];
  if (process.env.NTB_PASSWORD) return process.env.NTB_PASSWORD;
  console.error('ERROR: no password. Set NTB_PASSWORD=... or pass --password ...');
  process.exit(1);
}

const password = getPassword();
const plaintext = fs.readFileSync(SRC, 'utf8');

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');

const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();
// WebCrypto AES-GCM expects ciphertext || tag
const payload = Buffer.concat([enc, tag]).toString('base64');

const meta = {
  salt: salt.toString('base64'),
  iv: iv.toString('base64'),
  iterations: ITERATIONS,
  ct: payload,
};

const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Protected — ${LABEL}</title>
<style>
  :root{ --bg:#0f1419; --panel:#161c24; --line:#2a3644; --ink:#e8edf2; --muted:#9aa7b4; --link:#5cb3e8; --err:#e0655f; }
  *{box-sizing:border-box;}
  html,body{height:100%;}
  body{margin:0;background:var(--bg);color:var(--ink);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:14px;
    padding:32px 28px;width:100%;max-width:380px;text-align:center;
    box-shadow:0 12px 40px rgba(0,0,0,.4);}
  .lock{font-size:34px;line-height:1;margin-bottom:12px;}
  h1{font-size:17px;margin:0 0 6px;font-weight:600;}
  p{font-size:13px;color:var(--muted);margin:0 0 20px;line-height:1.5;}
  form{display:flex;flex-direction:column;gap:12px;}
  input{background:#0b0f14;border:1px solid var(--line);border-radius:9px;
    padding:12px 14px;color:var(--ink);font-size:15px;outline:none;width:100%;}
  input:focus{border-color:var(--link);}
  button{background:var(--link);color:#06121c;border:0;border-radius:9px;
    padding:12px 14px;font-size:15px;font-weight:600;cursor:pointer;}
  button:disabled{opacity:.6;cursor:default;}
  .msg{font-size:13px;min-height:18px;color:var(--err);}
</style>
</head>
<body>
  <div class="card">
    <div class="lock">🔒</div>
    <h1>Protected page</h1>
    <p>This page is password protected. Enter the password to view the ${LABEL}.</p>
    <form id="f">
      <input id="pw" type="password" placeholder="Password" autocomplete="current-password" autofocus>
      <button id="go" type="submit">Unlock</button>
      <div class="msg" id="msg"></div>
    </form>
  </div>
<script>
(function(){
  var DATA = ${JSON.stringify(meta)};
  var enc = new TextEncoder(), dec = new TextDecoder();
  function b64(s){ var bin = atob(s), a = new Uint8Array(bin.length); for(var i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i); return a; }

  async function derive(pw, salt, iters){
    var base = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name:'PBKDF2', salt: salt, iterations: iters, hash:'SHA-256' },
      base, { name:'AES-GCM', length:256 }, false, ['decrypt']);
  }

  async function unlock(pw){
    var key = await derive(pw, b64(DATA.salt), DATA.iterations);
    var plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv: b64(DATA.iv) }, key, b64(DATA.ct));
    return dec.decode(plain);
  }

  function render(html){
    try { sessionStorage.setItem('ntb_ok', '1'); } catch(e){}
    document.open(); document.write(html); document.close();
  }

  var form = document.getElementById('f'), pw = document.getElementById('pw'),
      go = document.getElementById('go'), msg = document.getElementById('msg');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    msg.textContent = ''; go.disabled = true; go.textContent = 'Unlocking…';
    try {
      var html = await unlock(pw.value);
      render(html);
    } catch(err){
      msg.textContent = 'Incorrect password.';
      go.disabled = false; go.textContent = 'Unlock';
      pw.select();
    }
  });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, out);
console.log('Wrote', OUT, '(' + out.length + ' bytes, ciphertext ' + payload.length + ' b64 chars)');
