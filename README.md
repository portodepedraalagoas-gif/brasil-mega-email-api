# Brasil Mega Lite — Email API

API Express para enviar o código de recuperação de conta por e-mail usando Gmail SMTP.

## Deploy no Railway + GitHub

1. Envie esta pasta para um repositório GitHub. O arquivo `.env` real não deve ser enviado.
2. No Railway, crie um projeto e faça o deploy a partir do repositório GitHub.
3. Em **Variables** no Railway, configure:
   - `EMAIL_USER`: endereço Gmail remetente.
   - `EMAIL_PASS`: senha de app do Google (não é a senha normal da conta).
   - `API_TOKEN`: token secreto longo e aleatório, igual ao configurado no sistema que chama esta API.
4. O Railway executará `npm start`. A aplicação usa automaticamente `process.env.PORT`.
5. Após o deploy, teste a URL pública na rota `/` — deve retornar `status: online`.

## Endpoint

`POST /api/email/sendEmail`

Cabeçalho:

`Authorization: Bearer SEU_API_TOKEN`

Corpo JSON:

```json
{
  "to": "jogador@email.com",
  "subject": "Recuperação de conta — Brasil Mega Lite",
  "text": "482915"
}
```

`text` é o código que será inserido no modelo HTML do e-mail. A API aceita códigos de 4 a 12 caracteres alfanuméricos ou hífen.

## Importante: fluxo de recuperação

Esta API apenas entrega o código por e-mail. O backend/bot/servidor do jogo deve:

- gerar um código aleatório e associá-lo à conta solicitante;
- armazenar o código com prazo de validade (por exemplo, 10 minutos), preferencialmente como hash;
- limitar tentativas e pedidos de envio;
- validar o código e invalidá-lo após o uso;
- só então permitir a alteração segura da senha/credencial.

Não confie no código enviado pelo cliente. A validação deve acontecer no backend que controla as contas.

## Segurança

- Não faça commit do `.env`.
- Use uma senha de app do Google com verificação em duas etapas ativada.
- Mantenha `API_TOKEN` secreto e idêntico nos dois serviços.
- Não exponha esta API diretamente ao navegador; chame-a do backend do servidor.
