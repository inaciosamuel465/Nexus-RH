import { documentStyles } from './documentStyles.js';

export class TemplateEngine {
  public static renderCV(data: any): string {
    const skills = data.aiAnalysis?.strengths || [];
    
    return `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>Currículo - ${data.name}</title>
          <style>${documentStyles}</style>
      </head>
      <body>
          <button class="btn-print no-print" onclick="window.print()">Imprimir PDF</button>
          
          <div class="a4-page">
              <div class="header">
                  <h1>${data.name}</h1>
                  <p>${data.appliedRole} | ${data.email}</p>
              </div>

              <div class="section">
                  <div class="section-title">Resumo Profissional (IA)</div>
                  <div class="cv-content">
                      ${data.cvSummary || 'Sem resumo disponível.'}
                  </div>
              </div>

              <div class="grid">
                  <div class="section">
                      <div class="section-title">Principais Habilidades</div>
                      <div>
                          ${skills.map((s: string) => `<span class="badge">${s}</span>`).join('')}
                      </div>
                  </div>
                  <div class="section">
                      <div class="section-title">Score de Match</div>
                      <div style="font-size: 32px; font-weight: 700; color: var(--accent);">
                          ${data.aiScore || 0}%
                      </div>
                  </div>
              </div>

              <div class="section">
                  <div class="section-title">Recomendação do Recrutador IA</div>
                  <div class="cv-content" style="font-style: italic; color: var(--text-light);">
                      "${data.aiAnalysis?.recommendation || 'Pendente de análise profunda.'}"
                  </div>
              </div>

              <div class="footer">
                  Gerado automaticamente pelo Nexus RH SaaS em ${new Date().toLocaleDateString('pt-BR')}
              </div>
          </div>
      </body>
      </html>
    `;
  }

  public static renderDocument(type: string, content: string, variables: any): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <title>${type}</title>
          <style>${documentStyles}</style>
      </head>
      <body>
          <button class="btn-print no-print" onclick="window.print()">Imprimir Documento</button>
          
          <div class="a4-page">
              <div class="header">
                  <h1>${type}</h1>
                  <p>Nexus Management Suite V3.0</p>
              </div>

              <div class="section">
                  <div class="cv-content">
                      ${content}
                  </div>
              </div>

              <div class="footer">
                  Documento emitido para ${variables.employeeName || 'Colaborador'} | Autenticado Digitalmente
              </div>
          </div>
      </body>
      </html>
    `;
  }
}
