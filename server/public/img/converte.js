#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

/**
 * Lê um arquivo e retorna seu conteúdo em Base64.
 * @param {string} filePath - Caminho para o arquivo.
 * @returns {Promise<string>} String em Base64.
 */
async function fileToBase64(filePath) {
  const absPath = path.resolve(filePath);
  const data = await fs.readFile(absPath);
  return data.toString('base64');
}

async function main() {
  const [ , , filePath ] = process.argv;
  if (!filePath) {
    console.error('Uso: node convert.js <caminho-do-arquivo>');
    process.exit(1);
  }

  try {
    const base64 = await fileToBase64(filePath);
    console.log(base64);
  } catch (err) {
    console.error('Erro ao converter arquivo:', err.message);
    process.exit(1);
  }
}

main();