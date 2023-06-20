import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
// import { Typewriter } from 'react-simple-typewriter'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Input, Space, Button, Spin } from 'antd';
import http from '../../http';
import { toggleLoginModal, togglePriceModal } from '../../stores/actions';
import Message from 'components/Message/Message';
import styles from './chat.module.css';

const Chat = (props) => {
  const {id} = useParams()
  const [ messages, setMessages ] = useState([])
  const [ inputValue, setInputValue ] = useState('')
  const [ isChatting, setIsChatting ] = useState(false)
  const navigate = useNavigate()
  const endRef = useRef(null)

  const init = async () => {
    const msgLength = messages.length
    const next = [...messages]
    const ctrl = new AbortController();
    setIsChatting(true)
    await fetchEventSource(`/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({index_id: id}),
      signal: ctrl.signal,
      onmessage: (res) => {
        if (res.data === '[DONE]') {
          setIsChatting(false)
          ctrl.abort()
          return
        }

        const { data } = res
        const { content, error_code: code } = JSON.parse(data)
        if (code === 1003) {
          ctrl.abort()
          getMessages()
          return
        }
        if(!next[msgLength]) {
          next.push(
            {
              content: content,
              role: 'system',
              type: 1
            }
          )
          setMessages(next)
        } else {
          const current = next[msgLength]
          current.content = current.content + content
          setMessages([...next])
        }
      },
      onerror(err) {
        console.log(err)
        ctrl.abort()
      }
    })
  }

  const generateLimitMsg = () => {
    const {isLogin} = props
    if (!isLogin) {
      return (
        <>
          <div>Oops! It seems you have reached your daily usage limit as an anonymous user.</div>
          <div><span onClick={() => props.toggleLoginModal(true)} className="active">Signing in</span> and upgrade to VIP now to enjoy unlimited access and unlock all the benefits AiReadDoc has to offer.</div>
        </>
      )
    }

    return (
      <>
        <div>Oops! It seems you have reached your daily usage limit as an FREE user.</div>
        <div><span onClick={() => props.togglePriceModal(true)} className="active">Upgrade</span> to VIP now to enjoy unlimited access and unlock all the benefits AiReadDoc has to offer.</div>
      </>
    )
  }

  const getMessages = async () => {
    if (!id) return
    try {
      const res = await http.get(`/api/index/get?index_id=${id}`)
      const {messages = []} = res || {}
      if (!messages.length) {
        init() // 没有历史则说明是第一次进，调用init
        return
      }
      setMessages(messages.map((item) => ({
        ...item,
        content: item.text
      })))
    } catch(err) {
      const {data} = err || {}
      if (data?.status?.code === 1001) {
        navigate('/')
      }
    }
  }

  const sendMessage = async (content) => {
    if (!content || isChatting) return
    setInputValue('')
    const newMessages = [...messages]
    newMessages.push({
      content: content,
      role: 'user',
      type: 1
    })
    newMessages.push({
      content: (
        <div>
          <Spin size='smail' />
        </div>
      ),
      role: 'system-loading',
      type: 1
    })
    setMessages(newMessages)
    receiveMessage(content, newMessages)
  }

  const receiveMessage = async (content, newMessages) => {
    const ctrl = new AbortController();
    const msgLength = newMessages.length
    const next = [...newMessages]
    // let message = ''
    setIsChatting(true)
    await fetchEventSource(`/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({index_id: id, query: content}),
      signal: ctrl.signal,
      onmessage: (res) => {
        const current = next[msgLength - 1]

        if (res.data === '[DONE]') {
          // current.content = <Typewriter
          //   words={[message]}
          //   loop={1}
          //   typeSpeed={20}
          //   onLoopDone={() => {
          //     if (!endRef?.current) return
          //     endRef.current.scrollIntoView({behavior: 'smooth'})
          //   }}
          // />
          // setMessages([...next])
          setIsChatting(false)
          ctrl.abort()
          return
        }

        const {
          content,
          error_code: code,
        } = JSON.parse(res.data)

        if (code === 1002) {
          setIsChatting(false)
          if (current.role === 'system-loading') {
            current.role = 'system'
            current.children = generateLimitMsg()
            current.type = 3
            setMessages([...next])
          } else {
            setMessages([...newMessages, {
              role: 'system',
              type: 3,
              children: generateLimitMsg()
            }])
          }
          return
        }

        // if(current.role === 'system-loading') {
        //   current.role = 'system'
        //   message = content
        // } else {
        //   message = message + content
        // }

        // 方案一
        current.content = current.role === 'system-loading' ? content : current.content + content
        if(current.role === 'system-loading') {
          current.role = 'system'
        }
        setMessages([...next])
      },
      onerror(err) {
        console.log(err)
        ctrl.abort()
      }
    })
  }

  useEffect(() => {
    if (!endRef?.current) return
    endRef.current.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  useEffect(() => {
    setMessages([])
    getMessages()
  }, [id])

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatList}>
        {
          messages.map((message, index) => (
            <Message key={index} {...message} />
          ))
        }
        <div ref={endRef} />
      </div>
      <div className={styles.chatInputWrapper}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            className={styles.chatInput}
            placeholder={
              isChatting ? 'Waiting' : 'Type your question here'
            }
            size="large"
            onPressEnter={(e) => sendMessage(e.target.value)}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <Button
            className={styles.chatBtn}
            type="primary"
            disabled={isChatting}
            onClick={() => sendMessage(inputValue)}
          >Submit</Button>
        </Space.Compact>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    isLogin: state.isLogin,
    isVip: state.isVip,
  }),
  (dispatch) => ({
    toggleLoginModal: (visible) => dispatch(toggleLoginModal(visible)),
    togglePriceModal: (visible) => dispatch(togglePriceModal(visible)),
  })
)(Chat);
