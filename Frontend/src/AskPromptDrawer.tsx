// import { Button, Col, Drawer, Input, Row, Space } from 'antd';
// import { useState } from 'react';
// import { SendOutlined, AudioOutlined, PaperClipOutlined, PictureOutlined } from '@ant-design/icons';
// import AIWriter from 'react-aiwriter';
// import DOMPurify from 'dompurify';

// type AskPromptDrawerProps = {
//   open: boolean;
//   onClose: () => void;
//   configuration: {
//     ga4Property: string;
//     Ga4Widget: {
//       ga4Query: any;
//     };
//   };
// };

// const AskPromptDrawer: React.FC<AskPromptDrawerProps> = ({
//   open,
//   onClose,
//   configuration,
// }) => {
//   const [question, setQuestion] = useState('');
//   const [questionResponse, setQuestionResponse] = useState<string | undefined>();
//   const [loading, setLoading] = useState(false);
//   const [validationMessage, setValidationMessage] = useState('');

//   const property = configuration?.ga4Property;
//   const clean = DOMPurify.sanitize(questionResponse || '');

//   const askQuestion = async (question: string) => {
//     if (!question) {
//       setValidationMessage('Please enter a question.');
//       return;
//     }

//     setLoading(true);
//     setValidationMessage('');
//     setQuestionResponse(undefined);

//     try {
//       const fetchPreviewUrl = `/application/integrations/ga/widget-builder-preview/${property}`;
//       const body = {
//         property,
//         widget: {
//           ga4Query: configuration?.Ga4Widget?.ga4Query,
//           question,
//         },
//         includes: ['questionResponse'],
//       };

//       // Replace this with your real axios instance
//       const response = await fetch(fetchPreviewUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const previewResponse = await response.json();
//       const responseHtml = previewResponse?.html;

//       if (!responseHtml) {
//         setValidationMessage('No response received for the question.');
//       } else {
//         setQuestionResponse(responseHtml);
//       }
//     } catch (error) {
//       console.error('Error asking question:', error);
//       setValidationMessage('An error occurred while processing your question.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const promptSuggestions = [
//     '🔍 Search for a product',
//     '💬 Ask about product details',
//     '🎯 What’s popular right now?',
//     '🔄 Compare products',
//     '⭐ Read customer reviews',
//   ];

//   const handleClose = () => {
//     setQuestion('');
//     setQuestionResponse(undefined);
//     setValidationMessage('');
//     onClose();
//   };

//   return (
//     <Drawer
//       placement="right"
//       onClose={handleClose}
//       open={open}
//       width={500}
//       title="Ask Bot"
//     >
//       <Row gutter={[24, 0]}>
//         <Col span={24}>
          
//           <div style={{ textAlign: 'center', marginBottom: 35 }}>
//             <div style={{ marginBottom: 15,display: 'flex', justifyContent: 'center'}}>
//               <img
//                 style={{ height: 120, width: 125 }}
//                 src="/images/sparkle.png"
//                 alt="sparkle" />
//             </div>
//             <h3 style={{
//               background: 'linear-gradient(90deg, rgba(2,6,23,1) 0%, rgba(143,41,118,1) 63%, rgba(62,34,203,1) 100%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               fontWeight: '600',
//               fontSize: 22,
//             }}>
//               Get instant insights from your charts.
//             </h3>
//           </div>

//           <Space wrap style={{ marginBottom: 50, display: 'flex', justifyContent: 'center', gap: '15px' }}>
//             {promptSuggestions.map((prompt, index) => (
//               <Button style={{ fontSize: 14 }} key={index} size="small" onClick={() => {
//                 setQuestion(prompt);
//                 askQuestion(prompt);
//               }}>
//                 {prompt}
//               </Button>
//             ))}
//           </Space>

//           <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
//             <AudioOutlined style={{ fontSize: 18 }} />
//             <PaperClipOutlined style={{ fontSize: 18 }} />
//             <PictureOutlined style={{ fontSize: 18 }} />
//             <Input
//               placeholder="Ask anything..."
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               onPressEnter={() => askQuestion(question)}
//               disabled={loading}
//             />
//             <SendOutlined style={{ fontSize: 18 }} onClick={() => askQuestion(question)} />
//           </div>

//           {validationMessage && (
//             <div style={{ color: 'red', marginTop: 8 }}>{validationMessage}</div>
//           )}

//           {questionResponse && (
//             <div style={{ marginTop: 20 }}>
//               <AIWriter delay={50}>{clean}</AIWriter>
//             </div>
//           )}
//         </Col>
//       </Row>
//     </Drawer>
//   );
// };

