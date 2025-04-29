/**
 * SMTPDiagram Component
 * Description: A React component that visually represents the SMTP communication flow using a sequence diagram and step-by-step highlights.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["SMTP Diagram", "React Component", "Protocol Visualization", "SEO", "Accessibility"]
 */

export const SMTPDiagram = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-bold mb-4" aria-label="SMTP Communication Flow">
      SMTP Communication Flow
    </h3>
    <img
      src="/assets/images/smtp-flow.svg"
      alt="SMTP protocol sequence diagram showing the communication flow between client and server"
      className="w-full"
    />
    <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
      <div
        className="text-center p-2 bg-blue-50 rounded"
        aria-label="Step 1: HELO - Initiate communication"
      >
        1. HELO
      </div>
      <div
        className="text-center p-2 bg-green-50 rounded"
        aria-label="Step 2: MAIL FROM - Specify sender"
      >
        2. MAIL FROM
      </div>
      <div
        className="text-center p-2 bg-yellow-50 rounded"
        aria-label="Step 3: RCPT TO - Specify recipient"
      >
        3. RCPT TO
      </div>
      <div
        className="text-center p-2 bg-purple-50 rounded"
        aria-label="Step 4: DATA - Send email content"
      >
        4. DATA
      </div>
    </div>
  </div>
);

// Example Usage
// <SMTPDiagram />