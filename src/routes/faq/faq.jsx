import {useEffect, useState, useRef} from 'react';
import { connect } from 'react-redux';
import { togglePriceModal } from '../../stores/actions';
import Message from 'components/Message/Message';
import getQuestions from './constant/questions';

// import styles from './faq.module.css';

const Faq = (props) => {
  const endRef = useRef(null)
  const [questions, setQuestions] = useState([])
  const [messages, setMessages] = useState([]);

  const onQuestionClick = (question) => {
    messages.push({
      role: 'user',
      type: 1,
      content: question.title
    })
  
    if (question.response) {
      messages.push(question.response)
    }

    setMessages([...messages])
  }

  useEffect(() => {
    if (!endRef?.current) return
    endRef.current.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  useEffect(() => {
    if (!props.products.length) return
    const questions = getQuestions({
      products: props.products,
      togglePriceModal: props.togglePriceModal
    })
    setQuestions(questions)
  }, [props.products])

  if (!questions.length) return null

  return (
    <div style={{ padding: '30px 100px 0' }}>
      <Message role="system" type={3}>
        <>
          <div style={{marginBottom: '25px'}}>These are frequently asked questions</div>
          {
            questions.map((item, index) => (
              <div
                className="active"
                key={index}
                style={{padding: '3px 0'}}
                onClick={() => onQuestionClick(item)}
              >
                {item.title}
              </div>
            ))
          }
        </>
      </Message>
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}

export default connect(
  (state) => {
    return {
      products: state.products
    }
  },
  (dispatch) => ({
    togglePriceModal: (visible) => dispatch(togglePriceModal(visible)),
  })
)(Faq);