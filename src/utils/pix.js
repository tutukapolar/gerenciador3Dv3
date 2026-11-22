function crc16ccitt(str) {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatarCampo(id, valor) {
  const len = valor.length.toString().padStart(2, '0');
  return `${id}${len}${valor}`;
}

function removerAcentos(texto) {
  return texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
}

export function gerarPayloadPix({ chave, nome, cidade, valor, txid = "***" }) {
  const nomeLimpo = removerAcentos(nome).substring(0, 25);
  const cidadeLimpa = removerAcentos(cidade).substring(0, 15);
  const valorFormatado = parseFloat(valor).toFixed(2);

  const merchantAccountInfo = 
    formatarCampo("00", "br.gov.bcb.pix") + 
    formatarCampo("01", chave);

  let payload = 
    formatarCampo("00", "01") +
    formatarCampo("26", merchantAccountInfo) +
    formatarCampo("52", "0000") +
    formatarCampo("53", "986") +
    formatarCampo("54", valorFormatado) +
    formatarCampo("58", "BR") +
    formatarCampo("59", nomeLimpo) +
    formatarCampo("60", cidadeLimpa) +
    formatarCampo("62", formatarCampo("05", txid));

  payload += "6304";
  const checksum = crc16ccitt(payload);
  return payload + checksum;
}
