let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  console.warn('⚠️ Nodemailer module not installed in node_modules. Run "npm install nodemailer" in backend directory.');
}

// Lazy transporter singleton — only created when first needed
let transporter = null;

const getTransporter = () => {
  if (!nodemailer) return null;
  if (transporter) return transporter;

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (!smtpUser || !smtpPass) {
    return null; // Email not configured — skip silently
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  return transporter;
};

// Helper: safely send an email (never throws — failures logged only)
const sendEmail = async ({ to, subject, html }) => {
  try {
    const t = getTransporter();
    if (!t) {
      console.log(`📧 Email skipped (SMTP not configured): ${subject} → ${to}`);
      return;
    }

    const fromName = process.env.MAIL_FROM_NAME || 'PlantNest';
    const fromEmail = process.env.MAIL_FROM || process.env.SMTP_USER;

    await t.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html
    });

    console.log(`✅ Email sent: "${subject}" → ${to}`);
  } catch (err) {
    console.error(`❌ Email send failed: ${subject} → ${to} | Error: ${err.message}`);
  }
};

// ─── Brand colors and base template ─────────────────────────────────────────

const emailBase = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — PlantNest</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f1f5f1; color: #1a2e1a; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #d1e7d1; }
    .header { background: linear-gradient(135deg, #166534, #15803d); padding: 32px 28px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #bbf7d0; font-size: 13px; margin-top: 6px; font-weight: 500; }
    .logo-badge { display: inline-block; background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #d1fae5; letter-spacing: 0.5px; margin-bottom: 12px; }
    .body { padding: 28px; }
    .section-title { font-size: 13px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; margin-top: 24px; border-bottom: 2px solid #dcfce7; padding-bottom: 6px; }
    .info-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid #f0f7f0; font-size: 13px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #6b7280; font-weight: 600; flex: 0 0 140px; }
    .info-value { color: #1a2e1a; font-weight: 700; text-align: right; }
    .highlight { background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 14px 16px; margin: 16px 0; }
    .highlight .amount { font-size: 24px; font-weight: 900; color: #166534; }
    .status-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid #86efac; }
    .item-row { background: #f9fafb; border-radius: 8px; padding: 10px 14px; margin: 6px 0; display: flex; justify-content: space-between; }
    .item-name { font-weight: 600; font-size: 13px; }
    .item-price { font-weight: 700; font-size: 13px; color: #166534; }
    .btn { display: block; width: fit-content; margin: 20px auto; background: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 13px; }
    .footer { background: #f9fafb; padding: 20px 28px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; line-height: 1.6; }
    .footer strong { color: #374151; }
    .divider { height: 1px; background: #e5e7eb; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo-badge">🌿 PlantNest</div>
        <h1>${title}</h1>
        <p>Your green journey companion</p>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <strong>PlantNest Botanical Nursery</strong><br/>
        Gorripudi, Kakinada, East Godavari, Andhra Pradesh - 533004 | surendrachennamalli177@gmail.com<br/>
        +91 96520 77964<br/><br/>
        This is an automated notification. Please do not reply to this email.
      </div>
    </div>
  </div>
</body>
</html>
`;

// ─── Order Confirmation Email ────────────────────────────────────────────────

const sendOrderConfirmation = async (order, user) => {
  if (!user || !user.email) return;

  const itemsList = order.orderItems.map(item => `
    <div class="item-row">
      <span class="item-name">🌿 ${item.name} <span style="font-weight:400; color:#6b7280;">× ${item.quantity}</span></span>
      <span class="item-price">₹${item.finalPrice * item.quantity}</span>
    </div>
  `).join('');

  const addr = order.shippingAddress;

  const content = `
    <p style="font-size:14px; color:#374151; margin-bottom:4px;">Hi <strong>${user.name || 'Valued Customer'}</strong>,</p>
    <p style="font-size:13px; color:#6b7280; margin-bottom:20px;">Thank you for shopping with PlantNest! 🎉 Your order has been confirmed and our nursery team is getting your plants ready.</p>

    <div class="highlight">
      <div style="font-size:12px; color:#6b7280; font-weight:600;">Order Total</div>
      <div class="amount">₹${order.totalAmount}</div>
      <div style="margin-top:6px;"><span class="status-badge">✓ ${order.paymentStatus}</span></div>
    </div>

    <div class="section-title">Order Details</div>
    <div class="info-row"><span class="info-label">Order ID</span><span class="info-value">#${order._id.toString().slice(-8).toUpperCase()}</span></div>
    <div class="info-row"><span class="info-label">Payment Method</span><span class="info-value">${order.paymentMethod}</span></div>
    <div class="info-row"><span class="info-label">Items Subtotal</span><span class="info-value">₹${order.itemsPrice}</span></div>
    <div class="info-row"><span class="info-label">Shipping</span><span class="info-value">${order.shippingPrice === 0 ? 'FREE' : '₹' + order.shippingPrice}</span></div>
    <div class="info-row"><span class="info-label">Grand Total</span><span class="info-value" style="color:#166534;">₹${order.totalAmount}</span></div>

    <div class="section-title">Items Ordered</div>
    ${itemsList}

    <div class="section-title">Delivery Address</div>
    <div class="info-row"><span class="info-label">Name</span><span class="info-value">${addr.fullName}</span></div>
    <div class="info-row"><span class="info-label">Address</span><span class="info-value">${addr.street}, ${addr.city}</span></div>
    <div class="info-row"><span class="info-label">State / PIN</span><span class="info-value">${addr.state} - ${addr.postalCode}</span></div>
    <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${addr.phone}</span></div>

    <p style="font-size:12px; color:#6b7280; margin-top:20px; line-height:1.6;">
      Estimated delivery: <strong>3–5 business days</strong>. You'll receive another email when your order is shipped with tracking information.
    </p>
  `;

  await sendEmail({
    to: user.email,
    subject: `✅ Order Confirmed #${order._id.toString().slice(-8).toUpperCase()} — PlantNest`,
    html: emailBase('Order Confirmed! 🌿', content)
  });
};

// ─── Order Status Update Email ───────────────────────────────────────────────

const sendOrderStatusUpdate = async (order, user, newStatus) => {
  if (!user || !user.email) return;

  const statusEmoji = {
    Processing: '⚙️',
    Shipped: '🚚',
    'Out for Delivery': '📦',
    Delivered: '✅',
    Cancelled: '❌'
  }[newStatus] || '📋';

  const statusMessage = {
    Processing: 'Our nursery team has started preparing and packaging your plants with care.',
    Shipped: 'Your plants are on their way! Carefully packed in eco-friendly boxes.',
    'Out for Delivery': 'Your order is out for delivery today. Please ensure someone is available to receive it.',
    Delivered: 'Your plants have been delivered successfully. We hope you love them! 🌱',
    Cancelled: 'Your order has been cancelled. Any applicable refund will be processed within 5–7 business days.'
  }[newStatus] || `Your order status has been updated to ${newStatus}.`;

  const content = `
    <p style="font-size:14px; color:#374151; margin-bottom:4px;">Hi <strong>${user.name || 'Valued Customer'}</strong>,</p>
    <p style="font-size:13px; color:#6b7280; margin-bottom:20px;">Here's an update on your PlantNest order.</p>

    <div class="highlight">
      <div style="font-size:12px; color:#6b7280; font-weight:600; margin-bottom:8px;">Order Status Update</div>
      <div style="font-size:20px; font-weight:900; color:#166534;">${statusEmoji} ${newStatus}</div>
    </div>

    <div class="section-title">Order Details</div>
    <div class="info-row"><span class="info-label">Order ID</span><span class="info-value">#${order._id.toString().slice(-8).toUpperCase()}</span></div>
    <div class="info-row"><span class="info-label">Order Total</span><span class="info-value">₹${order.totalAmount}</span></div>
    <div class="info-row"><span class="info-label">Payment Status</span><span class="info-value">${order.paymentStatus}</span></div>

    <div class="divider"></div>
    <p style="font-size:13px; color:#374151; line-height:1.7;">${statusMessage}</p>
  `;

  await sendEmail({
    to: user.email,
    subject: `${statusEmoji} Order #${order._id.toString().slice(-8).toUpperCase()} — ${newStatus} — PlantNest`,
    html: emailBase(`Order ${newStatus}`, content)
  });
};

// ─── Order Cancellation Email ────────────────────────────────────────────────

const sendOrderCancellation = async (order, user) => {
  await sendOrderStatusUpdate(order, user, 'Cancelled');
};

module.exports = {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendOrderCancellation
};
