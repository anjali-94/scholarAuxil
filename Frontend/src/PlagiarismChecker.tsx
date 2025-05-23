// import { useState } from 'react';
// import {Button, Upload, message } from 'antd';
// import {
//   UploadOutlined,
// } from '@ant-design/icons';

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
//     <div style={{ padding: '20px' }}>
//       <h2>Plagiarism Checker</h2>
//       <Upload beforeUpload={(file) => handleFileUpload(file)} showUploadList={false}>
//         <Button icon={<UploadOutlined />} size="large">
//           Upload Document
//         </Button>
//       </Upload>
//       {file && (
//         <div style={{ marginTop: '12px' }}>
//           <span>File: {file.name}</span>
//         </div>
//       )}
//       <Button
//         type="primary"
//         size="large"
//         style={{ marginTop: '20px' }}
//         loading={loading}
//         onClick={checkPlagiarism}
//       >
//         Check Plagiarism
//       </Button>

//       {plagiarismResult && (
//         <div style={{ marginTop: '20px', fontSize: '16px' }}>
//           <h3>Plagiarism Result:</h3>
//           <p>{plagiarismResult}</p>
//         </div>
//       )}
//     </div>
//   );
// };



// export default PlagiarismChecker;






// import { useState } from 'react';
// import { Button, Upload, message, Card, Typography } from 'antd';
// import { UploadOutlined, FileSearchOutlined } from '@ant-design/icons';
// import { motion } from 'framer-motion';

// const { Title, Paragraph } = Typography;

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
//           'x-api-key': import.meta.env.VITE_API_KEY,
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
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
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       style={{
//         maxWidth: '600px',
//         margin: '40px auto',
//         padding: '30px',
//         backgroundColor: '#fff',
//         borderRadius: '16px',
//         boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
//       }}
//     >
//       <Title level={2} style={{ textAlign: 'center' }}>
//         <FileSearchOutlined /> Plagiarism Checker
//       </Title>

//       <Paragraph type="secondary" style={{ textAlign: 'center' }}>
//         Upload your document to check for plagiarism. Supported formats: .docx, .pdf, .txt.
//       </Paragraph>

//       <Upload
//         beforeUpload={(file) => {
//           handleFileUpload(file);
//           return false;
//         }}
//         showUploadList={false}
//         style={{ width: '100%' }}
//       >
//         <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//           <Button
//             icon={<UploadOutlined />}
//             size="large"
//             block
//             style={{ marginTop: '20px' }}
//           >
//             Upload Document
//           </Button>
//         </motion.div>
//       </Upload>

//       {file && (
//         <Paragraph style={{ marginTop: '12px' }}>
//           <strong>Selected File:</strong> {file.name}
//         </Paragraph>
//       )}

//       <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//         <Button
//           type="primary"
//           size="large"
//           block
//           loading={loading}
//           onClick={checkPlagiarism}
//           style={{ marginTop: '20px' }}
//         >
//           Check Plagiarism
//         </Button>
//       </motion.div>

//       {plagiarismResult && (
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <Card
//             title="Plagiarism Result"
//             style={{ marginTop: '30px', borderRadius: '12px' }}
//             bordered={false}
//             headStyle={{ backgroundColor: '#f5f5f5', borderRadius: '12px 12px 0 0' }}
//           >
//             <Paragraph>{plagiarismResult}</Paragraph>
//           </Card>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default PlagiarismChecker;














import { useState } from 'react';
import { Button, Upload, message, Card, Typography, Spin } from 'antd';
import { UploadOutlined, FileSearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

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

    // Clear previous result and start loading
    setPlagiarismResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/plagiarism/check', {
        method: 'POST',
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}
    >
      <Title level={2} style={{ textAlign: 'center' }}>
        <FileSearchOutlined /> Plagiarism Checker
      </Title>

      <Paragraph type="secondary" style={{ textAlign: 'center' }}>
        Upload your document to check for plagiarism. Supported formats: .docx, .pdf, .txt.
      </Paragraph>

      <Upload
        beforeUpload={(file) => {
          handleFileUpload(file);
          return false;
        }}
        showUploadList={false}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button icon={<UploadOutlined />} size="large" block style={{ marginTop: '20px' }}>
            Upload Document
          </Button>
        </motion.div>
      </Upload>

      {file && (
        <Paragraph style={{ marginTop: '12px' }}>
          <strong>Selected File:</strong> {file.name}
        </Paragraph>
      )}

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="primary"
          size="large"
          block
          onClick={checkPlagiarism}
          style={{ marginTop: '20px' }}
        >
          Check Plagiarism
        </Button>
      </motion.div>

      {/* Show loader while checking */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Spin size="large" tip="Checking for plagiarism..." />
        </div>
      )}

      {/* Show result only after loading is false and result exists */}
      {!loading && plagiarismResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            title="Plagiarism Result"
            style={{ marginTop: '30px', borderRadius: '12px'}}
            bordered={false}
            headStyle={{ backgroundColor: '#f5f5f5', borderRadius: '12px 12px 0 0',  fontSize: '22px', fontWeight: 600}}
          >
            <Paragraph style={{ fontSize: '20px', fontWeight: 500 }}>{plagiarismResult}</Paragraph>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlagiarismChecker;

