/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const Users = require('../controllers/bonozona_controller')

// Ruta para obtener U.E. con bono zona
router.post('/bonozona', Users.getAll);
// Ruta para obtener los distritos
router.get('/gestion', Users.gestion);


router.post('/pdf', (req, res) => {
   const { datosTabla } = req.body;

   // Crear un nuevo documento PDF en orientación horizontal con margen de 10
   const doc = new PDFDocument({ layout: 'landscape', margin: 10 });
   let filename = 'reporte.pdf';
   filename = encodeURIComponent(filename);

   res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
   res.setHeader('Content-type', 'application/pdf');

   doc.pipe(res);

   // Ruta al archivo TTF de Arialzz
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
   const headerTextWidth1 = doc.widthOfString(headerText1);
   const headerTextWidth2 = doc.widthOfString(headerText2);
   const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
   const headerTextX2 = (doc.page.width - headerTextWidth2) / 2;
   const headerTextY = 30;

   // Función para agregar encabezado
   const addHeader = () => {
       doc.image(imagePath, 50, 20, { width: 55 });

       doc.font('Arial-Bold').fontSize(10) // Usar Arial-Bold en lugar de Helvetica-Bold
           .text(headerText1, headerTextX1, headerTextY)
           .moveDown()
           .text(headerText2, headerTextX2, doc.y - 10);

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
           .text('DISTRITO EDUCATIVO:', 160, 80)
           .text('CENTROS EDUCATIVOS', 500, 80);
   };

   // Función para agregar líneas horizontales al final de la página
   const addFooterLines = () => {
       const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario
       doc.moveTo(25, finalYPosition)
           .lineTo(762, finalYPosition)
           .stroke();

       doc.moveTo(25, finalYPosition + 3)
           .lineTo(762, finalYPosition + 3)
           .stroke();
   };

   // Añadir encabezado inicial
   addHeader();

   // Añadir tabla de datos
   let yPosition = 105;
   const rowHeight = 20;
   const maxRowsPerPage = Math.floor((doc.page.height - yPosition - 50) / rowHeight);

   datosTabla.forEach((row, index) => {
       if (index > 0 && index % maxRowsPerPage === 0) {
           addFooterLines(); // Añadir líneas horizontales al final de la página antes de añadir una nueva
           doc.addPage();
           addHeader();
           yPosition = 105;
       }

       doc.font('Arial').fontSize(8) // Usar Arial en lugar de la fuente por defecto
           .text(row[0], 120, yPosition)
           .text(row[1], 480, yPosition);
       yPosition += rowHeight;
   });

   // Añadir líneas horizontales al final de la última página
   addFooterLines();

   doc.end();
});

router.post('/xls', async (req, res) => {
    const { datosTabla } = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Establecer propiedades del documento
    workbook.creator = 'Nombre del Creador';
    workbook.lastModifiedBy = 'Nombre del Modificador';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Añadir imagen
    const imagePath = path.join(__dirname, '../../../public/img/Chakana.png');
    const imageId = workbook.addImage({
        filename: imagePath,
        extension: 'png',
    });

    worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 80, height: 80 }
    });

    // Añadir encabezado
    worksheet.mergeCells('C1:F1');
    worksheet.getCell('C1').value = 'REPORTE DE BONO ZONA';
    worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C1').font = { size: 14, bold: true };

    worksheet.mergeCells('C2:F2');
    worksheet.getCell('C2').value = 'CENTROS EDUCATIVOS';
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { size: 12, bold: true };

    // Añadir texto adicional del encabezado
    worksheet.mergeCells('B3:C3');
    worksheet.getCell('B3').value = 'ESTADO PLURINACIONAL DE';
    worksheet.getCell('B3').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B3').font = { size: 5 };

    worksheet.mergeCells('D3:E3');
    worksheet.getCell('D3').value = 'BOLIVIA';
    worksheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D3').font = { name: 'Arial', size: 19 };

    worksheet.mergeCells('B4:C4');
    worksheet.getCell('B4').value = 'MINISTERIO DE EDUCACION';
    worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B4').font = { size: 5 };

    worksheet.mergeCells('B5:C5');
    worksheet.getCell('B5').value = 'DIRECCION DEPARTAMENTAL DE';
    worksheet.getCell('B5').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B5').font = { size: 5 };

    worksheet.mergeCells('B6:C6');
    worksheet.getCell('B6').value = 'EDUCACION DE SANTA CRUZ';
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B6').font = { size: 5 };

    // Añadir líneas horizontales
    const addHorizontalLines = (startRow) => {
        const row = worksheet.getRow(startRow);
        row.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'thin' },
            };
        });

        const nextRow = worksheet.getRow(startRow + 1);
        nextRow.eachCell((cell, colNumber) => {
            cell.border = {
                bottom: { style: 'thin' },
            };
        });
    };

    addHorizontalLines(7);

    // Añadir tabla de datos
    worksheet.columns = [
        { header: 'Columna 1', key: 'col1', width: 30 },
        { header: 'Columna 2', key: 'col2', width: 30 }
    ];

    datosTabla.forEach((row, index) => {
        worksheet.addRow({
            col1: row[0],
            col2: row[1]
        });
    });

    // Estilizar celdas
    worksheet.getRow(8).font = { bold: true }; // Encabezados de las columnas
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
});


