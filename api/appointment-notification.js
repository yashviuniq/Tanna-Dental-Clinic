function getAppointmentText(appointment) {
  const lines = [
    'New appointment request',
    '',
    `Name: ${appointment.name || 'Not provided'}`,
    `Phone: ${appointment.phone || 'Not provided'}`,
    `Email: ${appointment.email || 'Not provided'}`,
    `Service: ${appointment.service || 'Not provided'}`,
    `Preferred date: ${appointment.preferred_date || 'Not provided'}`,
    `Notes: ${appointment.notes || 'None'}`
  ];

  return lines.join('\n');
}

function getAppointmentHtml(appointment) {
  const escapeHtml = (value) =>
    String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const rows = [
    ['Name', appointment.name],
    ['Phone', appointment.phone],
    ['Email', appointment.email || 'Not provided'],
    ['Service', appointment.service],
    ['Preferred date', appointment.preferred_date],
    ['Notes', appointment.notes || 'None']
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.5">
      <h2 style="margin:0 0 16px;color:#4c1d95">New appointment request</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #e5e7eb;font-weight:700;width:150px;background:#f9fafb">${escapeHtml(label)}</td>
                <td style="border:1px solid #e5e7eb">${escapeHtml(value || 'Not provided')}</td>
              </tr>`
          )
          .join('')}
      </table>
    </div>
  `;
}

function parseRecipients(value, fallback) {
  return (value || fallback)
    .split(',')
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

async function sendEmailNotification(appointment) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = parseRecipients(
    process.env.ADMIN_EMAIL,
    'drdineshtanna@gmail.com,1675.yashvi@gmail.com'
  );
  const from = process.env.NOTIFICATION_FROM_EMAIL || 'Tanna Dental <onboarding@resend.dev>';

  if (!apiKey || !to.length) {
    return { channel: 'email', skipped: true, reason: 'Missing RESEND_API_KEY or ADMIN_EMAIL' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to,
      subject: `New appointment request from ${appointment.name || 'patient'}`,
      text: getAppointmentText(appointment),
      html: getAppointmentHtml(appointment)
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Email notification failed: ${details}`);
  }

  return { channel: 'email', sent: true };
}

async function sendWhatsAppNotification(appointment) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipients = parseRecipients(process.env.ADMIN_WHATSAPP_TO, '919860703424,917820840535');
  const apiVersion = process.env.WHATSAPP_API_VERSION || 'v26.0';

  if (!token || !phoneNumberId || !recipients.length) {
    return {
      channel: 'whatsapp',
      skipped: true,
      reason: 'Missing WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, or ADMIN_WHATSAPP_TO'
    };
  }

  const results = [];
  const errors = [];

  for (const to of recipients) {
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body: getAppointmentText(appointment)
        }
      })
    });

    if (!response.ok) {
      const details = await response.text();
      errors.push(`WhatsApp notification failed for ${to}: ${details}`);
    } else {
      results.push(to);
    }
  }

  if (errors.length) {
    throw new Error(errors.join(' | '));
  }

  return { channel: 'whatsapp', sent: true, recipients: results.length };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appointment = req.body || {};

  if (!appointment.name || !appointment.phone || !appointment.preferred_date) {
    return res.status(400).json({ error: 'Missing required appointment details' });
  }

  const results = [];
  const errors = [];

  for (const notifier of [sendEmailNotification, sendWhatsAppNotification]) {
    try {
      results.push(await notifier(appointment));
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (errors.length) {
    return res.status(502).json({ results, errors });
  }

  return res.status(200).json({ results });
};
