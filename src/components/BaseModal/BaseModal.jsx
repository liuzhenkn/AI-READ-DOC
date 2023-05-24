import {Modal} from 'antd'
import styles from './BaseModal.module.css';

const BaseModal = ({children, ...props}) => {
  return (
    <Modal
      className={styles.baseModal}
      footer={null}
      centered
      maskClosable={false}
      {...props}
    >
      {children}
    </Modal>
  );
}

export default BaseModal;