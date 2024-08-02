const fs = require('fs');
const { Document, Packer, Paragraph, TextRun } = require('docx');

// Load the document
const loadDocx = async (path) => {
    const data = fs.readFileSync(path);
    const doc = await Document.load(data);
    return doc;
};

// Change font to Arial
const changeFontToArial = (doc) => {
    doc.paragraphs.forEach(paragraph => {
        paragraph.children.forEach(run => {
            run.font = {
                name: "Arial"
            };
        });
    });
};

// Save the document
const saveDocx = async (doc, path) => {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path, buffer);
};

// Main function
(async () => {
    const docPath = "23-07 Paulo Cear Castro - RE.docx";
    const newDocPath = "23-07 Paulo Cear Castro - RE_Arial.docx";

    const doc = await loadDocx(docPath);
    changeFontToArial(doc);
    await saveDocx(doc, newDocPath);

    console.log(`Document saved as ${newDocPath}`);
})();
