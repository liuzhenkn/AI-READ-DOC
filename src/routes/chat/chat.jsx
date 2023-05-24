import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Input, Space, Button } from 'antd';
import http from '../../http';
import { togglePriceModal } from '../../stores/actions';
import Message from '../../components/Message/Message';
import { getAskLimitMsg } from '../../constant/message';
import styles from './chat.module.css';

const Chat = (props) => {
  const {id} = useParams()
  const [ messages, setMessages ] = useState([])
  const [ inputValue, setInputValue ] = useState('')
  const [ isChatting, setIsChatting ] = useState(false)
  const searchParams = new URLSearchParams(window.location.search)
  const isInit = searchParams.get('init') === 'true'
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
        console.log(res)
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

  const getMessages = async () => {
    const res = await http.get(`/api/index/get?index_id=${id}`)
    const {messages = []} = res || {}
    setMessages(messages.map((item) => ({
      ...item,
      content: item.text
    })))
  }

  const sendMessage = async (content) => {
    if (!content) return
    const newMessages = [...messages]
    newMessages.push({
      content: content,
      role: 'user',
      type: 1
    })
    setMessages(newMessages)
    setInputValue('')
    receiveMessage(content, newMessages)
  }

  const receiveMessage = async (content, newMessages) => {
    const ctrl = new AbortController();
    const msgLength = newMessages.length
    const next = [...newMessages]
    setIsChatting(true)
    await fetchEventSource(`/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({index_id: id, query: content}),
      signal: ctrl.signal,
      onmessage: (res) => {
        console.log(res)
        if (res.data === '[DONE]') {
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
          setMessages([...newMessages, getAskLimitMsg(props.togglePriceModal)])
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

  useEffect(() => {
    if (!endRef?.current) return
    endRef.current.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  useEffect(() => {
    if (isInit && messages.length === 0) {
      init()
      return
    }

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
            disabled={isChatting}
          />
          <Button
            className={styles.chatBtn}
            type="primary"
            onClick={() => sendMessage(inputValue)}
          >Submit</Button>
        </Space.Compact>
      </div>
    </div>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    togglePriceModal: (visible) => dispatch(togglePriceModal(visible)),
  })
)(Chat);
