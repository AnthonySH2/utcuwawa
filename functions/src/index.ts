import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();

export const generarBoleta = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Método no permitido' });
    }

    const {
      cliente,
      productos,
      total,
      tipo_documento = '03', // boleta por defecto
      moneda = 'PEN'
    } = req.body;

    // Validaciones básicas
    if (!cliente || !cliente.numero_documento || !cliente.nombre) {
      res.status(400).json({ error: 'Información del cliente incompleta' });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        res.status(400).json({ error: 'No hay productos en la venta' });
    }

    const items = productos.map((p: any) => {
      if (!p.codigo || !p.descripcion || !p.cantidad || !p.precio_unitario) {
        throw new Error('Datos incompletos en productos');
      }

      return {
        unidad_de_medida: p.unidad || 'NIU',
        codigo: p.codigo,
        descripcion: p.descripcion,
        cantidad: p.cantidad,
        valor_unitario: (p.precio_unitario / 1.18).toFixed(2),
        precio_unitario: p.precio_unitario,
        tipo_de_igv: 1,
        igv: ((p.precio_unitario * p.cantidad) * 0.18).toFixed(2),
        valor_total: ((p.precio_unitario / 1.18) * p.cantidad).toFixed(2),
        importe_total: (p.precio_unitario * p.cantidad).toFixed(2),
      };
    });

    // Construimos el JSON según NubeFact
    const data = {
      tipo_de_comprobante: tipo_documento, // 01 = factura, 03 = boleta
      serie: tipo_documento === '01' ? 'F001' : 'B001',
      numero: 0, // dejar en 0 para que lo genere automático
      cliente_tipo_de_documento: cliente.tipo_documento || '1', // DNI
      cliente_numero_de_documento: cliente.numero_documento,
      cliente_nombre: cliente.nombre,
      cliente_direccion: cliente.direccion || '',
      cliente_email: cliente.email || '',
      cliente_celular: cliente.celular || '',
      fecha_de_emision: new Date().toISOString().slice(0, 10),
      moneda,
      total_gravada: (total / 1.18).toFixed(2),
      total_igv: (total - (total / 1.18)).toFixed(2),
      total: total.toFixed(2),
      items,
    };

    // Llamada al API de NubeFact
    const API_URL = functions.config().nubefact.api_url;
    const TOKEN = functions.config().nubefact.token;

    const response = await axios.post(API_URL, data, {
      headers: {
        'Authorization': `Token token=${TOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    res.status(200).json({ respuesta: response.data });

  } catch (error: any) {
    console.error('Error al generar boleta:', error);
    res.status(500).json({
      error: true,
      message: error.message || 'Error desconocido'
    });
  }
});


