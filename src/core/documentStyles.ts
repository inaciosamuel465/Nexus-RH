export const documentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
  
  :root {
    --primary: #000;
    --text-main: #333;
    --text-light: #666;
    --accent: #2563eb;
  }

  * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
  
  body { 
    margin: 0; 
    padding: 0; 
    font-family: 'Inter', sans-serif; 
    background: #f4f4f4;
    color: var(--text-main);
  }

  .a4-page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    margin: 10mm auto;
    background: #fff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
  }

  @media print {
    body { background: white; }
    .a4-page { margin: 0; box-shadow: none; width: 100%; border: none; }
    .no-print { display: none; }
  }

  .header { border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: 20px; }
  .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
  .header p { margin: 5px 0; color: var(--text-light); font-size: 14px; }

  .section { margin-bottom: 25px; }
  .section-title { 
    font-size: 16px; 
    font-weight: 700; 
    color: var(--primary); 
    text-transform: uppercase; 
    border-left: 4px solid var(--accent);
    padding-left: 10px;
    margin-bottom: 15px;
  }

  .cv-content { line-height: 1.6; font-size: 14px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  
  .badge {
    background: #e5e7eb;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    display: inline-block;
    margin: 3px;
  }

  .footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; font-size: 10px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
  
  .btn-print {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--accent);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
`;
