# John Subtil

[English](README.md) | Português

Portfólio e hub de histórias bilíngue do John Subtil. Site estático feito com Astro, TypeScript, CSS e conteúdo em Markdown, com pequenas ilhas em React. Português em `/pt-br/` e inglês em `/en-us/` (por exemplo `/pt-br/projetos/` e `/en-us/projects/`); o endereço sem prefixo `/` só leva a pessoa a um dos dois.

## Desenvolvimento

Requer Node.js 22.23.4+ e npm.

```sh
npm ci
npm run dev        # http://localhost:4321
```

```sh
npm run check      # Checagem de tipos (astro check)
npm run build      # Gera dist/
npm run preview    # Visualiza o build de produção
```

`npm run dev -- --background` inicia o servidor em segundo plano; gerencie-o com `npm run astro -- dev status`, `npm run astro -- dev logs` e `npm run astro -- dev stop`.

## Conteúdo

Projetos ficam em `src/content/projects/{pt-br,en-us}/`; posts em `src/content/posts/{pt-br,en-us}/`. Use nomes de arquivo iguais nas traduções, com letras minúsculas, números e hífens, sem subpastas.

Um projeto (`meu-projeto.md`):

```md
---
title: Meu projeto
description: Uma descrição curta.
status: in-progress
category: stories
publishedAt: '2026-11-06'
updated: '2026-11-06'
---

Texto do projeto em Markdown.
```

Status: `in-progress`, `completed`. Categorias: `software` (padrão), `stories`. Projetos são publicados assim que seus arquivos existem. Adicione `featured: true` para exibir um projeto no hero da home (até três, mais recentes primeiro). Sem projetos em destaque, a home mostra um hero de texto. Adicione `skills: [Astro, TypeScript]` para listar as tecnologias que um projeto usa: elas aparecem como etiquetas `#` no fim da página do projeto, onde cada uma abre a lista de projetos filtrada por ela, e entram na busca do site.

Um post (`meu-post.md`):

```md
---
title: Meu post
description: Uma descrição curta.
format: Nota
publishedAt: '2026-11-06'
updated: '2026-11-06'
draft: true
---

Texto do post em Markdown.
```

Defina `draft: false` para publicar um post; omitir `draft` também publica. Um post pode existir sozinho. O campo opcional `project: pt-br/meu-projeto` o vincula a um projeto existente no mesmo idioma; traduções devem apontar para traduções do mesmo projeto, ou as duas ficarem sem associação. Posts não têm habilidades: elas ficam nos projetos.

As listas ordenam por `updated`, do mais recente ao mais antigo. As datas usam `AAAA-MM-DD`; `updated` também aceita um carimbo ISO com fuso horário. Todos os campos e regras de validação estão em [src/content.config.ts](src/content.config.ts).

As listas, as seções da home e a busca tratam o caso vazio, então o site funciona sem projetos nem posts.

## Imagens

Guarde imagens de conteúdo em `public/images/projects/<slug>/` ou `public/images/posts/<slug>/` e use caminhos iniciados por `/images/`. Caminhos de mídia devem ser locais, começar com `/` e não conter espaços nem barras invertidas. Arquivos em `public/` são servidos sem processamento; exporte-os em tamanhos adequados. Recursos importados pela interface, como ícones e arte do hero, ficam em `src/assets/`.

Projetos e posts sem capa mostram um ícone de imagem. Capa opcional de projeto ou post:

```yaml
cover:
  src: /images/projects/meu-projeto/capa.webp
  alt: Descrição da imagem.
```

As capas aparecem no hero, nos blocos de projeto (quase quadrados na home, 16:10 na página de projetos, cortados pelo centro), nos cards e na busca. Capas em SVG também funcionam e são servidas sem alteração. No Markdown: `![Descrição](/images/projects/meu-projeto/detalhe.webp)`.

Projetos também aceitam `subtitle`, `links` (`website`, `github`, `behance`, `instagram`, `tiktok`, `youtube`) e uma imagem ou GIF animado antes do corpo em Markdown:

