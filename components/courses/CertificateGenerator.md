import jsPDF from 'jspdf';

/**
 * CertificateGenerator Component
 * Description: A React component that generates a downloadable PDF certificate for users who complete a course.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["Certificate Generator", "React Component", "PDF Generation", "jsPDF"]
 */

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
    <div className="text-center p-6 bg-blue-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Your Certificate</h2>
      <button
        onClick={generateCertificate}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="Download your certificate as a PDF"
      >
        Download PDF Certificate
      </button>
    </div>
  );
};

// Example Usage
// <CertificateGenerator
//   userName="John Doe"
//   courseName="React Basics"
//   date="2025-04-29"
// />;