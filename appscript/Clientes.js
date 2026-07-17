const ID_SPREADSHEET = '1D4KuhCCjHq0gbAQkRQFUhCFs8hRsN-vWbXVFIt7Nm9g';

const HOJA_CLIENTES = 'CLIENTES';

function obtenerHojaClientes() {

  return SpreadsheetApp
    .openById(ID_SPREADSHEET)
    .getSheetByName(HOJA_CLIENTES);

}

function buscarClientePorCorreo(correo) {

  const hoja = obtenerHojaClientes();

  const datos = hoja.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {

    const correoHoja = String(datos[i][3] || '')
      .trim()
      .toLowerCase();

    if (correoHoja === correo.trim().toLowerCase()) {

      return {
        encontrado: true,
        idCliente: datos[i][0],
        nombre: datos[i][1],
        correo: datos[i][3],
        rol: datos[i][5],
        activo: datos[i][6],
        passwordHash: datos[i][7]
      };

    }

  }

  return {
    encontrado: false
  };

}





function guardarPasswordHash(correo, passwordHash) {

  const hoja = obtenerHojaClientes();

  const datos = hoja.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {

    const correoHoja = String(datos[i][3] || '')
      .trim()
      .toLowerCase();

    if (correoHoja === correo.trim().toLowerCase()) {

      hoja.getRange(i + 1, 8).setValue(passwordHash);

      return true;

    }

  }

  return false;

}



function obtenerClientePorCorreo(correo) {

  const hoja = obtenerHojaClientes();
  const datos = hoja.getDataRange().getValues();

  correo = correo.trim().toLowerCase();

  for (let i = 1; i < datos.length; i++) {

    const correoHoja =
      String(datos[i][3] || '')
        .trim()
        .toLowerCase();

    if (correoHoja === correo) {

      return {

        encontrado: true,

        idCliente: datos[i][0],

        nombre: datos[i][1],

        correo: datos[i][3],

        rol: datos[i][5],

        activo: datos[i][6],

        passwordHash: datos[i][7]

      };

    }

  }

  return {
    encontrado: false
  };

}



function registrarUltimoAcceso(correo) {

  const hoja =
    SpreadsheetApp
      .getActive()
      .getSheetByName(
        'CLIENTES'
      );

  const datos =
    hoja.getDataRange()
      .getValues();

  for (let i = 1; i < datos.length; i++) {

    if (
      String(datos[i][3])
      .trim()
      .toLowerCase()
      ===
      correo
      .trim()
      .toLowerCase()
    ) {

      hoja
        .getRange(i + 1, 9)
        .setValue(new Date());

      return;

    }

  }

}




function reiniciarIntentosFallidos(
  correo
) {

  const hoja =
    SpreadsheetApp
      .getActive()
      .getSheetByName(
        'CLIENTES'
      );

  const datos =
    hoja.getDataRange()
      .getValues();

  for (let i = 1; i < datos.length; i++) {

    if (
      String(datos[i][3])
      .trim()
      .toLowerCase()
      ===
      correo
      .trim()
      .toLowerCase()
    ) {

      hoja
        .getRange(i + 1, 10)
        .setValue(0);

      return;

    }

  }

}






function incrementarIntentosFallidos(
  correo
) {

  const hoja =
    SpreadsheetApp
      .getActive()
      .getSheetByName(
        'CLIENTES'
      );

  const datos =
    hoja.getDataRange()
      .getValues();

  for (let i = 1; i < datos.length; i++) {

    if (
      String(datos[i][3])
      .trim()
      .toLowerCase()
      ===
      correo
      .trim()
      .toLowerCase()
    ) {

      const actual =
        Number(datos[i][9]) || 0;

      hoja
        .getRange(i + 1, 10)
        .setValue(actual + 1);

      return;

    }

  }

}














