---
title: Portfolio Website
description: Portfólio que reúne meus projetos e os posts que contam o processo por trás deles.
status: completed
category: software
skills: [Astro, TypeScript, React, Motion, CSS, Markdown, Zod, CSP, GitHub Actions, Dependabot, Cloudflare Pages]
cover:
  src: /images/projects/portfolio/cover.svg
publishedAt: '2026-11-21'
updated: '2026-11-23'
links:
  website: https://www.johnsubtil.com/
  github: https://github.com/johnsubtil/portfolio
---

## Por que criei

Queria um lugar para reunir projetos de áreas diferentes e contar como estou fazendo cada um.

## Como organizei o site

- **Projetos**, cada um com status, as ferramentas usadas e links. Clicar numa ferramenta abre a lista de projetos que a usam.
- **Posts** sobre o processo.
- **Busca** que cobre projetos e posts.
- **Ranks**: cada área em que trabalho tem uma letra de E a S. Explico melhor em: [Como funcionam os ranks](/pt-br/posts/ranks/).

## Como foi feito

Site estático feito com **Astro** e **TypeScript**, com o conteúdo em Markdown.

- **Astro:** framework rápido e com foco em SEO. Gera as páginas como HTML estático no build e me deixa carregar JavaScript só onde preciso.
- **Markdown:** consigo escrever e editar o conteúdo em arquivos, sem manter um banco de dados. Os arquivos ficam em content collections, com schema **Zod** validado no build.
- **React só onde precisa:** as animações ficam em ilhas **React** com **Motion**. Usar React no site inteiro seria desnecessário.
- **Cloudflare Pages:** tem plano gratuito para site estático, então não precisei gastar com hospedagem ou VPS no início do projeto.
- **CSP rígida:** o site não tem backend nem envia dados a terceiros, mas quis manter um bom nível de segurança. A **CSP** só permite scripts e estilos do próprio domínio ou com hash, sem `unsafe-inline`.
- **Licença dividida:** o código é livre, sob licença MIT, mas o conteúdo, como artes e textos, tem os direitos reservados.

O **GitHub Actions** roda a checagem de tipos e o build a cada push e o `npm audit` toda semana, o **Dependabot** atualiza as dependências, e o deploy é automático no **Cloudflare Pages**.
