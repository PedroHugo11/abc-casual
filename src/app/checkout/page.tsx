"use client"

import { useState } from "react"

import StepAddress from "@/features/checkout/steps/StepAddress"
import StepPayment from "@/features/checkout/steps/StepPayment"
import StepReview from "@/features/checkout/steps/StepReview"

export default function CheckoutPage() {

  const [step, setStep] = useState<1 | 2 | 3>(1)

  return (
    <main className="container py-5">

      <h2 className="mb-4">Finalizar compra</h2>

      {step === 1 && (
        <StepAddress next={() => setStep(2)} />
      )}

      {step === 2 && (
        <StepPayment
          next={() => setStep(3)}
          back={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <StepReview
          goToAddress={() => setStep(1)}
          goToPayment={() => setStep(2)}
        />
      )}

    </main>
  )
}