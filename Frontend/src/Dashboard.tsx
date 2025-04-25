import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  MenuOutlined,
  RobotOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import AskPromptDrawer from './AskPromptDrawer'; // Adjust path if needed

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const dummyConfiguration = {
    ga4Property: 'your-property-id',
    Ga4Widget: {
      ga4Query: {}, // Add your GA4 query here
    },
  };

  const handleLogout = () => {
    // Perform logout logic (clear session, etc.)
    navigate('/login'); // Redirect to the signup page
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

        <Content style={{ margin: '16px' }}>
          <h1>Welcome to your dashboard 🎉</h1>
          <p>This is your secure, logged-in area.</p>
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
