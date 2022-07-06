interface ICreateAccount {
  accountType: 'usuario' | 'incubadora';
  accountTeamSize: '1-1' | '2-10' | '10-50' | '50+';
  accountName: string;
  accountPlan: 'gratuito' | 'pago';
  businessName: string;
  businessDescriptor: string;
  business: 'si' | 'no';
  businessType: 'publico' | 'privado';
  businessDescription: string;
  businessEmail: string;
  nameOnCard: string;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCvv: string;
  saveCard: string;
}

const inits: ICreateAccount = {
  accountType: 'usuario',
  accountTeamSize: '50+',
  accountName: '',
  accountPlan: 'gratuito',
  businessName: 'Keenthemes Inc.',
  businessDescriptor: 'KEENTHEMES',
  business: 'si',
  businessType: 'publico',
  businessDescription: '',
  businessEmail: 'corp@support.com',
  nameOnCard: 'Max Doe',
  cardNumber: '4111 1111 1111 1111',
  cardExpiryMonth: '1',
  cardExpiryYear: '2',
  cardCvv: '123',
  saveCard: '1',
};

export { ICreateAccount, inits };