// export default AskPromptDrawer;













// // import { Button, Col, Drawer, Input, Row, Space } from 'antd';
// // import { useState } from 'react';
// // import { SendOutlined, AudioOutlined, PaperClipOutlined, PictureOutlined } from '@ant-design/icons';
// // import AIWriter from 'react-aiwriter';
// // import DOMPurify from 'dompurify';

// // type AskPromptDrawerProps = {
// //   open: boolean;
// //   onClose: () => void;
// //   configuration: {
// //     ga4Property: string;
// //     Ga4Widget: {
// //       ga4Query: any;
// //     };
// //   };
// // };

// // const AskPromptDrawer: React.FC<AskPromptDrawerProps> = ({
// //   open,
// //   onClose,
// // }) => {
// //   const [question, setQuestion] = useState('');
// //   const [questionResponse, setQuestionResponse] = useState<string | undefined>();
// //   const [loading, setLoading] = useState(false);
// //   const [validationMessage, setValidationMessage] = useState('');

// //   const clean = DOMPurify.sanitize(questionResponse || '');

// //   const askQuestion = async (question: string) => {
// //     if (!question) {
// //       setValidationMessage('Please enter a question.');
// //       return;
// //     }
  
// //     setLoading(true);
// //     setValidationMessage('');
// //     setQuestionResponse(undefined);
  
// //     try {
// //       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
// //         method: "POST",
// //         headers: {
// //           "Authorization": "Bearer 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",
// //           "HTTP-Referer": "https://yourdomain.com", // Replace with your actual domain
// //           "X-Title": "MyChatBot", 
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           model: "deepseek/deepseek-r1:free",
// //           messages: [
// //             {
// //               role: "user",
// //               content: question,
// //             },
// //           ],
// //         }),
// //       });
  
// //       const result = await response.json();
// //       const answer = result.choices?.[0]?.message?.content;
  
// //       if (!answer) {
// //         setValidationMessage('No response received for the question.');
// //       } else {
// //         setQuestionResponse(answer);
// //       }
// //     } catch (error) {
// //       console.error('Error asking question:', error);
// //       setValidationMessage('An error occurred while processing your question.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  

// //   const promptSuggestions = [
// //     '🔍 Search for a product',
// //     '💬 Ask about product details',
// //     '🎯 What’s popular right now?',
// //     '🔄 Compare products',
// //     '⭐ Read customer reviews',
// //   ];

// //   const handleClose = () => {
// //     setQuestion('');
// //     setQuestionResponse(undefined);
// //     setValidationMessage('');
// //     onClose();
// //   };

// //   return (
// //     <Drawer
// //       placement="right"
// //       onClose={handleClose}
// //       open={open}
// //       width={500}
// //       title="Ask Bot"
// //     >
// //       <Row gutter={[24, 0]}>
// //         <Col span={24}>
          
// //           <div style={{ textAlign: 'center', marginBottom: 35 }}>
// //             <div style={{ marginBottom: 15,display: 'flex', justifyContent: 'center'}}>
// //               <img
// //                 style={{ height: 120, width: 125 }}
// //                 src="/images/sparkle.png"
// //                 alt="sparkle" />
// //             </div>
// //             <h3 style={{
// //               background: 'linear-gradient(90deg, rgba(2,6,23,1) 0%, rgba(143,41,118,1) 63%, rgba(62,34,203,1) 100%)',
// //               WebkitBackgroundClip: 'text',
// //               WebkitTextFillColor: 'transparent',
// //               fontWeight: '600',
// //               fontSize: 22,
// //             }}>
// //               Get instant insights from your charts.
// //             </h3>
// //           </div>

// //           <Space wrap style={{ marginBottom: 50, display: 'flex', justifyContent: 'center', gap: '15px' }}>
// //             {promptSuggestions.map((prompt, index) => (
// //               <Button style={{ fontSize: 14 }} key={index} size="small" onClick={() => {
// //                 setQuestion(prompt);
// //                 askQuestion(prompt);
// //               }}>
// //                 {prompt}
// //               </Button>
// //             ))}
// //           </Space>

// //           <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
// //             <AudioOutlined style={{ fontSize: 18 }} />
// //             <PaperClipOutlined style={{ fontSize: 18 }} />
// //             <PictureOutlined style={{ fontSize: 18 }} />
// //             <Input
// //               placeholder="Ask anything..."
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //               onPressEnter={() => askQuestion(question)}
// //               disabled={loading}
// //             />
// //             <SendOutlined style={{ fontSize: 18 }} onClick={() => askQuestion(question)} />
// //           </div>

