// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * ACTIVAR CONTRATO + ENVIAR NOTIFICACIÓN
 * Ruta: https://us-central1-novabooks-35f3b.cloudfunctions.net/activarContrato
 */
exports.activarContrato = functions.https.onRequest(async (req, res) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { contratoId } = body;
    if (!contratoId) return res.status(400).send("Falta contratoId");

    const contratoRef = db.collection("contratos").doc(contratoId);
    const contratoSnap = await contratoRef.get();

    if (!contratoSnap.exists) return res.status(404).send("Contrato no encontrado");

    const contrato = contratoSnap.data();

    const ahora = admin.firestore.Timestamp.now();

    // Cambiar estado a activo
    await contratoRef.update({
      estado: "activo",
      fecha_activacion: ahora
    });

    // Notificar al usuario
    const uid = contrato.cliente_uid;
    if (uid) {
      const userSnap = await db.collection("usuarios").doc(uid).get();
      const token = userSnap.data()?.fcmToken;

      if (token) {
        await admin.messaging().send({
          token,
          notification: {
            title: "Contrato Activado",
            body: `Tu contrato ${contrato.numeroContrato} ha sido activado correctamente.`,
          },
          data: {
            tipo: "contrato_activado",
            contratoId: contratoId,
          }
        });
      }
    }

    return res.status(200).send({ ok: true });

  } catch (err) {
    console.error("ERROR activarContrato:", err);
    return res.status(500).send({ ok: false, error: err.message });
  }
});


/**
 * 🔥 NUEVO: NOTIFICAR ACTIVACIÓN Y FINALIZACIÓN DE REPORTES
 * Ruta: https://us-central1-novabooks-35f3b.cloudfunctions.net/notificarReporte
 */
exports.notificarReporte = functions.https.onRequest(async (req, res) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { uid, tipo, titulo } = body;

    if (!uid) return res.status(400).send("Falta uid");

    // Obtener token FCM del usuario
    const userSnap = await db.collection("usuarios").doc(uid).get();
    const token = userSnap.data()?.fcmToken;

    if (!token) return res.status(404).send("Usuario sin token FCM");

    let msg = "";

    if (tipo === "reporte_activado")
      msg = `Tu reporte "${titulo}" ha sido activado y está en proceso.`;

    if (tipo === "reporte_finalizado")
      msg = `Tu reporte "${titulo}" ha sido finalizado.`;

    // Enviar notificación
    await admin.messaging().send({
      token,
      notification: {
        title: "Actualización de reporte",
        body: msg,
      },
      data: {
        tipo,
        titulo,
      }
    });

    return res.send({ ok: true });

  } catch (err) {
    console.error("ERROR notificarReporte:", err);
    return res.status(500).send(err);
  }
});
