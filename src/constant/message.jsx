export const getAskLimitMsg = (togglePriceModal) => ({
  role: 'system',
  type: 3,
  children: (
    <>
      <div>
        There are costs to run me, so I cannot provide extra services to you today. Come back tomorrow or Pay some costs for me. Here are the comparison between Free account and VIP account, <span onClick={() => togglePriceModal(true)} className="active">Upgrade</span> Now:
      </div>
    </>
  )
})
