import { useState } from 'react';
import { message, Popover, Input, Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import http from '../../../http';

import styles from '../root.module.css';

const HistoryItem = ({ history, active, fetchHistory }) => {
  const [rename, setRename] = useState(false);
  const [name, setName] = useState(history.name);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/chat/${history.index_id}`, {replace: true});
  }

  const onRename = (e) => {
    e.stopPropagation()
    setRename(true)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    http.post('/api/index/delete', {index_id: history.index_id})
      .then(() => {
        message.success('Delete success')
        fetchHistory()
        if (active) {
          navigate(`/`, {replace: true})
        }
      }).catch(x => x)
  }

  const handleRename = () => {
    setRename(false)
    if (history.name === name) return
    http.post('/api/index/update', {index_id: history.index_id, index_name: name})
  }

  return (
    <div className={styles.historyItem}>
      <div className={styles.historyItemTime}>
        {dayjs(history.created_at).format('DD/MM/YYYY')}
      </div>
      <div
        className={
          [styles.historyItemCard, active ? styles.historyItemCardActive : ''].join(' ')
        }
        onClick={handleClick}
      >
        <div>{
          rename ? <Input
            value={name}
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
          /> : name
        }</div>
        <Popover
          placement="bottom"
          arrow={{pointAtCenter: true}}
          onClick={(e) => e.stopPropagation()}
          content={<div className={styles.popover}>
            <Button type='link' onClick={onRename}>Rename</Button>
            <Button danger type='link' onClick={handleDelete} >Delete</Button>
          </div>}
        >
          <UnorderedListOutlined />
        </Popover>
      </div>
    </div>
  )
}

export default HistoryItem;