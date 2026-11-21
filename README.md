# Brasil Mega Lite — Email API (HTTPS/Resend)

Servidor Express em Node.js >=18 para envio de códigos de recuperação.
Mantém a rota `POST /api/email/sendEmail` e o visual HTML original.

## Configuração no Railway

Configure as variáveis em **Variables** (não envie arquivos `.env` ao GitHub):

- `RESEND_API_KEY`: chave criada em https://resend.com/api-keys
- `EMAIL_FROM`: `Brasil Mega Lite <onboarding@resend.dev>` para **teste somente**; use um endereço de **domínio verificado** para usuários reais.
- `API_TOKEN`: token secreto usado pelos sistemas que chamam esta API.

`EMAIL_USER` e `EMAIL_PASS` não são usados nesta versão. Remova-os do Railway quando confirmar que tudo funciona.

**Limite de teste Resend:** usando `onboarding@resend.dev`, só envie para o e-mail de cadastro da conta Resend. Para enviar aos jogadores, adicione e verifique seu domínio em https://resend.com/domains e atualize `EMAIL_FROM`.

## API

- `GET /` retorna status de saúde.
- `POST /api/email/sendEmail` requer `Authorization: Bearer <API_TOKEN>` e JSON:

```json
{"to":"seu-email@exemplo.com","subject":"Teste Brasil Mega Lite","text":"482915"}
```

O campo `text` é o **código** (4 a 12 caracteres alfanuméricos ou hífen), não uma mensagem livre. A API formata o HTML automaticamente e substitui o marcador de código no layout.

Em caso de falha, veja **Deploy Logs** no Railway. Eles exibem o status HTTP e a mensagem da Resend sem expor a chave.

## Segurança

Não publique senhas, chaves, `API_TOKEN` ou `.env`. Proteja o endpoint contra abuso com rate limiting e controle de tentativas antes de colocá-lo em produção. A Resend aceitar a mensagem não garante entrega na caixa de entrada.
