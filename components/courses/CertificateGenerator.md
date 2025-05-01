# CertificateGenerator Component

import jsPDF from 'jspdf';

## Description

A React component that generates a downloadable PDF certificate for users who complete a course.

## Metadata

- **Author**: Your Name
- **Last Updated**: 2025-04-29
- **Tags**:
  - Certificate Generator
  - React Component
  - PDF Generation
  - jsPDF

export const CertificateGenerator = ({ userName, courseName, date }) => {
  const generateCertificate = () => {
    const doc = new jsPDF();

    // Certificate design
    doc.setFontSize(22);
    doc.text('Certificate of Completion', 105, 40, null, null, 'center');

    doc.setFontSize(16);
    doc.text(`Awarded to ${userName}`, 105, 60, null, null, 'center');
    doc.text(`For successfully completing ${courseName}`, 105, 75, null, null, 'center');
    doc.text(`Date: ${date}`, 105, 90, null, null, 'center');

    // Border
    doc.setLineWidth(1.5);
    doc.rect(20, 20, 170, 120);

    // Save the PDF
    doc.save(`${userName}-${courseName}-certificate.pdf`);
  };

  return (
    <div>
      ## Generate Your Certificate

      A button to download your PDF certificate.

      **Actions**:
      - Click to generate and download PDF
      - Customized for each user's course completion
    </div>
  );
};

## Usage

The component renders a button to generate and download a PDF certificate.

- Requires `userName`
- Requires `courseName`
- Requires `date`

## Example

    <CertificateGenerator
      userName="John Doe"
      courseName="React Basics"
      date="2025-04-29"
    />