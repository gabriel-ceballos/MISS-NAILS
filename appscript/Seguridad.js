function generarHashSHA256(texto) {

  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    texto
  );

  return hash.map(function(byte) {

    const valor = (byte < 0)
      ? byte + 256
      : byte;

    return ('0' + valor.toString(16)).slice(-2);

  }).join('');

}





