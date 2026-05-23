# Gravidade Zero Milkshakes

Cardápio digital com tema cósmico, carrinho e pedido via WhatsApp.

## Rodar o projeto

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Onde editar

| O quê | Arquivo |
|-------|---------|
| **URLs de imagens** (logo, banner, produtos) | `data/images.ts` |
| Sabores (nome, descrição, categoria, disponível) | `data/products.ts` |
| Preço por tamanho (padrão 330ml / 550ml) | `data/settings.ts` → `sizes` |
| Preço só de um sabor | `data/products.ts` → `customPrices: { "330": 14.9 }` |
| Adicionais e caldas | `data/extras.ts` |
| Taxa de entrega, WhatsApp, endereço | `data/settings.ts` |
| Textos da interface | `data/settings.ts` → `texts` |
| Cores do tema | `data/settings.ts` → `theme` |
| Categorias do menu | `data/images.ts` → `MENU_CATEGORIES` |

## Publicar na Vercel

1. Suba o repositório no GitHub (ou conecte pasta local na Vercel).
2. Framework: **Next.js** (detectado automaticamente).
3. Variáveis de ambiente (Settings → Environment Variables):
   - `ADMIN_PASSWORD` — senha do painel `/admin` (obrigatória em produção).
4. Deploy: a Vercel roda `npm run build` automaticamente.

**Imagens:** as fotos vêm dos links Instasize em `data/images.ts`. Não é obrigatório hospedar em CDN próprio; se um link quebrar, use placeholder ou troque a URL. Para máxima estabilidade no longo prazo, considere Cloudinary, Vercel Blob ou pasta `public/`.

## Comandos

```bash
npm run dev    # testar local (http://localhost:3000)
npm run build  # build de produção
npm start      # rodar build localmente
```

O painel **Área do lojista** (`/admin`) salva alterações em `data/store.json`. Se esse arquivo existir, ele tem prioridade sobre os `.ts`. Para voltar ao padrão dos arquivos TypeScript, apague `data/store.json`.

## Admin

1. Acesse `/admin/login`
2. Senha padrão: variável `ADMIN_PASSWORD` em `.env.local` (veja `.env.example`)
