import { useState, useRef, useEffect } from 'react'
import bg from './assets/IMG_0552.JPG'
import Dashboard from './Dashboard'

const STORAGE_KEY = 'learning_tracker_v4'

function App() {
  const [showDash, setShowDash] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const intervalRef = useRef(null)

  // =========================
  // 💾 初始化（不丢数据）
  // =========================
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    return saved
      ? JSON.parse(saved)
      : [
          { name: '日语', color: '#3B82F6', time: 0, done: false, sessions: [] },
          { name: '韩语', color: '#22C55E', time: 0, done: false, sessions: [] },
          { name: '阅读', color: '#EAB308', time: 0, done: false, sessions: [] },
          { name: '健身', color: '#EF4444', time: 0, done: false, sessions: [] }
        ]
  })

  // =========================
  // 💾 自动保存
  // =========================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // =========================
  // ⏱ STAR / STOP（修复版）
  // =========================
  const toggleTimer = (index) => {
    const now = Date.now()

    // STOP
    if (activeIndex === index) {
      clearInterval(intervalRef.current)

      setTasks(prev => {
        const copy = [...prev]
        const task = copy[index]

        const lastSession = task.sessions[task.sessions.length - 1]

        if (lastSession && !lastSession.end) {
          lastSession.end = now
          lastSession.duration = Math.floor((now - lastSession.start) / 1000)
        }

        return copy
      })

      setActiveIndex(null)
      return
    }

    // START
    clearInterval(intervalRef.current)
    setActiveIndex(index)

    setTasks(prev => {
      const copy = [...prev]

      if (!copy[index].sessions) {
        copy[index].sessions = []
      }

      copy[index].sessions.push({
        start: now,
        end: null,
        duration: 0,
        date: new Date().toISOString().slice(0, 10)
      })

      return copy
    })
  }

  // =========================
  // ➕ 新增任务
  // =========================
  const addTask = () => {
    setTasks([
      ...tasks,
      {
        name: '新任务',
        color: '#999',
        time: 0,
        done: false,
        sessions: []
      }
    ])
  }

  // =========================
  // ✏️ 修改名字（hover编辑）
  // =========================
  const updateName = (index, value) => {
    const copy = [...tasks]
    copy[index].name = value
    setTasks(copy)
  }

  // =========================
  // ✔ 完成任务
  // =========================
  const toggleDone = (index) => {
    const copy = [...tasks]
    copy[index].done = !copy[index].done
    setTasks(copy)
  }

  // =========================
  // ⏱ 总时间计算（sessions）
  // =========================
  const formatTime = (task) => {
    const total = task.sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}m ${s}s`
  }

  // =========================
  // 📊 进入统计页
  // =========================
  if (showDash) {
    return <Dashboard tasks={tasks} onBack={() => setShowDash(false)} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      {/* 🧊 毛玻璃主卡片（完全保留你的风格） */}
      <div style={{
        width: 460,
        padding: 24,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>

        {/* 📊 统计入口 */}
        <button onClick={() => setShowDash(true)}>
          📊 详情 / 统计
        </button>

        {/* =========================
            任务列表（UI完整保留）
        ========================= */}
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              marginTop: 10,
              opacity: task.done ? 0.5 : 1,
              textDecoration: task.done ? 'line-through' : 'none'
            }}
          >

            {/* ✔ 左：完成状态 */}
            <span
              onClick={() => toggleDone(index)}
              style={{
                color: task.color,
                cursor: 'pointer'
              }}
            >
              ●
            </span>

            {/* ⏱ 中：时间（居中） */}
            <span style={{ flex: 1, textAlign: 'center' }}>
              {formatTime(task)}
            </span>

            {/* ✏️ hover编辑 */}
            {editingIndex === index ? (
              <input
                value={task.name}
                autoFocus
                onBlur={() => setEditingIndex(null)}
                onChange={(e) => updateName(index, e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            ) : (
              <span onMouseEnter={() => setEditingIndex(index)}>
                {task.name}
              </span>
            )}

            {/* ⭐ star / stop */}
            <button onClick={() => toggleTimer(index)}>
              {activeIndex === index ? 'stop' : 'star'}
            </button>

          </div>
        ))}

        {/* ➕ 新增 */}
        <button
          onClick={addTask}
          style={{
            marginTop: 15,
            width: '100%',
            padding: 10,
            borderRadius: 10,
            border: 'none'
          }}
        >
          + 新增任务
        </button>

      </div>
    </div>
  )
}

export default App