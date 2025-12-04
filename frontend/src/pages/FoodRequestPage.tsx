import React from 'react'
import { useAuth } from '@/context/AuthContext'
import Generator from '@/components/Generator'

export const FoodRequestPage: React.FC = () => {
  const { userId } = useAuth()

  return (
    <div className="food-request-page">
      <Generator onPlanGenerated={() => {}} />
    </div>
  )
}

export default FoodRequestPage