```yaml
presentationImage:
  src: /images/projects/meu-projeto/demo.gif
  alt: Descrição da demonstração.
  caption: Uma legenda opcional.
```

GIFs são servidos sem processamento. Mantenha animações curtas e exporte-as em tamanhos adequados.

## Configuração

- `src/config/site.ts`: identidade do site, e-mail, redes sociais e o caminho da foto da página Sobre.
- `src/config/ranks.ts`: o rank de cada área, de E a S (mostrado na seção "O que eu faço" da home), e o post que explica os ranks (`rankGuidePost`, ligado pelo "?" da seção "O que eu faço" da home). Os títulos das letras ficam em `src/i18n/messages` (`ranks`).
- `src/config/content.ts`: status e categorias (cada categoria precisa de um nome em `projects.categories`, de um texto em `home.disciplines` e, se quiser, de um rank em `ranks.ts`), se os cards de projeto mostram a categoria, e os limites do hero da home (e quantos segundos cada projeto em destaque fica antes do próximo entrar), da lista de projetos da home e dos posts recentes da home (os espaços livres aparecem como blocos cinza; `showPlaceholderSlots` desliga isso) e do índice dos artigos.
- `src/i18n/messages/`: textos da interface; mantenha as chaves iguais nos idiomas.
- `src/styles/tokens.css`: cores, raios, espaçamentos e tipografia. Use estes tokens em vez de valores fixos.
- `public/`: favicon, imagem de pré-visualização social (`og-image.png`), `robots.txt`, `_headers` e `scripts/language.js` (escolhe o idioma do endereço sem prefixo e da página 404). O sitemap é gerado em `/sitemap.xml`.

## Estrutura do projeto

- `src/pages/`, `src/layouts/`: rotas e estrutura das páginas. As páginas ficam em `[locale]/` (`pt-br`, `en-us`) com uma seção traduzida (`[section]/`: `projetos`/`projects`, `posts`, `sobre`/`about`, `busca`/`search`); os nomes das seções estão em `src/i18n/locales.ts` (`routeSegments`), e os links são montados com `localizedUrl(locale, '/projects/')`. `src/views/` guarda o corpo das páginas. O `404.astro` guarda os dois idiomas e mostra o que combina com quem chegou.
- `src/components/`: agrupados por área (`home`, `projects`, `posts`, `catalog`, `search`, `layout`, `i18n`, `media`, `ui`, `motion`). `ui/Cta.astro` é o botão compartilhado e `ui/Icon.astro` o ícone compartilhado.
- `src/lib/`: consultas de conteúdo e motor de busca.
- `src/scripts/`: comportamento no navegador, em `catalog/` (filtros, paginação), `search/` (cabeçalho e página) e `article/` (índice e tabelas).

## Publicação

O site é feito para o Cloudflare Pages: comando de build `npm run build`, diretório de saída `dist`, Node.js 22. O `public/_headers` define os cabeçalhos de segurança e de cache no Cloudflare Pages; em outro provedor, defina os mesmos cabeçalhos lá. Atualize `site` em `astro.config.mjs` se o domínio mudar.

O GitHub Actions roda checagem de tipos e build a cada push e pull request (`.github/workflows/ci.yml`), e o `npm audit` uma vez por semana (`.github/workflows/audit.yml`).

## Segurança

O site não faz requisições a terceiros, e as fontes são próprias. O Astro adiciona a cada página uma Content Security Policy que proíbe estilos e scripts inline, então valores dinâmicos passam por variáveis CSS definidas via script (veja `src/components/motion/ScrollProgress.tsx`). Para reportar uma vulnerabilidade, veja [SECURITY.md](SECURITY.md).

## Licença

Software: [MIT](LICENSE). Conteúdo e marca: [direitos reservados](CONTENT_RIGHTS.md). Ícones de terceiros mantêm suas [licenças](src/assets/icons/LICENSE.txt).
