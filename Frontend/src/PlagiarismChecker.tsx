import { useState } from 'react';
import {Button, Upload, message } from 'antd';
import {
  UploadOutlined,
} from '@ant-design/icons';

const PlagiarismChecker = () => {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState<string | null>(null);

  const handleFileUpload = (file: any) => {
    setFile(file);
    console.log('Uploaded file:', file);
  };

  const checkPlagiarism = async () => {
    if (!file) {
      message.warning('Please upload a document first.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/plagiarism/check', {
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,  // ✅ Correct header name
        },
        body: formData,  // ✅ Important: attach form data
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Plagiarism check result:", data);
        setPlagiarismResult(`Plagiarism detected: ${data.plagiarism_percentage}%`);
        message.success('Plagiarism check completed.');
      } else {
        message.error('Failed to check plagiarism.');
      }
    } catch (error) {
      console.error("Error in plagiarism check:", error);
      message.error('Error occurred while checking plagiarism.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Plagiarism Checker</h2>
      <Upload beforeUpload={(file) => handleFileUpload(file)} showUploadList={false}>
        <Button icon={<UploadOutlined />} size="large">
          Upload Document
        </Button>
      </Upload>
      {file && (
        <div style={{ marginTop: '12px' }}>
          <span>File: {file.name}</span>
        </div>
      )}
      <Button
        type="primary"
        size="large"
        style={{ marginTop: '20px' }}
        loading={loading}
        onClick={checkPlagiarism}
      >
        Check Plagiarism
      </Button>

      {plagiarismResult && (
        <div style={{ marginTop: '20px', fontSize: '16px' }}>
          <h3>Plagiarism Result:</h3>
          <p>{plagiarismResult}</p>
        </div>
      )}
    </div>
  );
};



export default PlagiarismChecker;









// import { useState } from 'react';
// import {Button, Upload, message } from 'antd';
// import {
//   UploadOutlined,
// } from '@ant-design/icons';
// import styled from 'styled-components';

// const PlagiarismChecker = () => {
//   const [file, setFile] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [plagiarismResult, setPlagiarismResult] = useState<string | null>(null);

//   const handleFileUpload = (file: any) => {
//     setFile(file);
//     console.log('Uploaded file:', file);
//   };

//   const checkPlagiarism = async () => {
//     if (!file) {
//       message.warning('Please upload a document first.');
//       return;
//     }
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://localhost:5000/plagiarism/check', {
//         method: 'POST',
//         headers: {
//           'x-api-key': import.meta.env.VITE_API_KEY,  // ✅ Correct header name
//         },
//         body: formData,  // ✅ Important: attach form data
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Plagiarism check result:", data);
//         setPlagiarismResult(`Plagiarism detected: ${data.plagiarism_percentage}%`);
//         message.success('Plagiarism check completed.');
//       } else {
//         message.error('Failed to check plagiarism.');
//       }
//     } catch (error) {
//       console.error("Error in plagiarism check:", error);
//       message.error('Error occurred while checking plagiarism.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PlagiarismWrapper>
//       <div className="plagiarism-checker-container">
//         <h2>🕵️‍♂️ Plagiarism Checker</h2>
//         <div className="upload-section">
//           <Upload beforeUpload={(file) => handleFileUpload(file)} showUploadList={false}>
//             <Button icon={<UploadOutlined />} size="large" className="upload-button">
//               Upload Document
//             </Button>
//           </Upload>
//           {file && (
//             <div className="file-name">
//               <span>📄 {file.name}</span>
//             </div>
//           )}
//         </div>
//         <Button
//           type="primary"
//           size="large"
//           className="check-button"
//           loading={loading}
//           onClick={checkPlagiarism}
//         >
//           🚀 Check Plagiarism
//         </Button>

//         {plagiarismResult && (
//           <div className="result-section">
//             <h3>Plagiarism Result:</h3>
//             <div className="result-badge">{plagiarismResult}</div>
//           </div>
//         )}
//       </div>
//     </PlagiarismWrapper>
//   );
// };

// export default PlagiarismChecker;

// const PlagiarismWrapper = styled.div`
// .plagiarism-checker-container {
//   padding: 30px;
//   max-width: 650px;
//   margin: 40px auto;
//   background: linear-gradient(135deg, #f9f9f9, #e6f7ff);
//   border-radius: 12px;
//   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
//   animation: fadeIn 0.6s ease-in-out;
// }

// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }

// h2 {
//   text-align: center;
//   color: #1f1f1f;
//   font-size: 2rem;
//   font-weight: bold;
//   margin-bottom: 25px;
// }

// .upload-section {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// }

// .upload-button {
//   width: 100%;
//   max-width: 280px;
//   background: #1890ff;
//   color: white;
// }

// .file-name {
//   margin-top: 12px;
//   font-weight: 500;
//   color: #333;
// }

// .check-button {
//   display: block;
//   width: 100%;
//   max-width: 280px;
//   margin: 25px auto 0;
//   background: #52c41a;
//   font-weight: 600;
// }

// .result-section {
//   margin-top: 30px;
//   text-align: center;
// }

// .result-section h3 {
//   margin-bottom: 15px;
//   font-size: 1.25rem;
//   color: #1f1f1f;
// }

// .result-badge {
//   display: inline-block;
//   background: #ff4d4f;
//   color: white;
//   padding: 18px 30px;
//   font-size: 1.6rem;
//   font-weight: bold;
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
//   animation: pulse 1.5s infinite;
// }

// @keyframes pulse {
//   0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
//   70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
//   100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
// }

// /* Responsive */
// @media (max-width: 768px) {
//   .plagiarism-checker-container {
//     padding: 20px;
//   }

//   h2 {
//     font-size: 1.7rem;
//   }

//   .upload-button,
//   .check-button {
//     width: 100%;
//   }

//   .result-badge {
//     font-size: 1.3rem;
//     padding: 12px 20px;
//   }
// }
// `;