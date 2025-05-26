import React, { useEffect } from 'react';
import { Input, DatePicker, Button, Checkbox, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, SortAscendingOutlined, ClearOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './CustomTodo.css';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';


type CustomTask = {
  text: string;
  start: string;
  deadline: string;
  completed: boolean;
  alerted?: boolean;
};

type CustomTodoProps = {
  customTask: string;
  setCustomTask: (val: string) => void;
  customDate: moment.Moment | null;
  setCustomDate: (date: moment.Moment | null) => void;
  customTasks: CustomTask[];
  setCustomTasks: (tasks: CustomTask[]) => void;
};

const CustomTodo: React.FC<CustomTodoProps> = ({
  customTask,
  setCustomTask,
  customTasks,
  setCustomTasks,
}) => {
  const [startDateTime, setStartDateTime] = React.useState<moment.Moment | null>(null);
  const [deadlineDateTime, setDeadlineDateTime] = React.useState<moment.Moment | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();

      const updatedTasks = customTasks.map((task) => {
        const deadlineMoment = moment(task.deadline);
        if (!task.completed && !task.alerted && now.isAfter(deadlineMoment)) {
          message.warning(`⚠️ Task "${task.text}" has passed its deadline!`, 20);

          return { ...task, alerted: true };
        }
        return task;
      });

      setCustomTasks(updatedTasks);
    }, 60000); 

    return () => clearInterval(interval);
  }, [customTasks, setCustomTasks]);

  const handleAddCustomTask = async () => {
    if (!customTask || !startDateTime || !deadlineDateTime) {
      message.warning('Please enter task, start time, and deadline.');
      return;
    }

    const newTask: CustomTask = {
      text: customTask,
      start: startDateTime.toISOString(),
      deadline: deadlineDateTime.toISOString(),
      completed: false,
    };

    const updatedTasks = [...customTasks, newTask];
    setCustomTasks(updatedTasks);
    setCustomTask('');
    setStartDateTime(null);
    setDeadlineDateTime(null);

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { customTasks: updatedTasks }, { merge: true });
    }
  };

  const handleCustomTaskToggle = async (index: number) => {
    const updatedTasks = customTasks.map((task, idx) =>
      idx === index ? { ...task, completed: !task.completed } : task
    );
    setCustomTasks(updatedTasks);

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { customTasks: updatedTasks }, { merge: true });
    }
  };

  const handleDeleteTask = async (index: number) => {
    const updatedTasks = customTasks.filter((_, idx) => idx !== index);
    setCustomTasks(updatedTasks);

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { customTasks: updatedTasks }, { merge: true });
    }
  };

  const handleClearCompleted = async () => {
    const remainingTasks = customTasks.filter((task) => !task.completed);
    setCustomTasks(remainingTasks);

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { customTasks: remainingTasks }, { merge: true });
    }
  };

  const handleSortByDeadline = () => {
    const sorted = [...customTasks].sort((a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf());
    setCustomTasks(sorted);
  };

  return (
    <section style={{ background: '#f9fafb', padding: '32px', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', color: '#2563eb', fontWeight: 700, fontSize: '28px', marginBottom: '24px' }}>
        Custom Task Manager
      </h2>

      <Input
        placeholder="Task description"
        value={customTask}
        onChange={(e) => setCustomTask(e.target.value)}
        style={{ width: '100%', marginBottom: '16px', padding: '12px', fontSize: '16px' }}
      />

      <DatePicker
        showTime
        placeholder="Start Date & Time"
        value={startDateTime}
        onChange={setStartDateTime}
        style={{ width: '100%', marginBottom: '16px' }}
      />

      <DatePicker
        showTime
        placeholder="Deadline Date & Time"
        value={deadlineDateTime}
        onChange={setDeadlineDateTime}
        style={{ width: '100%', marginBottom: '16px' }}
      />

      <Button icon={<PlusOutlined />} type="primary" block onClick={handleAddCustomTask} style={{ marginBottom: '20px' }}>
        Add Task
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Button icon={<SortAscendingOutlined />} onClick={handleSortByDeadline}>
          Sort by Deadline
        </Button>
        <Button danger icon={<ClearOutlined />} onClick={handleClearCompleted}>
          Clear Completed
        </Button>
      </div>

      <TransitionGroup>
        {customTasks.map((task, index) => (
          <CSSTransition key={index} timeout={300} classNames="fade">
            <div
              style={{
                backgroundColor: task.completed ? '#e0f7fa' : '#ffffff',
                padding: '12px 16px',
                marginBottom: '10px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ccc',
              }}
            >
              <div style={{ flex: 1 }}>
                <Checkbox checked={task.completed} onChange={() => handleCustomTaskToggle(index)}>
                  <strong>{task.text}</strong>
                  <br />
                  <small>Start: {moment(task.start).format('MMM D, YYYY h:mm A')}</small>
                  <br />
                  <small>Deadline: {moment(task.deadline).format('MMM D, YYYY h:mm A')}</small>
                </Checkbox>
              </div>
              <Popconfirm
                title="Delete this task?"
                onConfirm={() => handleDeleteTask(index)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default CustomTodo;

















