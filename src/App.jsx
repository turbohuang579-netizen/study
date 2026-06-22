import { useState } from 'react'
import bg from './assets/IMG_0552.JPG'

function App() {
  const [tasks, setTasks] = useState([
    { name: '日语', color: '#3B82F6', done: false },
    { name: '韩语', color: '#22C55E', done: false },
    { name: '阅读', color: '#EAB308', done: false },
    { name: '健身', color: '#EF4444', done: false },
  ])

  const toggleDone = (index) => {
    const newTasks = [...tasks]
    newTasks[index].done = !newTasks[index].done
    setTasks(newTasks)
  }

  const addTask = () => {
    setTasks([
      ...tasks,
      { name: '新任务', color: '#999', done: false }
    ])
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(135deg, rgba(99,102,241,0.6), rgba(236,72,153,0.5)), url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>

      {/* 毛玻璃卡片 */}
      <div style={{
        width: '380px',
        padding: '24px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        color: '#fff'
      }}>

        <h1 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '6px'
        }}>
          Learning Tracker
        </h1>

        <p style={{
          opacity: 0.8,
          marginBottom: '20px'
        }}>
          今天已学习 0小时0分钟
        </p>

        {/* 任务列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((task, index) => (
            <div
              key={index}
              onClick={() => toggleDone(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: task.done ? 'scale(0.98)' : 'scale(1)',
                opacity: task.done ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = task.done ? 'scale(0.98)' : 'scale(1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: task.color, fontSize: '18px' }}>●</span>
                <span style={{
                  textDecoration: task.done ? 'line-through' : 'none'
                }}>
                  {task.name}
                </span>
              </div>

              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                {task.done ? 'Done' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* 按钮 */}
        <button
          onClick={addTask}
          style={{
            marginTop: '18px',
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366F1, #EC4899)',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            transition: '0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
          }}
        >
          + 新增任务
        </button>

      </div>
    </div>
  )
}

export default App