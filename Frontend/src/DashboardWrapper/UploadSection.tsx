import React, { useState } from 'react';
import { Upload, Button, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export type Citation = {
  apa: string;
  chicago: string;
};

type UploadSectionProps = {
  citations: Citation[];
  setCitations: (citations: Citation[]) => void;
};

const UploadSection: React.FC<UploadSectionProps> = ({ citations, setCitations }) => {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [loadingCitations, setLoadingCitations] = useState(false);

  const handleExtractCitations = async () => {
    if (!uploadedFile) {
      message.warning('Please upload a document first.');
      return;
    }
    setLoadingCitations(true);
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch('http://localhost:5000/upload/pdf', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setCitations(data.citations.filter((c: Citation) => c.apa.trim().length > 10));
        message.success('Citations extracted successfully!');
      } else {
        message.error('Failed to extract citations.');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong while extracting citations.');
    } finally {
      setLoadingCitations(false);
    }
  };

  return (
    <section style={{ marginBottom: 'clamp(24px, 5vw, 48px)' }}>
      <h2
        style={{
          textAlign: 'center',
          color: '#2563eb',
          fontWeight: 700,
          fontSize: 'clamp(20px, 4vw, 28px)',
          marginBottom: 'clamp(16px, 3vw, 24px)',
        }}
      >
        Upload Document
      </h2>

      <label
        style={{
          display: 'block',
          marginBottom: '12px',
          fontWeight: 600,
          fontSize: 'clamp(14px, 2vw, 16px)',
          color: '#374151',
        }}
      >
        Select a document (PDF, Word, etc.):
      </label>

      <Upload
        beforeUpload={(file) => {
          setUploadedFile(file);
          return false;
        }}
        showUploadList={false}
      >
        <Button
          icon={<UploadOutlined />}
          size="large"
          style={{
            padding: 'clamp(12px, 3vw, 18px)',
            borderRadius: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          Click to Upload
        </Button>
      </Upload>
      {uploadedFile && (
        <div
          style={{
            marginTop: '12px',
            fontWeight: 600,
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: '#2563eb',
            textAlign: 'center',
            wordBreak: 'break-word',
          }}
        >
          Selected File: {uploadedFile.name}
        </div>
      )}

      <Button type="primary" size="large" block style={{ marginTop: '16px' }} onClick={handleExtractCitations}>
        Extract Citations
      </Button>

      <Spin style={{ marginTop: 30 }} spinning={loadingCitations} tip="Extracting citations...">
        {citations.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700 }}>Citations</h2>
            {citations.map((citation, index) => (
              <div key={index} style={{ marginBottom: '16px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <p>
                  <strong>APA:</strong> {citation.apa}
                </p>
                <p>
                  <strong>Chicago:</strong> {citation.chicago}
                </p>
              </div>
            ))}
          </div>
        )}
      </Spin>
    </section>
  );
};

export default UploadSection;
