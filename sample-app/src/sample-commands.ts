import { Command } from './genaie';

const commands: Command[] = [
    {
      name: 'buyProduct',
      description: 'Buys a product from the store',
      inputs: [
        {
          name: 'name',
          description: 'The name of the product, e.g. t-shirt',
          type: 'string',
          required: true
        }
      ],
      action: (context) => {
        console.log('buying t-shirt', context.inputs);
        return Promise.resolve({ ok: true, context })
      }
    },
    {
      name: 'updateProfile',
      description: 'Change the user profile details such as name and email',
      inputs: [
        {
          name: 'name',
          description: 'The updated name of the user',
          type: 'string',
          required: false,
        },
        {
          name: 'email',
          description: 'The updated email of the user',
          type: 'string',
          required: false
        }
      ],
      action: (context) => {
        console.log('updated profile', context.inputs);
        return Promise.resolve({ ok: true, context })
      }
    }
  ]