const express = require('express');
const crypto = require('crypto');
const router = express.Router();

if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.API_TOKEN) {
  console.error('Missing required environment variables: RESEND_API_KEY, EMAIL_FROM, API_TOKEN');
}

// Railway Free/Hobby blocks outbound SMTP. Resend uses HTTPS (port 443).
// Node.js >=18 supports fetch natively.
async function sendViaResend(message) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(`Resend HTTP ${response.status}: ${result.message || result.name || 'request failed'}`);
      err.status = response.status;
      throw err;
    }
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

const html = `<!doctype html>
<html lang="pt-BR" dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Recuperação de conta — Brasil Mega Lite</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <style>table,td,p,a,h1,h2 {font-family:Arial,Helvetica,sans-serif!important;}</style>
  <![endif]-->
  <style>
    html,body {margin:0!important;padding:0!important;width:100%!important;}
    table,td {mso-table-lspace:0pt;mso-table-rspace:0pt;}
    table {border-collapse:collapse;}
    a {text-decoration:none;}
    p,h1,h2 {margin:0;}
    body,table,td,a {-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    .email-shell {width:100%;max-width:600px;}
    @media screen and (max-width:480px) {
      .outer-pad {padding:20px 12px!important;}
      .header-pad {padding:28px 22px!important;}
      .content-pad {padding:28px 22px 30px!important;}
      .headline {font-size:27px!important;line-height:35px!important;}
      .code {font-size:28px!important;line-height:38px!important;letter-spacing:2px!important;}
      .support-button {font-size:14px!important;padding:15px 16px!important;}
    }
  </style>
</head>
<body bgcolor="#f3f2f7" style="margin:0;padding:0;background-color:#f3f2f7;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#20202a;">
  <!-- Texto de prévia na caixa de entrada. Não contém o código. -->
  <div style="display:none;font-size:1px;line-height:1px;color:#f3f2f7;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    Seu código de recuperação do Brasil Mega Lite chegou. Não compartilhe com ninguém.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f2f7" style="width:100%;background-color:#f3f2f7;">
    <tr>
      <td class="outer-pad" align="center" style="padding:36px 16px;">
        <!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table class="email-shell" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;">
          <tr>
            <td height="4" bgcolor="#b15cff" style="height:4px;font-size:0;line-height:0;background-color:#b15cff;border-radius:18px 18px 0 0;">&nbsp;</td>
          </tr>
          <tr>
            <td class="header-pad" align="center" bgcolor="#121016" style="padding:32px 30px 34px;background-color:#121016;">
              <!-- Identidade em texto: aparece mesmo com imagens bloqueadas. -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;">
                <tr>
                  <td align="center" width="66" height="60" bgcolor="#342044" style="width:66px;height:60px;background-color:#342044;border:1px solid #56316e;border-radius:15px;color:#d6acff;font-size:22px;line-height:60px;font-weight:800;letter-spacing:-1px;">
                    BML
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;color:#cfa0ff;font-size:11px;line-height:17px;font-weight:700;letter-spacing:2px;">
                BRASIL MEGA LITE
              </p>
              <h1 class="headline" style="margin:10px 0 0;color:#ffffff;font-size:30px;line-height:39px;font-weight:700;letter-spacing:-0.6px;">
                Recuperação de conta
              </h1>
              <p style="margin:8px 0 0;color:#b7afc2;font-size:14px;line-height:22px;">
                Vamos ajudar você a voltar para a cidade.
              </p>
            </td>
          </tr>
          <tr>
            <td class="content-pad" bgcolor="#ffffff" style="padding:32px 34px 34px;background-color:#ffffff;border-left:1px solid #e6e2ec;border-right:1px solid #e6e2ec;border-bottom:1px solid #e6e2ec;border-radius:0 0 18px 18px;">
              <h2 style="margin:0;color:#20202a;font-size:20px;line-height:28px;font-weight:700;">
                Seu código chegou.
              </h2>
              <p style="margin:12px 0 0;color:#62606e;font-size:14px;line-height:23px;">
                Recebemos um pedido para recuperar sua conta no <strong style="color:#34303f;">Brasil Mega Lite</strong>. Copie o código abaixo e informe na tela de recuperação.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:24px;border-collapse:separate;border-spacing:0;">
                <tr>
                  <td align="center" bgcolor="#f7f0ff" style="padding:23px 14px 24px;background-color:#f7f0ff;border:1px solid #dcc3f4;border-radius:12px;">
                    <p style="margin:0;color:#7b4b9c;font-size:11px;line-height:17px;font-weight:700;letter-spacing:1.2px;">
                      CÓDIGO DE RECUPERAÇÃO
                    </p>
                    <!-- Preserve este marcador: ele é substituído pelo sistema de envio. -->
                    <p class="code" dir="ltr" style="margin:12px 0 0;color:#8a35d6;font-family:'Courier New',Courier,monospace;font-size:36px;line-height:44px;font-weight:700;letter-spacing:3px;white-space:nowrap;">
                      &&@c0de@&&
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;color:#74707e;font-size:12px;line-height:20px;text-align:center;">
                Por segurança, <strong style="color:#504559;">não compartilhe este código</strong> com ninguém.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:25px;">
                <tr>
                  <td height="1" bgcolor="#eeebf2" style="height:1px;font-size:0;line-height:0;background-color:#eeebf2;">&nbsp;</td>
                </tr>
              </table>
              <p style="margin:22px 0 0;color:#62606e;font-size:13px;line-height:21px;">
                <strong style="color:#34303f;">Não foi você?</strong> Se não solicitou a recuperação, ignore este e-mail.
              </p>
              <p style="margin:21px 0 12px;color:#62606e;font-size:13px;line-height:21px;text-align:center;">
                Se precisar de ajuda, estamos no Discord.
              </p>

              <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;">
                <tr>
                  <td align="center" bgcolor="#a44eea" style="background-color:#a44eea;border-radius:9px;mso-padding-alt:16px 27px;">
                    <a class="support-button" href="https://discord.gg/S8BPRNrkQ" target="_blank" style="display:inline-block;padding:16px 27px;border:1px solid #a44eea;border-radius:9px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;font-weight:700;text-align:center;text-decoration:none;mso-padding-alt:0;">
                      Falar com o suporte no Discord
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:23px 18px 8px;">
              <p style="margin:0;color:#716a7d;font-size:12px;line-height:19px;font-weight:700;">Brasil Mega Lite</p>
              <p style="margin:5px 0 0;color:#928a9e;font-size:11px;line-height:18px;">Este e-mail foi enviado automaticamente. Não é necessário responder.</p>
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`

