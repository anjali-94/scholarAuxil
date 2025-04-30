import React, { useState } from 'react';
import { Layout, Menu, Button, Upload, Input, Checkbox, DatePicker, message } from 'antd';
import {
  MenuOutlined,
  RobotOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UploadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AskPromptDrawer from './AskPromptDrawer';
import moment from 'moment';

const { Header, Sider, Content } = Layout;

type Citation = {
  apa: string;
  chicago: string;
};

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Select Research Topic', completed: false },
    { id: 2, text: 'Complete Literature Review', completed: false },
    { id: 3, text: 'Define Methodology', completed: false },
    { id: 4, text: 'Conduct Experiments', completed: false },
    { id: 5, text: 'Analyze Results', completed: false },
    { id: 6, text: 'Write Paper Draft', completed: false },
    { id: 7, text: 'Finalize and Submit Paper', completed: false },
  ]);
  const [customTask, setCustomTask] = useState('');
  const [customDate, setCustomDate] = useState<moment.Moment | null>(null);
  const [customTasks, setCustomTasks] = useState<{ text: string; date: string; completed: boolean }[]>([]);

  const navigate = useNavigate();

  const dummyConfiguration = {
    ga4Property: 'your-property-id',
    Ga4Widget: {
      ga4Query: {},
    },
  };

  const handleLogout = () => {
    navigate('/LandingPage');
  };

  const handleExtractCitations = async () => {
    if (!uploadedFile) {
      message.warning('Please upload a document first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', uploadedFile);
  
    try {
      const response = await fetch('http://localhost:5000/upload/pdf', {  // Update URL to your backend
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Extracted Citations:', data.citations); 
        setCitations(data.citations.filter(c => c.apa.trim().length > 10));
        message.success('Citations extracted successfully!');
      } else {
        message.error('Failed to extract citations.');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong while extracting citations.');
    }
  };
  

  const handleTaskToggle = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleCustomTaskToggle = (index: number) => {
    setCustomTasks((prev) =>
      prev.map((task, idx) => (idx === index ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleAddCustomTask = () => {
    if (!customTask || !customDate) {
      message.warning('Please fill in both task and deadline.');
      return;
    }
    setCustomTasks((prev) => [
      ...prev,
      { text: customTask, date: customDate.format('YYYY-MM-DD'), completed: false },
    ]);
    setCustomTask('');
    setCustomDate(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, color: '#fff', textAlign: 'center' }}>
          Dashboard
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>Home</Menu.Item>
          <Menu.Item key="2" icon={<RobotOutlined />} onClick={() => setShowBot(true)}>
            Ask Bot
          </Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Button type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} />
        </Header>

        <Content style={{ margin: '24px' }}>
  <div style={{
    background: '#ffffff',
    padding: '48px 32px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    maxWidth: '1200px',
    margin: '0 auto'
  }}>
    {/* Dashboard Title */}
    <h1 style={{
      textAlign: 'center',
      color: '#2563eb',
      fontWeight: 800,
      fontSize: '40px',
      marginBottom: '40px',
      letterSpacing: '0.5px'
    }}>
      Research Dashboard
    </h1>

    {/* Upload Section */}
    <section style={{ marginBottom: '64px' }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2563eb',
        fontWeight: 700,
        fontSize: '28px',
        marginBottom: '24px'
      }}>
        Upload Document
      </h2>

      <label style={{
        display: 'block',
        marginBottom: '12px',
        fontWeight: 600,
        fontSize: '16px',
        color: '#374151'
      }}>
        Select a document (PDF, Word, etc.):
      </label>

      <Upload
  beforeUpload={(file) => {
    setUploadedFile(file);
    console.log('Uploaded File:', file);
    return false;
  }}
  showUploadList={false}
>
  <Button icon={<UploadOutlined />} size="large" 
    style={{
      padding: '18px',
      borderRadius: '10px',
      textAlign: 'center',
      cursor: 'pointer',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
    }}
  >
    Click to Upload
  </Button>
</Upload>

{/* Show uploaded file name */}
{uploadedFile && (
  <div style={{ marginTop: '12px', fontWeight: 600, fontSize: '16px', color: '#2563eb', textAlign: 'center' }}>
    Selected File: {uploadedFile.name}
  </div>
)}


      <Button
        type="primary"
        size="large"
        block
        style={{ marginTop: '16px' }}
        onClick={handleExtractCitations}
      >
        Extract Citations
      </Button>

      {citations.length > 0 && (
  <div className="mt-4">
    <h2 className="text-lg font-bold mb-2">Citations</h2>
    {citations.map((citation, index) => (
      <div key={index} className="mb-4 p-2 border rounded">
        <p><strong>APA:</strong> {citation.apa}</p>
        <p><strong>Chicago:</strong> {citation.chicago}</p>
      </div>
    ))}
  </div>
)}
    </section>

    {/* Research Paper Progress */}
    <section style={{
      marginBottom: '64px',
      background: '#f9fafb',
      padding: '32px',
      borderRadius: '12px'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2563eb',
        fontWeight: 700,
        fontSize: '28px',
        marginBottom: '24px'
      }}>
        Research Paper Progress
      </h2>

      {tasks.map((task) => (
        <div key={task.id} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <Checkbox
            checked={task.completed}
            onChange={() => handleTaskToggle(task.id)}
            style={{ transform: 'scale(1.4)', marginRight: '16px' }}
          />
          <span style={{
            fontSize: '18px',
            fontWeight: 600,
            color: task.completed ? '#9ca3af' : '#1f2937',
            textDecoration: task.completed ? 'line-through' : 'none'
          }}>
            {task.text}
          </span>
        </div>
      ))}
    </section>

    {/* Custom To-Do List */}
    <section style={{
      background: '#f9fafb',
      padding: '32px',
      borderRadius: '12px'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2563eb',
        fontWeight: 700,
        fontSize: '28px',
        marginBottom: '24px'
      }}>
        Add Your Own Tasks
      </h2>

      <Input
        placeholder="Task description"
        value={customTask}
        onChange={(e) => setCustomTask(e.target.value)}
        style={{
          marginBottom: '16px',
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px'
        }}
      />
      <DatePicker
        style={{
          width: '100%',
          marginBottom: '20px'
        }}
        value={customDate}
        onChange={(date) => setCustomDate(date)}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        block
        style={{ marginBottom: '32px' }}
        onClick={handleAddCustomTask}
      >
        Add Task
      </Button>

      <div>
        {customTasks.map((task, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <Checkbox
              checked={task.completed}
              onChange={() => handleCustomTaskToggle(idx)}
              style={{ transform: 'scale(1.4)', marginRight: '16px' }}
            />
            <span style={{
              fontSize: '18px',
              fontWeight: 600,
              color: task.completed ? '#9ca3af' : '#1f2937',
              textDecoration: task.completed ? 'line-through' : 'none'
            }}>
              {task.text}
              <span style={{
                fontSize: '14px',
                color: '#6b7280',
                marginLeft: '8px'
              }}>
                [Deadline: {task.date}]
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  </div>
</Content>

      </Layout>

      {/* Ask Bot Drawer */}
      <AskPromptDrawer
        open={showBot}
        onClose={() => setShowBot(false)}
        configuration={dummyConfiguration}
      />
    </Layout>
  );
};

export default Dashboard;


























