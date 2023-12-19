const axios = require('axios');
const ExcelJS = require('exceljs');

const token = '1e11dd8dc5944efabed5a93b2f1b1a12';
const cnpjs = [13958820000213, 29988546000184, 33033028002047];

// Função para obter os dados de um CNPJ específico e adicionar à planilha
async function getDataAndAddToWorksheet(cnpj, worksheet) {
  const apiUrl = `https://api.exato.digital/receita-federal-sintegra/cnpj-sintegra?token=${token}&cnpj=${cnpj}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.Result.Sintegra.RazaoSocial) {
      const razaoSocial = response.data.Result.Sintegra.RazaoSocial;
      worksheet.addRow([`RazaoSocial_${cnpj}`, razaoSocial]);
    } else {
      console.log(`A propriedade RazaoSocial não foi encontrada na resposta da API para o CNPJ ${cnpj}.`);
    }
  } catch (error) {
    console.error(`Erro na requisição à API para o CNPJ ${cnpj}:`, error.message);
  }
}

// Função principal assíncrona
async function main() {
  // Criação do arquivo Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Dados');

  // Loop para percorrer todos os CNPJs
  for (const cnpj of cnpjs) {
    await getDataAndAddToWorksheet(cnpj, worksheet);
  }

  // Salva o arquivo Excel
  const excelFileName = 'resultado.xlsx';
  workbook.xlsx.writeFile(excelFileName)
    .then(() => {
      console.log(`Arquivo ${excelFileName} gerado com sucesso.`);
    })
    .catch(err => {
      console.error('Erro ao salvar o arquivo Excel:', err.message);
    });
}

// Chama a função principal assíncrona imediatamente
main();