function safeTokenEquals(received, expected) {
  if (typeof received !== 'string' || typeof expected !== 'string') return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
  })[char]);
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ message: 'Authorization Bearer token ausente' });
  }
  if (!safeTokenEquals(match[1], process.env.API_TOKEN)) {
    return res.status(403).json({ message: 'Token inválido' });
  }
  next();
}

router.post('/sendEmail', verifyToken, async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body[0] : req.body;
  const { to, subject, text } = payload || {};

  const email = typeof to === 'string' ? to.trim() : '';
  const code = typeof text === 'string' ? text.trim() : '';
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const codeIsValid = /^[A-Za-z0-9-]{4,12}$/.test(code);

  if (!emailIsValid || !codeIsValid) {
    return res.status(400).json({ message: 'Informe um e-mail válido e um código de 4 a 12 caracteres.' });
  }

  const safeSubject = typeof subject === 'string' && subject.trim()
    ? subject.trim().slice(0, 120)
    : 'Recuperação de conta — Brasil Mega Lite';
  const html_ = html.replace('&&@c0de@&&', escapeHtml(code));

  try {
    await sendViaResend({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: safeSubject,
      html: html_,
      text: `Seu código de recuperação do Brasil Mega Lite é: ${code}. Não compartilhe este código.`,
    });
    return res.status(200).json({ message: 'E-mail de recuperação enviado.' });
  } catch (error) {
    console.error('Email delivery failed:', error.message);
    return res.status(502).json({ message: 'Não foi possível enviar o e-mail.' });
  }
});

module.exports = router;
