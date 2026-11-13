import jsPDF from 'jspdf';

interface PDFOptions {
  type: string;
  title: string;
  data: any;
  formData?: any;
  farmerProfile?: any;
}

export function generateAdvisoryPDF({ type, title, data, formData, farmerProfile }: PDFOptions) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 15;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addText = (text: string, fontSize = 10, isBold = false, indent = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      if (y > 275) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin + indent, y);
      y += fontSize * 0.45;
    });
    y += 2;
  };

  const addBullet = (text: string, indent = 5) => {
    if (y > 275) { doc.addPage(); y = margin; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(`• ${text}`, contentWidth - indent);
    lines.forEach((line: string) => {
      doc.text(line, margin + indent, y);
      y += 4.5;
    });
  };

  const addSection = (sectionTitle: string) => {
    y += 3;
    if (y > 275) { doc.addPage(); y = margin; }
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y - 4, contentWidth, 7, 'F');
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text(sectionTitle, margin + 2, y);
    doc.setTextColor(0, 0, 0);
    y += 7;
  };

  const addHRule = () => {
    if (y > 275) { doc.addPage(); y = margin; }
    doc.setDrawColor(220, 252, 231);
    doc.line(margin, y, margin + contentWidth, y);
    y += 4;
  };

  // Header
  doc.setFillColor(21, 128, 61);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('KrishiSeva AI — Agricultural Advisory Report', margin, 13);
  doc.setTextColor(0, 0, 0);
  y = 28;

  addText(title, 14, true);
  addText(`Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 9);
  addHRule();

  // Disclaimer
  doc.setFillColor(255, 251, 235);
  doc.rect(margin, y - 2, contentWidth, 12, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 83, 0);
  doc.setFont('helvetica', 'italic');
  const disclaimerText = 'Advisory Notice: This AI-generated report provides decision-support guidance. It does not replace professional soil laboratory tests or certified agricultural officer advice. Consult your local KVK or agricultural extension office for field-specific guidance.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 4);
  disclaimerLines.forEach((line: string) => { doc.text(line, margin + 2, y); y += 4; });
  doc.setTextColor(0, 0, 0);
  y += 4;
  addHRule();

  // Render based on type
  if (type === 'crop-recommendation' && data?.recommendations) {
    if (formData) {
      addSection('Farm Information Provided');
      addText(`State: ${formData.state || 'N/A'}, District: ${formData.district || 'N/A'}`, 9.5);
      addText(`Soil Type: ${formData.soilType || 'N/A'} | Season: ${formData.season || 'N/A'}`, 9.5);
      addText(`Land Area: ${formData.landArea || 'N/A'} ${formData.landUnit || ''}`, 9.5);
      addText(`Irrigation: ${formData.irrigationType || 'N/A'} | Water Availability: ${formData.waterAvailability || 'N/A'}`, 9.5);
    }

    addSection('AI Analysis Summary');
    addText(data.summary || '', 9.5);

    if (data.dataLimitations?.length > 0) {
      addSection('Data Limitations Noted');
      data.dataLimitations.forEach((l: string) => addBullet(l));
    }

    addSection('Crop Recommendations');
    data.recommendations?.forEach((crop: any, idx: number) => {
      y += 2;
      addText(`${idx + 1}. ${crop.cropName} — Suitability: ${crop.suitabilityScore}/100`, 11, true);
      addText(crop.suitabilityExplanation, 9.5, false, 3);
      addText(`Soil: ${crop.soilCompatibility}`, 9, false, 3);
      addText(`Water Need: ${crop.waterRequirement} | Duration: ${crop.growingDuration}`, 9, false, 3);
      addText(`Planting Period: ${crop.plantingPeriod}`, 9, false, 3);
      if (crop.majorRisks?.length > 0) {
        addText('Risks:', 9, true, 3);
        crop.majorRisks.forEach((r: string) => addBullet(r, 8));
      }
      y += 2;
    });
  } else if (type === 'crop-advisory' && data?.overview) {
    addSection('Crop Overview');
    addText(data.overview, 9.5);
    const sections = [
      ['Land Preparation', data.landPreparation],
      ['Seed Selection', data.seedSelection],
      ['Sowing Guidance', data.sowingGuidance],
      ['Irrigation', data.irrigation],
      ['Nutrient Management', data.nutrientManagement],
      ['Pest Management', data.pestManagement],
      ['Disease Prevention', data.diseasePrevention],
      ['Harvesting', data.harvesting],
      ['Storage', data.storage],
      ['Important Precautions', data.precautions],
    ];
    sections.forEach(([title, items]) => {
      if (items?.length) {
        addSection(title as string);
        (items as string[]).forEach(item => addBullet(item));
      }
    });
  } else if (type === 'disease-detection' && data?.observations) {
    addSection('AI Visual Observations');
    data.observations?.forEach((o: string) => addBullet(o));
    addSection('Possible Conditions Identified');
    data.possibleConditions?.forEach((c: any) => {
      addText(`${c.name} (Likelihood: ${c.likelihood})`, 10, true, 2);
      addText(c.reason, 9.5, false, 4);
    });
    if (data.alternativeCauses?.length) {
      addSection('Alternative (Non-Disease) Causes');
      data.alternativeCauses?.forEach((c: string) => addBullet(c));
    }
    addSection('Recommended Actions');
    data.recommendedActions?.forEach((a: string) => addBullet(a));
    addSection('Preventive Measures');
    data.preventiveMeasures?.forEach((p: string) => addBullet(p));
    if (data.expertConsultationRecommended) {
      y += 3;
      addText('⚠ Expert consultation with an agricultural officer is strongly recommended before any chemical treatment.', 9.5, true);
    }
  } else {
    // Generic JSON
    addSection('Advisory Data');
    addText(JSON.stringify(data, null, 2).slice(0, 1000), 8);
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(150);
    doc.text(`KrishiSeva AI Agricultural Advisory | Page ${i} of ${pageCount}`, margin, 290);
    doc.text('This report is for decision-support purposes only.', margin, 294);
    doc.setTextColor(0, 0, 0);
  }

  const fileName = `KrishiSeva-${type}-${Date.now()}.pdf`;
  doc.save(fileName);
}
