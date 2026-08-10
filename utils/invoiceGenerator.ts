const logoImage = "/assets/laptop_logo.webp";

interface InvoiceData {
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  pincode: string;
  deviceModel: string;
  deviceBrand: string;
  deviceSeries: string;
  condition: string;
  estimatedPrice: number;
  finalPrice?: number;
}

export const generateInvoice = async (data: InvoiceData) => {
  // Create a new window for the invoice
  const invoiceWindow = window.open('', '_blank');
  
  if (!invoiceWindow) {
    throw new Error('Could not open invoice window. Please allow popups.');
  }

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${data.orderId}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          padding: 40px;
          background: #f5f5f5;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #8B5CF6;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        
        .company-info h1 {
          font-size: 28px;
          color: #8B5CF6;
          margin-bottom: 5px;
        }
        
        .company-info p {
          color: #666;
          font-size: 14px;
        }
        
        .invoice-details {
          text-align: right;
        }
        
        .invoice-details h2 {
          font-size: 32px;
          color: #333;
          margin-bottom: 10px;
        }
        
        .invoice-details p {
          color: #666;
          font-size: 14px;
          margin: 5px 0;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #8B5CF6;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .info-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
        }
        
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        
        .info-value {
          font-size: 15px;
          color: #333;
          font-weight: 500;
        }
        
        .device-details {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 8px;
          margin: 30px 0;
        }
        
        .device-details h3 {
          font-size: 20px;
          margin-bottom: 15px;
        }
        
        .device-details .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .device-details .detail-row:last-child {
          border-bottom: none;
        }
        
        .price-section {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          margin-top: 30px;
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 16px;
        }
        
        .price-total {
          border-top: 2px solid #8B5CF6;
          margin-top: 15px;
          padding-top: 15px;
          font-size: 24px;
          font-weight: bold;
          color: #8B5CF6;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #eee;
          text-align: center;
          color: #666;
          font-size: 13px;
        }
        
        .footer p {
          margin: 5px 0;
        }
        
        .thank-you {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-top: 30px;
          font-size: 18px;
          font-weight: 500;
        }
        
        @media print {
          body {
            padding: 0;
            background: white;
          }
          
          .invoice-container {
            box-shadow: none;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo-section">
            <img src="${logoImage}" alt="Laptap.in Logo" class="logo" />
            <div class="company-info">
              <h1>Laptap.in</h1>
              <p>Best Place to Sell Your Devices</p>
              <p>www.laptap.in</p>
            </div>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Date:</strong> ${data.date}</p>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Name</div>
              <div class="info-value">${data.customerName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${data.customerEmail}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone</div>
              <div class="info-value">${data.customerPhone}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Pincode</div>
              <div class="info-value">${data.pincode}</div>
            </div>
          </div>
          <div class="info-item" style="margin-top: 15px;">
            <div class="info-label">Address</div>
            <div class="info-value">${data.address}</div>
          </div>
        </div>
        
        <div class="device-details">
          <h3>Device Details</h3>
          <div class="detail-row">
            <span>Brand</span>
            <span><strong>${data.deviceBrand}</strong></span>
          </div>
          <div class="detail-row">
            <span>Series</span>
            <span><strong>${data.deviceSeries}</strong></span>
          </div>
          <div class="detail-row">
            <span>Model</span>
            <span><strong>${data.deviceModel}</strong></span>
          </div>
          <div class="detail-row">
            <span>Condition</span>
            <span><strong>${data.condition}</strong></span>
          </div>
        </div>
        
        <div class="price-section">
          <div class="price-row">
            <span>Estimated Price</span>
            <span>₹${data.estimatedPrice.toLocaleString('en-IN')}</span>
          </div>
          ${data.finalPrice ? `
          <div class="price-row">
            <span>Final Price (After Verification)</span>
            <span>₹${data.finalPrice.toLocaleString('en-IN')}</span>
          </div>
          ` : ''}
          <div class="price-row price-total">
            <span>Total Amount</span>
            <span>₹${(data.finalPrice || data.estimatedPrice).toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <div class="thank-you">
          Thank you for choosing Laptap.in! 🎉
        </div>
        
        <div class="footer">
          <p style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin-bottom: 20px; color: #856404;">
            <strong>Disclaimer:</strong> This is not a sales invoice. This is just a booking invoice with reference number. 
            Sales invoice will be shared once the device is picked up.
          </p>
          <p><strong>Laptap.in</strong> - Your Trusted Device Selling Platform</p>
          <p>Contact: laptap.in@gmail.com</p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  invoiceWindow.document.write(invoiceHTML);
  invoiceWindow.document.close();
};
