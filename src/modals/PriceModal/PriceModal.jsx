import { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { CheckCircleFilled, ClockCircleFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import { fetchUser } from '../../stores/actions';
import http from '../../http';
import BaseModal from '../../components/BaseModal/BaseModal';
import styles from './PriceModal.module.css';

const PriceMdoal = (props) => {
  const { isVip } = props;
  const [currentProduct, setCurrentProduct] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [success, setSuccess] = useState(null);

  const onProductSelect = (id) => {
    if (id === currentProduct) {
      setCurrentProduct(null);
      return;
    }
  
    setCurrentProduct(id);
  }

  const onPurchase = async () => {
    if (!currentProduct) {
      message.error('Please select a product');
      return;
    }

    const res = await http.post('/api/checkout/create', {
      price_id: currentProduct,
      redirect_url: window.location.href // TODO: change to real url
    });

    const { id, redirect_url } = res;
    setOrderId(id);
    window.open(redirect_url, '_blank');
  }

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const interval = setInterval(async () => {
      const res = await http.get(`/api/checkout/query?session_id=${orderId}`);
      if (res.status === 'complete') {
        setSuccess(res);
        clearInterval(interval);
        setOrderId(null);
        props.fetchUser();
        return;
      }

      if (res.status === 'expired') {
        clearInterval(interval);
        message.error('Purchase failed, please try again later.');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  const renderContent = () => {
    if (success) {
      return (
        <div className={styles.success}>
          <CheckCircleFilled className={styles.icon} />
          <div className={styles.title}>Purchase Success</div>
          <div className={styles.desc}>
            You have successfully purchased the VIP account.
          </div>
          <div className={styles.footer}>
            <Button type="primary" onClick={props.onCancel}>OK</Button>
          </div>
        </div>
      )
    }

    if (orderId && !success) {
      return (
        <div className={styles.success}>
          <ClockCircleFilled className={styles.successIcon} />
          <div className={styles.content}>
            <div className={styles.title}>Searching for payment results</div>
            <div className={styles.desc}>Please wait a moment...</div>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.subTitle}>Compare Free and VIP Usage Limits:</div>
        {
          props.privileges?.length ? (
            <div className={styles.table}>
              <div className={styles.row}>
                <div className={styles.col}></div>
                <div className={styles.col}>Free</div>
                <div className={styles.col}>VIP</div>
              </div>
              <div className={styles.row}>
                <div className={styles.col}>Files per Day</div>
                <div className={styles.col}>{props.privileges?.[0].max_files_per_index}</div>
                <div className={styles.col}>
                  <span className={styles.important}>{props.privileges?.[1].max_files_per_index}</span>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.col}>File Size Limit</div>
                <div className={styles.col}>{props.privileges?.[0].max_size_per_doc / (1024 * 1024)}MB</div>
                <div className={styles.col}>
                  <span className={styles.important}>{props.privileges?.[1].max_size_per_doc / (1024 * 1024)}MB</span>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.col}>Questions per Day</div>
                <div className={styles.col}>{props.privileges?.[0].max_questions_per_day}</div>
                <div className={styles.col}>
                  <span className={styles.important}>{props.privileges?.[1].max_questions_per_day}</span>
                </div>
              </div>
            </div>
          ) : null
        }
        <div className={styles.subTitle}>Upgrade to VIP Now!</div>
        <div className={styles.table}>
          {
            props.products.map((item) => (
              <div className={styles.row} key={item.price_id} onClick={() => onProductSelect(item.price_id)}>
                <div className={styles.col}>
                  <CheckCircleFilled
                    className={item.price_id === currentProduct ? styles.active : styles.unactive}
                  />
                  {item.months === 1 ? '1 month' : `${item.months} months`}
                </div>
                <div className={styles.col}>
                  <span className={styles.important}>
                    ${item.discount_price}
                  </span>
                </div>
                <div className={styles.col}>
                  <span className={styles.important}>
                    {item.discount_ratio}% off
                  </span>
                </div>
              </div>
            ))
          }
        </div>
        <div className={styles.footer}>
          <Button type="default" style={{ marginRight: '20px' }} onClick={props.onCancel}>Cancel</Button>
          {
            !isVip && (
              <Button
                type="primary"
                onClick={onPurchase}
                disabled={!currentProduct}
              >
                Purchase
              </Button>
            )
          }
        </div>
      </div>
    )
  }

  return (
    <BaseModal
      title="Upgrade to VIP"
      width={600}
      {...props}
      destroyOnClose={true}
      closable={!(orderId && !success)}
    >
      {renderContent()}
    </BaseModal>
  )
}

export default connect(
  (state) => ({
    products: state.products,
    privileges: state.privileges,
    isVip: state.isVip
  }),
  (dispatch) => ({
    fetchUser: () => dispatch(fetchUser())
  })
)(PriceMdoal)
