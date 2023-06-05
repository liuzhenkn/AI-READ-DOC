import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { fetchHistory, toggleLoginModal, togglePriceModal } from '../../stores/actions';
import http from '../../http';
import UploadFile from 'components/UploadFile/UploadFile';
import Message from 'components/Message/Message';

import styles from './index.module.css';

const Index = (props) => {
  const [indexInfo, setIndexInfo] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (indexInfo) return
    http.post('/api/index/init').then((res) => {
      setIndexInfo(res)
    }).catch(x => x)
  }, [])

  useEffect(() => {
    if (!indexInfo) return
    const {isVip, isLogin, user} = props
    setMessages([
      {
        role: 'system',
        type: 3,
        children: (
          <>
            {
              isLogin ? (
                isVip ? (
                  <div style={{marginBottom: '25px'}}>Hey, {user?.email}, you are VIP Account now, all the features are unlocked.</div>
                ) : (
                  <div style={{marginBottom: '25px'}}>Hey, {user?.email}, welcome back to AIReadDoc, you are Normal User now and daily upload number is limited. To unlock more features, see <span className="active" onClick={() => props.togglePriceModal(true)}>VIP intro</span>;</div>
                )
              ) : (
                <div style={{marginBottom: '25px'}}>Hey, welcome to AIReadDoc, I can help you to fast understand, review and analysis the documents. I can support pdf, ppt, docx, jpg|png, mp3, etc. Just upload the documents and ask me anything. I will try my best to answer your question. Highly recommend <span className="active" onClick={() => props.toggleLoginModal(true)}>Sign in</span> Firstly, the doc history will be saved for you.</div>
              )
            }
            <UploadFile isVip={isVip} indexInfo={indexInfo} fetchHistory={props.fetchHistory} />
          </>
        )
      },
      {
        role: 'system',
        type: 3,
        children: (
          <>
            <div style={{marginBottom: '25px'}}>If you want to know more about me, please see the link below:</div>
            <div className={styles.links}>
              <Link to="/faq">Frequently Asked Question</Link>
              <Link to="/faq">Pricing</Link>
            </div>
          </>
        )
      }
    ])
  }, [indexInfo, props.isVip])

  if (!indexInfo) return null

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