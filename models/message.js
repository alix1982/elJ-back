const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema({
  countMessage: {
    type: Number,
    required: true,
    unique: true,
  },
  content: [
    {
      date: {
        type: Number,
        required: true,
      },
      dateActually: {
        type: Number,
        required: true,
      },
      // receipts - incoming/outgoing
      receipts: {
        type: String,
        enum: ['incoming', 'outgoing'],
        default: 'incoming',
        required: true,
      },
      phone: {
        aon: {
            type: String,
            // validate: validator.isMobilePhone,
            // required: true,
          },
        feedback: {
            type: String,
            // validate: validator.isMobilePhone,
            // required: true,
          },
      },
      text: {
        type: String,
        required: true,
        // minlength: 2,
        // maxlength: 50,
      },
      // psychological/social/01/emergencyTrees/chemistry
      typeMessage: {
        psychological: {
          type: Boolean,
          // required: true,
        },
        social: {
          type: Boolean,
          // required: true,
        },
        fire: {
          type: Boolean,
          // required: true,
        },
        emergencyTrees: {
          type: Boolean,
          // required: true,
        },
        chemistry: {
          type: Boolean,
          // required: true,
        },
        // type: String,
        // enum: ['psychological', 'social','fire', 'emergencyTrees','chemistry'],
        // default: 'fire',
        // required: true,
      },
      textBlackList: {
        type: String,
        // required: true,
      },
      address: {
        city: {
          type: String,
          // enum: ['psychological', 'social','fire', 'emergencyTrees','chemistry'],
          // default: 'fire',
          required: true,
        },
        street: {
          type: String,
          // enum: ['psychological', 'social','fire', 'emergencyTrees','chemistry'],
          // default: 'fire',
          // required: true,
        },
        house: {
          type: Number,
          // required: true,
        },
        porch: {
          type: Number,
          // required: true,
        },
        corpus: {
          type: String,
          // required: true,
        },
        floor: {
          type: Number,
          // required: true,
        },
        flat: {
          type: Number,
          // required: true,
        },
        intercomCode: {
          type: String,
          // required: true,
        },
      },
      typeProcessing: {
        // population/services/organizations
        typeProcessingWhom: {
          type: String,
          enum: ['population', 'services', 'organizations'],
          default: 'population',
          required: true,
        },
        // consultation/reference/redirection/challenge/rejection
        typeProcessingHow: {
          type: String,
          enum: ['consultation', 'reference','redirection', 'challenge','rejection'],
          default: 'consultation',
          required: true,
        },
      },
      note: {
        type: Boolean,
        // required: true,
      },
      psd: {
        type: Boolean,
        // required: true,
      },
      binding: {
        type: String,
        // required: true,
      },
      nameUser: {
        type: String,
        required: true,
      }
    }
  ],
}
);

module.exports = mongoose.model('message', messageSchema);
