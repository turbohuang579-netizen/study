import { useState, useRef } from 'react'
import bg from './assets/IMG_0552.JPG'

function App() {
  const [tasks, setTasks] = useState([
    { name: '日语', color: '#3B82F6', time: 0, done: false },
    { name: '韩语', color: '#22C55E', time: 0, done: false },
    { name: '阅读', color: '#EAB308', time: 0, done: false },
    { name: '健身', color: '#EF4444', time: 0, done: false },
  ])

  const [activeIndex, setActiveIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [viewMode, setViewMode] = useState('day')

  const intervalRef = useRef(null)

  // 计时
  const toggleTimer = (index) => {
    if (activeIndex === index) {
      clearInterval(intervalRef.current)
      setActiveIndex(null)
      return
    }

    clearInterval(intervalRef.current)
    setActiveIndex(index)

    intervalRef.current = setInterval(() => {
      setTasks(prev => {
        const copy = [...prev]
        copy[index].time += 1
        return copy
      })
    }, 1000)
  }

  // 新增任务
  const addTask = () => {
    setTasks([
      ...tasks,
      { name: '新任务', color: '#999', time: 0, done: false }
    ])
  }

  // 切换完成状态
  const toggleDone = (index) => {
    const copy = [...tasks]
    copy[index].done = !copy[index].done
    setTasks(copy)
  }

  // 编辑任务名
  const updateName = (index, value) => {
    const copy = [...tasks]
    copy[index].name = value
    setTasks(copy)
  }

  // 总时间
  const totalTime = tasks.reduce((sum, t) => sum + t.time, 0)

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}m ${s}s`
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }}>

      <div style={{
        width: '450px',
        padding: '24px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        color: '#fff'
      }}>

        {/* 标题 */}
        <h1>인절미</h1>

        {/* 统计 + 切换 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>总：{formatTime(totalTime)}</p>

          <div>
            {['day', 'week', 'month'].map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                style={{
                  marginLeft: '6px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === v ? '#fff' : 'rgba(255,255,255,0.3)'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* 任务列表 */}
        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((task, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.2)',
                opacity: task.done ? 0.5 : 1,
                textDecoration: task.done ? 'line-through' : 'none'
              }}
            >

              {/* 左侧 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                <span
                  style={{ color: task.color, cursor: 'pointer' }}
                  onClick={() => toggleDone(index)}
                >
                  ●
                </span>

                {/* hover编辑 */}
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
                      outline: 'none'
                    }}
                  />
                ) : (
                  <span
                    onMouseEnter={() => setEditingIndex(index)}
                  >
                    {task.name}
                  </span>
                )}
              </div>

              {/* 右侧 */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span onClick={() => toggleTimer(index)} style={{ cursor: 'pointer' }}>
                  {formatTime(task.time)}
                </span>
              </div>

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
            background: '#fff',
            color: '#000'
          }}
        >
          + 新增任务
        </button>

      </div>
    </div>
  )
}

export default App