router.post('/pdfmaestros', (req, res) => {
   const { datosTabla } = req.body;

   // Crear un nuevo documento PDF en orientación horizontal
   const doc = new PDFDocument({ layout: 'landscape', margin: 10 });
   let filename = 'reporte.pdf';
   filename = encodeURIComponent(filename);

   res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
   res.setHeader('Content-type', 'application/pdf');

   doc.pipe(res);

   // Añadir encabezado e imagen
   const imagePath = path.join(__dirname, '../../../public/img/Chakana.png');
   doc.image(imagePath, 50, 20, { width: 55 });

   // Ajustar tamaño y centrar texto "REPORTE DE BONO ZONA" y "CENTROS EDUCATIVOS"
   const headerText1 = 'REPORTE DE BONO ZONA';
   const headerText2 = 'CENTROS EDUCATIVOS';
   const headerTextWidth1 = doc.widthOfString(headerText1);
   const headerTextWidth2 = doc.widthOfString(headerText2);
   const headerTextX1 = (doc.page.width - headerTextWidth1) / 2;
   const headerTextX2 = (doc.page.width - headerTextWidth2) / 2;
   const headerTextY = 30;

   // Función para agregar encabezado
   const addHeader = () => {
       doc.font('Helvetica-Bold').fontSize(10)
           .text(headerText1, headerTextX1, headerTextY)
           .moveDown()
           .text(headerText2, headerTextX2, doc.y - 10);

       doc.fontSize(5).text('ESTADO PLURINACIONAL DE', 120, 30)
           .font('Helvetica-Bold').fontSize(19).text('BOLIVIA', 117, 35)
           .font('Helvetica-Bold').fontSize(5).text('MINISTERIO DE EDUCACION', 120, 52)
           .font('Helvetica-Bold').fontSize(5).text('DIRECCION DEPARTAMENTAL DE', 115, 58)
           .font('Helvetica-Bold').fontSize(5).text('EDUCACION DE SANTA CRUZ', 119, 65);

       doc.font('Helvetica-Bold')
           .moveTo(25, 90)
           .lineTo(762, 90)
           .stroke();

       doc.font('Helvetica-Bold')
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
   const addFooterLines = () => {
       const finalYPosition = doc.page.height - 50; // Ajusta la posición Y según sea necesario
       doc.moveTo(25, finalYPosition)
           .lineTo(762, finalYPosition)
           .stroke();

       doc.moveTo(25, finalYPosition + 3)
           .lineTo(762, finalYPosition + 3)
           .stroke();
   };

   // Añadir encabezado inicial
   addHeader();

   // Añadir tabla de datos
   let yPosition = 105;
   const rowHeight = 20;
   const maxRowsPerPage = Math.floor((doc.page.height - yPosition - 50) / rowHeight);

   datosTabla.forEach((row, index) => {
       if (index > 0 && index % maxRowsPerPage === 0) {
           addFooterLines(); // Añadir líneas horizontales al final de la página antes de añadir una nueva
           doc.addPage();
           addHeader();
           yPosition = 105;
       }

       doc.text(row[0], 65, yPosition)
           .text(row[1], 170, yPosition)
           .text(row[2], 400, yPosition)
           .text(row[3], 635, yPosition);
       yPosition += rowHeight;
   });

   // Añadir líneas horizontales al final de la última página
   addFooterLines();

   doc.end();
});

router.post('/xlsmaestros', async (req, res) => {
    const { datosTabla } = req.body;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Maestros');

    // Añadir imagen
    const imagePath = path.join(__dirname, '../../../public/img/Chakana.png');
    const imageId = workbook.addImage({
        filename: imagePath,
        extension: 'png',
    });

    worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 50, height: 50 }
    });

    // Añadir encabezado
    worksheet.mergeCells('C1:F1');
    worksheet.getCell('C1').value = 'REPORTE DE BONO ZONA';
    worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C1').font = { size: 14, bold: true };

    worksheet.mergeCells('C2:F2');
    worksheet.getCell('C2').value = 'CENTROS EDUCATIVOS';
    worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C2').font = { size: 12, bold: true };

    // Añadir texto adicional del encabezado
    worksheet.mergeCells('B3:C3');
    worksheet.getCell('B3').value = 'ESTADO PLURINACIONAL DE';
    worksheet.getCell('B3').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B3').font = { size: 5 };

    worksheet.mergeCells('D3:E3');
    worksheet.getCell('D3').value = 'BOLIVIA';
    worksheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D3').font = { name: 'Arial', size: 19 };

    worksheet.mergeCells('B4:C4');
    worksheet.getCell('B4').value = 'MINISTERIO DE EDUCACION';
    worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B4').font = { size: 5 };

    worksheet.mergeCells('B5:C5');
    worksheet.getCell('B5').value = 'DIRECCION DEPARTAMENTAL DE';
    worksheet.getCell('B5').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B5').font = { size: 5 };

    worksheet.mergeCells('B6:C6');
    worksheet.getCell('B6').value = 'EDUCACION DE SANTA CRUZ';
    worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('B6').font = { size: 5 };

    // Añadir líneas horizontales
    const addHorizontalLines = (startRow) => {
        const row = worksheet.getRow(startRow);
        row.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'thin' },
            };
        });

        const nextRow = worksheet.getRow(startRow + 1);
        nextRow.eachCell((cell, colNumber) => {
            cell.border = {
                bottom: { style: 'thin' },
            };
        });
    };

    addHorizontalLines(7);

    // Añadir encabezados de la tabla
    worksheet.columns = [
        { header: 'RDA', key: 'rda', width: 30 },
        { header: 'MAESTRO_A', key: 'maestro', width: 30 },
        { header: 'CARGO', key: 'cargo', width: 30 },
        { header: 'SERVICIO_ITEM', key: 'servicio', width: 30 }
    ];

    // Añadir datos de la tabla
    datosTabla.forEach(row => {
        worksheet.addRow({
            rda: row[0],
            maestro: row[1],
            cargo: row[2],
            servicio: row[3]
        });
    });

    // Estilizar celdas
    worksheet.getRow(8).font = { bold: true }; // Encabezados de las columnas
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
});

module.exports = router 