// //           {validationMessage && (
// //             <div style={{ color: 'red', marginTop: 8 }}>{validationMessage}</div>
// //           )}

// //           {questionResponse && (
// //             <div style={{ marginTop: 20 }}>
// //               <AIWriter delay={50}>{clean}</AIWriter>
// //             </div>
// //           )}
// //         </Col>
// //       </Row>
// //     </Drawer>
// //   );
// // };

// // export default AskPromptDrawer;





import { Button, Col, Drawer, Input, Row, Space, Spin } from 'antd';
import { useState } from 'react';
import { SendOutlined, AudioOutlined, PaperClipOutlined, PictureOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

type AskPromptDrawerProps = {
  open: boolean;
  onClose: () => void;
  configuration: {
    ga4Property: string;
    Ga4Widget: {
      ga4Query: any;
    };
  };
};

const AskPromptDrawer: React.FC<AskPromptDrawerProps> = ({
  open,
  onClose,
}) => {
  const [question, setQuestion] = useState('');
  const [questionResponse, setQuestionResponse] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const promptSuggestions = [
    '🔍 Search for a product',
    '💬 Ask about product details',
    '🎯 What’s popular right now?',
    '🔄 Compare products',
    '⭐ Read customer reviews',
  ];

  const handleClose = () => {
    setQuestion('');
    setQuestionResponse(undefined);
    setValidationMessage('');
    onClose();
  };

  

  const askQuestion = async (userQuestion: string) => {
    if (!userQuestion) {
      setValidationMessage('Please enter a question.');
      return;
    }
  
    setLoading(true);
    setValidationMessage('');
    setQuestionResponse(undefined);
  
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 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',
          'HTTP-Referer': 'https://yourdomain.com',
          'X-Title': 'MyChatBot',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'microsoft/mai-ds-r1:free',
          messages: [
            {
              role: 'user',
              content: userQuestion,
            },
          ],
        }),
      });
  
      if (!response.ok) {
        setValidationMessage('Failed to fetch data from the API');
        throw new Error('API request failed');
      }
  
      const result = await response.json();
      console.log('API Result:', result);
  
      const answer = result?.choices?.length > 0 ? result.choices[0].message.content : null;
      if (!answer) {
        setValidationMessage('No response received for the question.');
      } else {
        setQuestionResponse(DOMPurify.sanitize(answer));
      }
    } catch (err) {
      console.error('API error:', err);
      setValidationMessage('An error occurred while processing your question.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Drawer
      placement="right"
      onClose={handleClose}
      open={open}
      width={500}
      title="Ask Bot"
    >
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <div style={{ textAlign: 'center', marginBottom: 35 }}>
            <div style={{ marginBottom: 15, display: 'flex', justifyContent: 'center' }}>
              <img
                style={{ height: 120, width: 125 }}
                src="/images/sparkle.png"
                alt="sparkle"
              />
            </div>
            <h3
              style={{
                background: 'linear-gradient(90deg, rgba(2,6,23,1) 0%, rgba(143,41,118,1) 63%, rgba(62,34,203,1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                fontSize: 22,
              }}
            >
              Get instant insights from your charts.
            </h3>
          </div>

          <Space wrap style={{ marginBottom: 50, display: 'flex', justifyContent: 'center', gap: '15px' }}>
            {promptSuggestions.map((prompt, index) => (
              <Button
                key={index}
                style={{ fontSize: 14 }}
                size="small"
                onClick={() => {
                  setQuestion(prompt);
                  askQuestion(prompt);
                }}
              >
                {prompt}
              </Button>
            ))}
          </Space>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <AudioOutlined style={{ fontSize: 18 }} />
            <PaperClipOutlined style={{ fontSize: 18 }} />
            <PictureOutlined style={{ fontSize: 18 }} />
            <Input
              placeholder="Ask anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onPressEnter={() => askQuestion(question)}
              disabled={loading}
            />
            <SendOutlined
              style={{ fontSize: 18, cursor: 'pointer' }}
              onClick={() => askQuestion(question)}
            />
          </div>

          {validationMessage && (
            <div style={{ color: 'red', marginTop: 8 }}>{validationMessage}</div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Spin size="large" />
            </div>
          )}

          {questionResponse && !loading && (
            <div
              style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: questionResponse }}
            />
          )}
        </Col>
      </Row>
    </Drawer>
  );
};

export default AskPromptDrawer;

