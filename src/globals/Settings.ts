import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
    {
      name: 'emailSettings',
      type: 'group',
      fields: [
        { name: 'resendApiKey', type: 'text' },
        { name: 'fromEmail', type: 'text' },
      ],
    },
    {
      name: 'whatsappSettings',
      type: 'group',
      fields: [
        { name: 'fonnteApiKey', type: 'text' },
        { name: 'enabled', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'shippingSettings',
      type: 'group',
      fields: [
        { name: 'rajaOngkirApiKey', type: 'text' },
        {
          name: 'activeCouriers',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'JNE', value: 'jne' },
            { label: 'TIKI', value: 'tiki' },
            { label: 'POS', value: 'pos' },
          ],
        },
      ],
    },
    {
      name: 'paymentSettings',
      type: 'group',
      fields: [
        { name: 'xenditSecretKey', type: 'text' },
        { name: 'enableQris', type: 'checkbox', defaultValue: true },
        { name: 'enableVa', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
