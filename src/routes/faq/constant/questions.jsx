import styles from '../faq.module.css'

export default (configs) => ([
  {
    title: 'What is the AIReadDoc?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
          AIReadDoc is a website that leverages OpenAI's technology to provide users with a powerful document understanding, review, and analysis tool. It supports various file formats such as PDF, PPT, DOCX, JPG/JPEG/PNG images, and even MP3 audio files. Users can upload their documents and ask questions related to the content within those documents.
        </>
      )
    }
  },
  {
    title: 'What is the advantage of AIReadDoc?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
          The advantage of AIReadDoc lies in its ability to quickly analyze and understand a wide range of document types, including PDF, PPT/PPTX presentations, DOCX files, JPG/JEPG/PNG images, and even MP3 audio files. It utilizes OpenAI's technology, along with OCR capabilities for image-based documents, to provide users with a comprehensive document understanding, review, and analysis tool. AIReadDoc eliminates the need for manual reading and enables users to extract valuable information and insights from their documents in a fraction of the time. This significantly enhances productivity and streamlines the document review process.
        </>
      )
    }
  },
  {
    title: 'Who can use?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
          AIReadDoc is designed for individuals and organizations that deal with large volumes of documents and seek a more efficient way to review and analyze them. It can be particularly useful for researchers, students, professionals, content creators, and anyone who regularly interacts with diverse document formats and needs to extract information quickly.
        </>
      )
    }
  },
  {
    title: 'Why does AIReadDoc have VIP version?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
         The reason AIReadDoc has a VIP version is primarily due to the costs associated with utilizing the OpenAI API and running the website. The VIP version helps to offset these expenses by offering users an upgraded account with expanded limits and capabilities. By providing a VIP version, AIReadDoc can sustain its operations, cover the costs of using the OpenAI API, and continue to offer its services to a broader user base.
        </>
      )
    }
  },
  {
    title: 'How to use?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
        To use AIReadDoc, users need to visit the website <span className='active' onClick={() => location.href="https://aireaddoc.com"}>aireaddoc.com</span>. They can sign up for a free account or upgrade to the VIP version for expanded usage. Users can upload their documents directly through the website's interface. Once the document is uploaded, they can then ask questions related to the content within the document. AIReadDoc will process the document and provide insights or answers based on the user's queries.
        </>
      )
    }
  },
  {
    title: 'Comparsion between Free account and VIP account?',
    response: {
      role: 'system',
      type: 3,
      children: (
        <>
          <div>The Free account in AIReadDoc offers basic functionality with usage limits, allowing users to upload and process a limited number of documents per day and ask a restricted number of questions. In contrast, the VIP account provides an upgraded experience with significantly larger usage limits, catering to users with higher volume needs. These limits are in place to cover the costs of utilizing the OpenAI API. </div>
          {/* <div style={{marginBottom: '25px'}}>Comparison between Free account and VIP account,<span className="active" onClick={() => configs.togglePriceModal(true)}>Upgrade</span> now.</div>
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
          </div> */}
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
          <div>The pricing of the VIP account in AIReadDoc is $5 per month. However, if a user chooses to purchase more than one month at a time, discounts are applied. The discounts increase with the number of months purchased, offering more savings for users. This pricing structure enables users to enjoy the benefits of the VIP account with extended usage limits while also providing flexibility in terms of payment options and potential cost savings for longer-term commitments.</div>
          {/* <div style={{marginBottom: '25px'}}>How is the pricing of VIP account?</div>
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
          </div> */}
        </>
      )
    }
  }
])