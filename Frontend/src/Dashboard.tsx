
import React, { useState } from 'react';
import { Layout } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import AskPromptDrawer from './AskPromptDrawer';
import NavigationSider from './DashboardWrapper/NavigationSider';
import HeaderBar from './DashboardWrapper/HeaderBar';
import UploadSection, { Citation } from './DashboardWrapper/UploadSection';
import ResearchProgress from './DashboardWrapper/ResearchProgress';
import CustomTodo from './DashboardWrapper/CustomTodo';
import Repository from './DashboardWrapper/Repository';
import PlagiarismChecker from './PlagiarismChecker';


const { Content } = Layout;

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showPlagiarismChecker, setShowPlagiarismChecker] = useState(false);
  const [showRepository, setShowRepository] = useState(false);
  const [citations, setCitations] =

    useState<Citation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
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
  const [customTasks, setCustomTasks] = useState<
    { text: string; date: string; completed: boolean }[]
  >([]);

  const handleLogout = () => navigate('/LandingPage');

  const handleTaskToggle = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleAddTask = (text: string) => {
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ]);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavigationSider
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setShowBot={setShowBot}
        setShowPlagiarismChecker={setShowPlagiarismChecker}
        setShowRepository={setShowRepository}
        handleLogout={handleLogout}
      />

      <Layout>
        <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} logout={handleLogout} />

        <Content style={{ margin: '24px' }}>
          <div
            style={{
              background: '#ffffff',
              padding: 'clamp(24px, 5vw, 48px) clamp(16px, 5vw, 32px)',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <h1
              style={{
                textAlign: 'center',
                color: '#2563eb',
                fontWeight: 800,
                fontSize: 'clamp(24px, 5vw, 40px)',
                marginBottom: 'clamp(20px, 4vw, 40px)',
              }}
            >
              Research Dashboard
            </h1>

            {showRepository ? (
              <Repository />
            ) : showPlagiarismChecker ? (
              <PlagiarismChecker />
            ) : (
              <>
                <UploadSection
                  citations={citations}
                  setCitations={setCitations}
                />

                {/* ⇣ NEW props wired in here ⇣ */}
                <ResearchProgress
                  tasks={tasks}
                  handleTaskToggle={handleTaskToggle}
                  handleAddTask={handleAddTask}
                />

                <CustomTodo
                  customTask={customTask}
                  setCustomTask={setCustomTask}
                  customDate={customDate}
                  setCustomDate={setCustomDate}
                  customTasks={customTasks}
                  setCustomTasks={setCustomTasks}
                />
              </>
            )}
          </div>
        </Content>
      </Layout>

      <AskPromptDrawer
        open={showBot}
        onClose={() => setShowBot(false)}
        configuration={{ ga4Property: 'your-property-id', Ga4Widget: { ga4Query: {} } }}
      />
    </Layout>
  );
};

export default Dashboard;




