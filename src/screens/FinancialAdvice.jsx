import React from 'react'
import BudgetingCard from '@/components/BudgetingCard'
import UnnecessaryExpenses from '@/components/UnnecessaryExpenses'

const FinancialAdvice = () => {
  return (
    <> 
    <h1 className='text-4xl text-white bg-[#0a0f1c] font-sans font-bold tracking-tighter px-3 py-2 sm:py-4 sm:px-4 lg:py-4  '>Finance Advisor</h1>
    <h1 className=' px-3 py-2 sm:py-4 sm:px-4 lg:py-6 lg:px-4 text-green-500 text-xl font-bold tracking-tighter bg-[#0a0f1c]'>Your Balance : <span className='font-bold'>$20000</span>  </h1>
    <div className='min-h-screen flex flex-row justify-between bg-[#0a0f1c] p-10 h-full w-full'>
     {/*Unnecessary Expenses --> Show a pie chart to show hown unnecessary expenses are spent*/}
     
         < UnnecessaryExpenses />
     
    


    
    <div className=" bg-[#0a0f1c] text-white px-6 ">       
        <BudgetingCard />
    </div>
    </div>
    

    
    </>
  )
}

export default FinancialAdvice
