import styles from './Message.module.css';

const AVATOR_MAP = {
  'user': styles.personAvator,
  'user-question': styles.personQuestionAvator,
}

const Index = (props) => {
  const { role, type = 1, children, content } = props;
  const renderContent = () => {
    if (type === 1) {
      return (
        <div className={styles.messageContent}>
          {content}
        </div>
      );
    }

    if (type === 2) {
      return (
        <div className={styles.messageContent} dangerouslySetInnerHTML={{__html: content}} />
      );
    }

    if (type === 3) {
      return (
        <div className={styles.messageContent}>
          {children}
        </div>
      );
    }
  }

  return (
    <div className={role !== 'user' ? styles.robotMessage : styles.personMessage}>
      <div className={AVATOR_MAP[role] || styles.robotAvator} />
      {renderContent()}
    </div>
  );
}

export default Index;