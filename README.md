# Quem Somos — Tenório Legend

Tela "Quem Somos" (construtora + pessoas que participaram da obra) para injeção via script no 3DVista, hospedada no AWS S3.

**Tema:** escuro (`#434040` / `#F2EBDD`)

---

## URLs de produção

| Arquivo | URL |
|---------|-----|
| Página  | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/quem-somos/index.html` |
| Script  | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/quem-somos/inject.js` |

**S3 path:** `s3://skylineip/Tour Virtual/tenorio/quem-somos/`
**GitHub:** `https://github.com/LuizUltratour/tenorio-legend-quem-somos.git`

---

## Estrutura de arquivos

```
tenorio-legend-info/
├── index.html      ← tela Quem Somos (auto-suficiente; conteúdo no objeto CONTEUDO)
├── inject.js       ← loader leve para injeção no 3DVista (AbrirQuemSomos)
├── deploy.ps1      ← deploy para o S3 (Windows; sync)
└── assets/
    ├── bg.png              ← fundo
    ├── close.png           ← botão fechar
    └── <Nome Pessoa>.jpeg  ← fotos das pessoas
```

> O S3 é case-sensitive: os caminhos em `index.html` devem ter exatamente o mesmo case dos arquivos (ex.: `assets/Brenda Jeanne.jpeg`). Espaços são aceitos.

---

## Editando o conteúdo

Todo o texto fica no objeto `CONTEUDO`, no topo do `<script>` do `index.html`:

```js
const CONTEUDO = {
  construtora: { titulo: 'Quem Somos', textos: ['parágrafo 1', 'parágrafo 2'] },
  tituloPessoas: 'Quem fez parte',
  pessoas: [
    { nome: 'Nome', cargo: 'Cargo', foto: 'assets/Nome.jpeg', texto: 'Bio' },
  ],
};
```

- A mesma página tem duas partes, escolhidas por `?secao=`: `quem-somos` (construtora, centralizada) e `arquitetos` (uma linha por pessoa — texto à esquerda, foto à direita, centralizados na vertical).
- Para adicionar uma pessoa: coloque a foto em `assets/` e inclua um item em `pessoas`.

---

## Deploy AWS S3

> **Windows:** use o script pronto `./deploy.ps1` (sync completo + `cache-control` no HTML/JS).
> Requer **AWS CLI** instalado e credenciais configuradas (`aws configure`) uma única vez.

### Sync completo

```bash
aws s3 sync . "s3://skylineip/Tour Virtual/tenorio/quem-somos/" \
  --exclude ".git/*" --exclude ".claude/*" --exclude "*.py" \
  --exclude "README.md" --exclude ".gitattributes" --exclude "*.md" \
  --exclude "deploy.ps1" --exclude "*.pdf" \
  --delete
```

### Atualizar só index.html e inject.js

```bash
aws s3 cp index.html "s3://skylineip/Tour Virtual/tenorio/quem-somos/index.html" \
  --cache-control "no-cache,no-store,must-revalidate"

aws s3 cp inject.js "s3://skylineip/Tour Virtual/tenorio/quem-somos/inject.js" \
  --cache-control "no-cache,no-store,must-revalidate"
```

> **`--cache-control "no-cache,no-store,must-revalidate"`** — essencial para garantir que o browser nunca sirva uma versão cacheada do script ou da página.

---

## Integração 3DVista

### Passo 1 — Loader (colocar no JavaScript global do projeto)

```js
(function(){
  var s = document.createElement('script');
  s.src = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/quem-somos/inject.js?v=' + Date.now();
  document.head.appendChild(s);
})();
```

> **`?v=` + `Date.now()`** — cache-busting: força o browser a baixar sempre a versão mais recente do script, evitando que o 3DVista sirva uma versão antiga em cache.

### Passo 2 — Acionar nos hotspots/botões

```js
// Botão "Quem Somos" — abre / fecha a parte da construtora
AbrirQuemSomos(1);
AbrirQuemSomos(0);

// Botão "Arquitetos" — abre / fecha a parte dos arquitetos
AbrirArquitetos(1);
AbrirArquitetos(0);
```

O botão de fechar da própria página envia `postMessage({ action: 'closeGallery' })` ao 3DVista, que o `inject.js` trata fechando o overlay.

---

## Cores e tipografia

| Token CSS | Valor | Papel |
|-----------|-------|-------|
| `--bg` | `#434040` | Cinza-escuro principal (fundo) |
| `--dark` | `#F2EBDD` | Texto/ícones (creme) |
| Fonte títulos | Cormorant Garamond | — |
| Fonte texto | Inter | — |
