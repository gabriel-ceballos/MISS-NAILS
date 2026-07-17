function activarCuenta(correo, password) {

  const cliente =
    buscarClientePorCorreo(correo);

  if (!cliente.encontrado) {

    return {
      ok: false,
      mensaje: 'Correo no autorizado.'
    };

  }

  if (cliente.passwordHash) {

    return {
      ok: false,
      mensaje: 'La cuenta ya fue activada.'
    };

  }

  const hash =
    generarHashSHA256(password);

  guardarPasswordHash(
    correo,
    hash
  );

  return {
    ok: true,
    mensaje: 'Cuenta activada correctamente.'
  };

}




function verificarEstadoCuenta(correo) {

  const cliente =
    obtenerClientePorCorreo(correo);

  if (!cliente.encontrado) {

    return {
      ok: false,
      mensaje: 'Correo no autorizado.'
    };

  }

  if (!cliente.passwordHash) {

    return {
      ok: true,
      accion: 'ACTIVAR'
    };

  }

  return {
    ok: true,
    accion: 'LOGIN'
  };

}




function validarLogin(correo, password) {

  const cliente =
    obtenerClientePorCorreo(correo);

  if (!cliente.encontrado) {

    return {
      ok: false,
      mensaje: 'Correo no autorizado.'
    };

  }

  const activo =
    String(cliente.activo || '')
      .trim()
      .toUpperCase();

  if (activo !== 'SI') {

    return {
      ok: false,
      mensaje: 'Cuenta inactiva.'
    };

  }

  if (!cliente.passwordHash) {

    return {
      ok: false,
      mensaje:
        'Debe activar primero su cuenta.'
    };

  }

  const hashIngresado =
    generarHashSHA256(password);

  if (
    hashIngresado !==
    cliente.passwordHash
  ) {

    incrementarIntentosFallidos(
      correo
    );

    return {
      ok: false,
      mensaje:
        'Contraseña incorrecta.'
    };

  }

  registrarUltimoAcceso(
    correo
  );

  reiniciarIntentosFallidos(
    correo
  );

  return {

    ok: true,

    nombre: cliente.nombre,

    rol: cliente.rol

  };

}





