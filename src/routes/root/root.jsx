import { useEffect, useState } from 'react';
import { Layout ,Button } from 'antd';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { PlusCircleOutlined } from '@ant-design/icons';
import LoginModal from 'modals/LoginModal/LoginModal';
import PriceModal from 'modals/PriceModal/PriceModal';
import { fetchUser, fetchHistory, fetchProducts, fetchPrivileges, togglePriceModal, toggleLoginModal } from '../../stores/actions'
import NotLogin from './components/NotLogin';
import HistoryItem from './components/HistoryItem';
import styles from './root.module.css';

const { Content, Sider } = Layout;

const Root = (props) => {
  const { id } = useParams();
  const [userFetched, setUserFetched] = useState(false);
  const navigate = useNavigate();
  const { loginModalVisible, priceModalVisible, isLogin, user, history } = props;
  const activeLoginModal = (show) => {
    props.toggleLoginModal(show);
  }

  const onPricing = () => {
    if (!isLogin) {
      activeLoginModal(true);
      return;
    }
    props.togglePriceModal(true);
  }

  useEffect(() => {
    if (isLogin) return;
    props.fetchUser().then(() => {
      setUserFetched(true);
      props.fetchHistory();
      props.fetchProducts();
      props.fetchPrivileges();
    }).catch(x => x);
  }, []);

  const renderSideContent = () => {
    if (!user) {
      return <div className={styles.sideContent} />
    }

    if (!isLogin) {
      return <NotLogin activeLoginModal={activeLoginModal} />
    }

    return (
      <div className={styles.sideContent}>
        <div className={styles.sideContentTitle}>
          {user.email}‘s inventory
        </div>
        {
          history?.map((item) => (
            <HistoryItem
              key={item.index_id}
              history={item}
              active={item.index_id === id}
              fetchHistory={props.fetchHistory}
            />
          ))
        }
      </div>
    )
  }

  if (!userFetched) return null;

  return (
    <Layout hasSider>
      <Helmet title="AI READ DOC" />
      <Sider
        width={300}
        className={styles.side}
      >
        <div className={styles.sideHeader}>
          <Button
            className={styles.addBtn}
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => navigate('/')}
          >
            Upload a new doc
          </Button>
        </div>
        {renderSideContent()}
        <div className={styles.sideFooter}>
          <span className={styles.sideFooterItem} onClick={() => navigate('/faq')}>FAQ</span>|
          <span className={styles.sideFooterItem} onClick={onPricing}>Pricing</span>|
          <span className={styles.sideFooterItem} onClick={() => activeLoginModal(true)}>My Account</span>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 300 }}>
        <Content className={styles.contentLayout}>
          <div className={styles.content}>
            <Outlet/>
          </div>
        </Content>
      </Layout>
      {
        loginModalVisible && 
        <LoginModal
          open={loginModalVisible}
          openPriceModal={() => props.togglePriceModal(true)}
          onCancel={() => activeLoginModal(false)}
        />
      }
      {
        priceModalVisible && 
        <PriceModal
          open={priceModalVisible}
          onCancel={() => props.togglePriceModal(false)}
        />
      }
    </Layout>
  );
}

export default connect(
  (state) => ({
    isLogin: state.isLogin,
    user: state.user,
    loginModalVisible: state.loginModalVisible,
    priceModalVisible: state.priceModalVisible,
    history: state.history
  }),
  (dispatch) => ({
    fetchUser: () => dispatch(fetchUser()),
    toggleLoginModal: (visible) => dispatch(toggleLoginModal(visible)),
    togglePriceModal: (visible) => dispatch(togglePriceModal(visible)),
    fetchHistory: () => dispatch(fetchHistory()),
    fetchProducts: () => dispatch(fetchProducts()),
    fetchPrivileges: () => dispatch(fetchPrivileges())
  })
)(Root);