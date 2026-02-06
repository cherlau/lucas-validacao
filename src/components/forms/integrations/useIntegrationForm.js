import { reactive } from 'vue'

export function useIntegrationForm() {
  const form = reactive({
    // STEP 1
    companyName: '',
    companyCode: '',
    integrationType: '',
    integrationUrl: '',
    username: '',
    password: '',
    activeDirectory: false,

    // STEP 2
    unavailableUnitsBehavior: '',
    availableColor: '#1CCA85',
    unavailableColor: '#FF567B',
    proposalValidity: '',
    clientOriginCode: '',
    contractPercentage: '',
    billingPattern: '',
    sendFutureValue: false,
    sendConfirmedProposal: true,
    updateClientOnSend: true,
  })

  // const isStepOneValid = () =>
  //   !!(
  //     form.companyName &&
  //     form.companyCode &&
  //     form.integrationType &&
  //     form.integrationUrl &&
  //     form.username &&
  //     form.password
  //   )

  const isStepOneValid = () => true

  return {
    form,
    isStepOneValid,
  }
}
