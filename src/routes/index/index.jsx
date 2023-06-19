import {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { fetchHistory, toggleLoginModal, togglePriceModal } from '../../stores/actions';
import http from '../../http';
import UploadFile from 'components/UploadFile/UploadFile';
import Message from 'components/Message/Message';

const Index = (props) => {
  const [indexInfo, setIndexInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [limit, setLimit] = useState(false)
  const [fetched, setFetched] = useState(false)

  const getLimitMessage = () => {
    const {isVip, isLogin, user} = props

    if (!isLogin) {
      return (
        <div style={{marginBottom: '25px'}}>Hey, welcome to AIReadDoc, I can help you to fast understand, review and analysis the documents. As an anonymous user, you have reached the daily limit of {user?.plan?.max_questions_per_day || 1} files today. We Highly recommend you <span className="active" onClick={() => props.toggleLoginModal(true)}>Signing in</span> and upgrading to VIP for extended usage limit.</div>
      )
    }

    if (!isVip) {
      return (
        <div style={{marginBottom: '25px'}}>Hey, welcome to AIReadDoc, I can help you to fast understand, review and analysis the documents. As a FREE user, you have reached the daily limit of {user?.plan?.max_questions_per_day || 1} files today. We Highly recommend you <span className="active" onClick={() => props.togglePriceModal(true)}>Upgrading</span> to VIP for extended usage limit.</div>
      )
    }

    return (
      <div style={{marginBottom: '25px'}}>Hey, {user?.email}, welcome back to AIReadDoc, you are Normal User now and daily upload number is limited. To unlock more features, see <span className="active" onClick={() => props.togglePriceModal(true)}>VIP intro</span>;</div>
    )
  }

  const generateMessage = () => {
    const {isVip, isLogin, user} = props

    if (!isLogin) {
      return (
        <div style={{marginBottom: '25px'}}>Hey, welcome to AIReadDoc, I can help you to fast understand, review and analysis the documents. I can support pdf, ppt, docx, jpg|jpeg|png, mp3, etc. Just upload the documents and ask me anything. I will try my best to answer your question. Highly recommend <span className='active' onClick={() => props.toggleLoginModal()}>Signing in</span> Firstly.</div>
      )
    }

    if (!isVip) {
      return (
        <div style={{marginBottom: '25px'}}>Hey, {user?.email}, welcome back to AIReadDoc, you are Normal User now and daily upload number is limited. To unlock more features, see <span className="active" onClick={() => props.togglePriceModal(true)}>VIP intro</span>;</div>
      )
    }

    return (
      <div style={{marginBottom: '25px'}}>Hey, {user?.email}, you are VIP Account now, all the features are unlocked.</div>
    )
  }

  useEffect(() => {
    if (indexInfo) return
    http.post('/api/index/init').then((res) => {
      setIndexInfo(res)
      setFetched(true)
    }).catch(() => {
      setLimit(true)
      setFetched(true)
    })
  }, [])

  useEffect(() => {
    setMessages([
      {
        role: 'system',
        type: 3,
        children: (
          <>
            {limit ? getLimitMessage() : generateMessage()}
            <UploadFile
              indexInfo={indexInfo}
              isVip={props.isVip}
              fetchHistory={props.fetchHistory}
              sizeLimit={props.user?.plan?.max_size_per_doc || 104857600}
            />
          </>
        )
      },
    ])
  }, [fetched, props.isVip])

  if (!fetched) return null

  return (
    <div style={{ padding: '30px 100px 0' }}>
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
}

export default connect(
  (state) => ({
    isVip: state.isVip,
    isLogin: state.isLogin,
    user: state.user
  }),
  (dispatch) => ({
    fetchHistory: () => dispatch(fetchHistory()),
    toggleLoginModal: (visible) => dispatch(toggleLoginModal(visible)),
    togglePriceModal: (visible) => dispatch(togglePriceModal(visible))
  })
)(Index);