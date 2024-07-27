const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const pdfprint = require('../models/maesbono_model');

// Middleware para parsear JSON
router.use(express.json());

// Ruta para generar y descargar el PDF
router.post('/desmaesbonopdf', async (req, res) => { // Cambiado de GET a POST
   const { gestion, mes, coddis, sieue } = req.body; // Obtener id_compra de los parámetros de consulta
 
   try {
     const result = await pdfprint.getAll(gestion, mes, coddis);
     if (result.error) {
       return res.status(404).send(result.message);
     }
 
     const bono = result.data[0];
 
     const doc = new PDFDocument({ layout: 'landscape', margin: 10 });
 
     let filename = 'Recibo.pdf';
     filename = encodeURIComponent(filename);
 
     res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
     res.setHeader('Content-type', 'application/pdf');
 
     doc.pipe(res);
 
     // Ruta al archivo TTF de Arial
     const fontPath = path.join(__dirname, '../../../public/font/Arial.ttf');
     const fontPat = path.join(__dirname, '../../../public/font/Arial_Bold.ttf');
     const fontPa = path.join(__dirname, '../../../public/font/MSung_HK_Medium.ttf');
 
     // Registrar la fuente Arial en PDFKit
     doc.registerFont('Arial', fontPath);
     doc.registerFont('Arial-Bold', fontPat);
     doc.registerFont('MSung', fontPa);
 
     // Añadir encabezado e imagen
     const imagePath = path.join(__dirname, '../../../public/img/Chakana.png');
     doc.image(imagePath, 50, 20, { width: 55 });
 
     // Ajustar tamaño y centrar texto "REPORTE DE BONO ZONA" y "CENTROS EDUCATIVOS"
    const headerText1 = 'REPORTE DE BONO ZONA';
    const headerText2 = 'CENTROS EDUCATIVOS';
    const headerText3 = sieue;

    const margin = 10; // Margen del documento

    const pageWidth = doc.page.width - 2 * margin;

    const headerTextY = 30;
 
     // Función para agregar encabezado
    const addHeader = () => {
      doc.font('Arial-Bold').fontSize(10)
        .text(headerText1, margin, headerTextY, {
          align: 'center',
          width: pageWidth
        })
        .moveDown()
        .text(headerText2, margin, doc.y - 10, {
          align: 'center',
          width: pageWidth
        })
        .moveDown();

      // Cambiar el tamaño de fuente para headerText3
      doc.fontSize(8).text(headerText3, margin, doc.y - 8, {
        align: 'center', // Alinea el texto al centro
        width: pageWidth  // Limita el ancho del texto
      });
 
       doc.fontSize(5).text('ESTADO PLURINACIONAL DE', 120, 30)
         .font('MSung').fontSize(19).text('BOLIVIA', 117, 29)
         .font('Arial-Bold').fontSize(5).text('MINISTERIO DE EDUCACION', 120, 52)
         .font('Arial-Bold').fontSize(5).text('DIRECCION DEPARTAMENTAL DE', 115, 58)
         .font('Arial-Bold').fontSize(5).text('EDUCACION DE SANTA CRUZ', 119, 65);
 
       doc.font('Arial-Bold')
         .moveTo(25, 90)
         .lineTo(762, 90)
         .stroke();
 
       doc.font('Arial-Bold')
         .moveTo(25, 93)
         .lineTo(762, 93)
         .stroke();
 
       doc.moveDown();
       doc.fontSize(8)
         .text('RDA:', 70, 80)
         .text('MAESTRO_A', 220, 80)
         .text('CARGO', 450, 80)
         .text('SERVICIO_ITEM', 630, 80);
     };
 
     // Función para agregar líneas horizontales al final de la página
     const addFooterLines = (pageNumber,totalPages) => {
       const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario
       doc.moveTo(25, finalYPosition)
         .lineTo(762, finalYPosition)
         .stroke();
 
       doc.moveTo(25, finalYPosition + 3)
         .lineTo(762, finalYPosition + 3)
         .stroke();
         
       doc.fontSize(8)
         .text(`Página ${pageNumber} de ${totalPages}`, doc.page.width - 100, finalYPosition + 10, { align: 'left'});
 
    };
 
    let pageNumber = 1; // Inicializar el número de página

     // Añadir encabezado inicial
     addHeader();
 
     // Añadir tabla de datos
     let yPosition = 105;
     const rowHeight = 20;
     const maxRowsPerPage = Math.floor((doc.page.height - yPosition - 50) / rowHeight);
     const totalPages = Math.ceil(result.data.length / maxRowsPerPage);

     result.data.forEach((row, index) => {
       if (index > 0 && index % maxRowsPerPage === 0) {
         addFooterLines(pageNumber, totalPages); // Añadir líneas horizontales al final de la página antes de añadir una nueva
         doc.addPage();
         addHeader();
         yPosition = 105;
       }
 
       doc.text(row.RDA, 65, yPosition)
         .text(row.MAESTRO_A, 170, yPosition)
         .text(row.CARGO, 400, yPosition)
         .text(row.SERVICIO_ITEM, 635, yPosition);
       yPosition += rowHeight;
     });
 
     // Añadir líneas horizontales al final de la última página
     addFooterLines(pageNumber, totalPages);
 
     doc.end();
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 });

router.post('/desmaesbonoxls', async (req, res) => {
   const { gestion, mes, coddis, sieu } = req.body;

   try {
       const result = await pdfprint.getAll( gestion, mes, coddis);
       if (result.error) {
           return res.status(404).send(result.message);
       }

       const workbook = new ExcelJS.Workbook();

        // Establecer propiedades del documento
        workbook.creator = 'Nombre del Creador';
        workbook.lastModifiedBy = 'Nombre del Modificador';
        workbook.created = new Date();
        workbook.modified = new Date();

        // Añadir imágenes
        const imagePath = path.join(__dirname, '../../../public/img/Chakana_texto.png');
        const imageId = workbook.addImage({
            filename: imagePath,
            extension: 'png',
        });

        const imagePathline = path.join(__dirname, '../../../public/img/line.png');
        const imageIdline = workbook.addImage({
            filename: imagePathline,
            extension: 'png',
        });

        // Configuración de márgenes
        const pageSetupConfig = {
            orientation: 'landscape',
            margins: {
                left: 0.30, // margen izquierdo en pulgadas
                right: 0, // margen derecho en pulgadas
                top: 0.25, // margen superior en pulgadas
                bottom: 0.25, // margen inferior en pulgadas
                header: 0.1, // margen del encabezado en pulgadas
                footer: 0.1 // margen del pie de página en pulgadas
            }, 
            printOptions: {
               horizontalCentered: true,
               verticalCentered: true
           },
           fitToPage: true,
           fitToHeight: 1,
           fitToWidth: 1,
           horizontalDpi: 300,
           verticalDpi: 300
        };

        const createWorksheetWithHeader = (sheetName) => {
            const worksheet = workbook.addWorksheet(sheetName, { pageSetup: pageSetupConfig });
            worksheet.headerFooter.oddFooter = '&RPágina &P de &N';
            worksheet.addImage(imageId, {
                tl: { col: 1.5, row: .5 },
                ext: { width: 200, height: 80 }
            });

            // Configurar las columnas para la tabla de datos
            worksheet.columns = [
                { header: '', key: 'col1', width: 2 },  // Columna A
                { header: '', key: 'col2', width: 13 },  // Columna B (ancho ajustado)
                { header: '', key: 'col3', width: 7 },  // Columna C
                { header: '', key: 'col4', width: 10 },  // Columna D
                { header: '', key: 'col5', width: 10 },  // Columna E
                { header: '', key: 'col6', width: 10 },
                { header: '', key: 'col7', width: 15 },
                { header: '', key: 'col8', width: 21 },
                { header: '', key: 'col9', width: 10 },
                { header: '', key: 'col10', width: 10 },
                { header: '', key: 'col11', width: 13 },
                { header: '', key: 'col12', width: 7 },
                { header: '', key: 'col13', width: 10 },
                { header: '', key: 'col14', width: 10 }
            ];

            // Calcular el ancho total de las columnas de la 1 a la 12
            const totalWidth = worksheet.columns.slice(1, 12).reduce((acc, col) => acc + col.width * 8.50, 0);

            const headerImagePosition = {
                tl: { col: 1, row: 5 },
                ext: { width: totalWidth, height: 8 }
            };

            worksheet.addImage(imageIdline, headerImagePosition);

            // Añadir encabezado y centrar
            const mergeRange1 = `A2:N2`; // Ajustar el rango según el número total de columnas (A a M para 14 columnas)
            const mergeRange2 = `A3:N3`; // Ajustar el rango según el número total de columnas (A a M para 14 columnas)
            const mergeRange3 = `A4:N4`; // Ajustar el rango según el número total de columnas (A a M para 14 columnas)

            // Añadir encabezado
            worksheet.mergeCells(mergeRange1);
            worksheet.getCell('A2').value = 'REPORTE DE BONO ZONA';
            worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A2').font = { size: 14, bold: true };

            worksheet.mergeCells(mergeRange2);
            worksheet.getCell('A3').value = 'CENTROS EDUCATIVOS';
            worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A3').font = { size: 14, bold: true };

            worksheet.mergeCells(mergeRange3);
            worksheet.getCell('A4').value = sieu;
            worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A4').font = { size: 10, bold: true };

            // Añadir encabezados de la tabla
            worksheet.getRow(5).getCell(2).value = 'RDA'; // Mover a la columna D
            worksheet.getRow(5).getCell(4).value = 'MAESTRO_A'; // Mantener en la columna E
            worksheet.getRow(5).getCell(8).value = 'CARGO';
            worksheet.getRow(5).getCell(12).value = 'SERVICIO_ITEM';
            worksheet.getRow(5).font = { bold: true , size: 12}; // Encabezados de las columnas

            // Combinar las celdas C, D y E en la fila 5
            worksheet.mergeCells('B5:C5');
            const mergedCell = worksheet.getCell('B5');
            mergedCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 3 }; // Centrar texto

            // Combinar las celdas J, K y L en la fila 5 y centrar texto
            worksheet.mergeCells('D5:G5');
            const mergedCellhi = worksheet.getCell('D5');
            mergedCellhi.alignment = { vertical: 'middle', horizontal: 'left', indent: 7 }; // Ajustar la alineación horizontal y el margen izquierdo

            // Combinar las celdas J, K y L en la fila 5 y centrar texto
            worksheet.mergeCells('H5:K5');
            const mergedCellJK = worksheet.getCell('H5');
            mergedCellJK.alignment = { vertical: 'middle', horizontal: 'center' }; // Ajustar la alineación horizontal y el margen izquierdo

            // Combinar las celdas J, K y L en la fila 5 y centrar texto
            worksheet.mergeCells('L5:N5');
            const mergedCellJKL = worksheet.getCell('L5');
            mergedCellJKL.alignment = { vertical: 'middle', horizontal: 'center' }; // Ajustar la alineación horizontal y el margen izquierdo

            return worksheet;
        };
       // Añadir datos a la tabla y combinarlas celdas en cada fila
       const maxRowsPerPage = 23; // Ajusta según el número de filas que quieres por página
       let currentSheetIndex = 1;
       let currentWorksheet = createWorksheetWithHeader(`Reporte ${currentSheetIndex}`);
       let currentRowIndex = 7; // Comenzar después del encabezado

       result.data.forEach((row, index) => {
           if ((index + 1) % maxRowsPerPage === 0) {

               // Calcular el ancho total de las columnas de la 1 a la 11 para la imagen de pie de página
               const footerTotalWidth = currentWorksheet.columns.slice(1, 12).reduce((acc, col) => acc + col.width * 8.50, 0);

               // Añadir imagen de pie de página al final de la hoja antes de pasar a la siguiente
               const footerImagePosition = {
                   tl: { col: 1, row: 29},
                   ext: { width: footerTotalWidth, height: 8 }
               };
               currentWorksheet.addImage(imageIdline, footerImagePosition);

               
               currentSheetIndex++;
               currentWorksheet = createWorksheetWithHeader(`Reporte ${currentSheetIndex}`);
               currentRowIndex = 7;
           }

           const newRow = currentWorksheet.getRow(currentRowIndex);
           newRow.height = 21; // Aumentar la altura de la fila

           currentWorksheet.mergeCells(`B${currentRowIndex}:B${currentRowIndex}`);
           const mergedCellbcdef = currentWorksheet.getCell(`B${currentRowIndex}`);
           mergedCellbcdef.value = row.RDA;
           mergedCellbcdef.alignment = { vertical: 'middle', horizontal: 'left', indent: 1.9};

           currentWorksheet.mergeCells(`C${currentRowIndex}:G${currentRowIndex}`);
           const mergedCellijklm = currentWorksheet.getCell(`C${currentRowIndex}`);
           mergedCellijklm.value = row.MAESTRO_A;
           mergedCellijklm.alignment = { vertical: 'middle', horizontal: 'left', indent: 1};

           currentWorksheet.mergeCells(`H${currentRowIndex}:K${currentRowIndex}`);
           const mergedCellhij = currentWorksheet.getCell(`H${currentRowIndex}`);
           mergedCellhij.value = row.CARGO;
           mergedCellhij.alignment = { vertical: 'middle', horizontal: 'left'};

           currentWorksheet.mergeCells(`L${currentRowIndex}:N${currentRowIndex}`);
           const mergedCellkl = currentWorksheet.getCell(`L${currentRowIndex}`);
           mergedCellkl.value = row.SERVICIO_ITEM;
           mergedCellkl.alignment = { vertical: 'middle', horizontal: 'center'};

           // Ajustar tamaño de fuente para los títulos
           mergedCellbcdef.font = { size: 12}
           mergedCellijklm.font = { size: 12};
           mergedCellhij.font = { size: 12}
           mergedCellkl.font = { size: 12}

           newRow.commit();
           currentRowIndex++;
       });

       // Calcular el ancho total de las columnas de la 1 a la 11 para la imagen de pie de página
       const footerTotalWidth = currentWorksheet.columns.slice(1, 12).reduce((acc, col) => acc + col.width * 8.50, 0);

       // Añadir imagen de pie de página al final de la hoja antes de pasar a la siguiente
       const footerImagePosition = {
           tl: { col: 1, row: 36 },
           ext: { width: footerTotalWidth, height: 8 }
       };
       currentWorksheet.addImage(imageIdline, footerImagePosition);

       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
       res.setHeader('Content-Disposition', 'attachment; filename="reporte.xlsx"');

       await workbook.xlsx.write(res);
       res.end();
       
   } catch (error) {
      console.error('Error al generar el archivo Excel:', error.message);
      res.status(500).json({ error: 'Error al generar el archivo Excel' });
   }
});



module.exports = router;
