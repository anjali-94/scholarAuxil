import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, RobotOutlined, UploadOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';

const { Sider } = Layout;

type NavigationSiderProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setShowBot: (show: boolean) => void;
  setShowPlagiarismChecker: (show: boolean) => void;
  setShowRepository: (show: boolean) => void;
  handleLogout: () => void;
  setShowBibciteGenerator: (show: boolean) => void;
};

const NavigationSider: React.FC<NavigationSiderProps> = ({
  collapsed,
  setCollapsed,
  setShowBot,
  setShowPlagiarismChecker,
  setShowRepository,
  handleLogout,
  setShowBibciteGenerator,
}) => {
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div style={{ height: 32, margin: 16, color: '#fff', textAlign: 'center' }}>Dashboard</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item
          key="1"
          icon={<DashboardOutlined />}
          onClick={() => {
            setShowPlagiarismChecker(false);
            setShowBot(false);
            setShowRepository(false);
            setShowBibciteGenerator(false);

          }}
        >
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<RobotOutlined />} onClick={() => setShowBot(true)}>
          Ask Bot
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<UploadOutlined />}
          onClick={() => {
            setShowPlagiarismChecker(true);
            setShowRepository(false);
            setShowBot(false);
            setShowBibciteGenerator(false);

          }}
        >
          Plagiarism Checker
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={<PlusOutlined />}
          onClick={() => {
            setShowBot(false);
            setShowPlagiarismChecker(false);
            setShowRepository(false);
            setShowBibciteGenerator(true);
          }}
        >
          Citation Generator
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<PlusOutlined />}
          onClick={() => {
            setShowBot(false);
            setShowPlagiarismChecker(false);
            setShowRepository(true);
            setShowBibciteGenerator(false);

          }}
        >
          Repository
        </Menu.Item>
        <Menu.Item key="6" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>

      </Menu>
    </Sider>
  );
};

export default NavigationSider;
