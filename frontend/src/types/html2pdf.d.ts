declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[]
    filename?: string
    image?: { type: string; quality: number }
    html2canvas?: { scale: number }
    jsPDF?: { orientation: string; unit: string; format: string }
    pagebreak?: { mode: string[] }
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf
    from(element: HTMLElement | string): Html2Pdf
    save(): void
    output(type: string): void
  }

  function html2pdf(element?: HTMLElement | string, options?: Html2PdfOptions): Html2Pdf

  export = html2pdf
}
