import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../root.module.css';

const NotLogin = (props) => {
  return (
    <div className={styles.sideContentEmpty}>
      <ExclamationCircleOutlined className={styles.closeIcon} />
      <div className={styles.sideContentEmptyText}>
        No history yet, you can <span className="active" onClick={() => props.activeLoginModal(true)}>login</span> to track history.
      </div>
    </div>
  )
}

export default NotLogin;