import styles from '../faq.module.css'

export default (configs) => ([
  {
    title: 'What is the AIReadDoc?',
  },
  {
    title: 'What is the advantage of AIReadDoc?',
  },
  {
    title: 'Who can use?',
  },
  {
    title: 'Why does AIReadDoc have VIP version?',
  },
  {
    title: 'How to use?',
  },
  {
    title: 'Comparsion between Free account and VIP account?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
          <div style={{marginBottom: '25px'}}>Comparison between Free account and VIP account,<span className="active" onClick={() => configs.togglePriceModal(true)}>Upgrade</span> now.</div>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.headerItem}>
                FreeAccount
              </div>
              <div className={styles.headerItem}>
                VIP Account
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                Upload 1 document/day
              </div>
              <div className={styles.col}>
                Upload <span className={styles.important}>unlimited</span> document/day
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                Ask me 10 questions every document/day
              </div>
              <div className={styles.col}>
                Ask me <span className={styles.important}>unlimited</span> questions every document/day
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                See some ads
              </div>
              <div className={styles.col}>
                <span className={styles.important}>Remove</span> all ads
              </div>
            </div>
          </div>
        </>
      )
    }
  },
  {
    title: 'How is the pricing of VIP account?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
          <div style={{marginBottom: '25px'}}>How is the pricing of VIP account?</div>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.headerItem}>
                VIP Account
              </div>
            </div>
            {
              configs.products.map((item) => (
                <div className={styles.row} key={item.price_id}>
                  <div className={styles.col}>
                    {item.months === 1 ? '1 month' : `${item.months} months`}
                  </div>
                  <div className={styles.col}>
                    <span className={styles.important}>
                      ${item.discount_price}(original price: ${item.original_price})
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </>
      )
    }
  }
])