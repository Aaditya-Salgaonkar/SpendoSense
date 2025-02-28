import React from 'react'
import BudgetingCard from '@/components/BudgetingCard'

const FinancialAdvice = () => {
  return (
    <> 
    <h1 className='text-4xl text-white bg-[#0a0f1c] font-sans font-bold tracking-tighter px-5 py-5'>Finance Advisor</h1>
    <div className='min-h-screen flex flex-row justify-end bg-[#0a0f1c]'>
    <div className=" bg-[#0a0f1c] text-white px-6 ">
       
        <BudgetingCard />
    </div>
    </div>
    

    
    </>
  )
}

export default FinancialAdvice
