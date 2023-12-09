import BillingForm from "@/components/BillingForm"
import { getUserSubscriptionPlan } from "@/lib/stripe"


const page = async() => {

    const subscriptonPlan = await getUserSubscriptionPlan()

    return <BillingForm subscriptionPlan={subscriptonPlan}  />

  return (
    <div>page</div>
  )
}

export default page