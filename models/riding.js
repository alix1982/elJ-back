const mongoose = require('mongoose');
const validator = require('validator');

const ridingSchema = new mongoose.Schema({
  countRiding: {
    type: Number,
    required: true,
    unique: true,
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message',
    required: true,
  },
  contentData: [
    {
      team: {
        // type: mongoose.Schema.Types.ObjectId,
        type: Number,
        ref: 'team',
        required: true,
      },
      // date: {
      //   type: Number,
      //   required: true,
      // },
      dateActually: {
        type: Number,
        required: true,
      },
      ero: {
        type: Boolean,
      },
      // receipts - incoming/outgoing
      // receipts: {
      //   type: String,
      //   enum: ['incoming', 'outgoing'],
      //   default: 'incoming',
      //   required: true,
      // },
      // phone: {
      //   aon: {
      //       type: String,
      //       // validate: validator.isMobilePhone,
      //       // required: true,
      //     },
      //   feedback: {
        //       type: String,
        //       // validate: validator.isMobilePhone,
        //       // required: true,
        //     },
        // },
      address: {
        // city: {
        //   type: String,
        //   // enum: ['psychological', 'social','fire', 'emergencyTrees','chemistry'],
        //   // default: 'fire',
        //   required: true,
        // },
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
        landmark: {
          type: String,
          // required: true,
          // minlength: 2,
          maxlength: 100,
        },
      },
      time: {
        transfer: {
          type: Date,
          required: true,
        },
        departure: {
          type: Date,
          required: true,
        },
        arrival: {
          type: Date,
          required: true,
        },
        departure: {
          type: Date,
          required: true,
        },
        refund: {
          type: Date,
          required: true,
        },
      },
      numberCars: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 10,
      },
      numberWorker: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 50,
      },
      // добавить ограничение текста - enum: ['psychological', 'social','fire', 'emergencyTrees','chemistry'],
      resultWork: {
        reasonDelay: {
          type: String,
          required: true,
        },
        occasion: {
          type: String,
          required: true,
        },
        character: {
          type: String,
          required: true,
        },
        effect: {
          type: String,
          required: true,
        },
        // senior: {
        //   type: String,
        //   required: true,
        // },
        //
        text: {
          type: String,
          required: true,
          // minlength: 2,
          // maxlength: 50,
        },
      },
      assistance: {
        check: {
          type: Boolean,
          required: true,
        },
        nameOrganization: {
          type: String,
        }
      },
      involvement: {
        check: {
          type: Boolean,
        },
        listOrganization: [
          {
            name: {
              type: String,
              required: true,
            },
            date: {
              type: Number,
              required: true,
            },
          },
        ]
      },


      // // psychological/social/01/emergencyTrees/chemistry
      // typeMessage: {
      //   psychological: {
      //     type: Boolean,
      //     // required: true,
      //   },
      //   social: {
      //     type: Boolean,
      //     // required: true,
      //   },
      //   fire: {
      //     type: Boolean,
      //     // required: true,
      //   },
      //   emergencyTrees: {
      //     type: Boolean,
      //     // required: true,
      //   },
      //   chemistry: {
      //     type: Boolean,
      //     // required: true,
      //   },
      //   // type: String,
      //   // enum: ['psychological', 'social','fire', 'emergencyTrees','chemistry'],
      //   // default: 'fire',
      //   // required: true,
      // },
      // textBlackList: {
      //   type: String,
      //   // required: true,
      // },
      // typeProcessing: {
      //   // population/services/organizations
      //   typeProcessingWhom: {
      //     type: String,
      //     enum: ['population', 'services', 'organizations'],
      //     default: 'population',
      //     required: true,
      //   },
      //   // consultation/reference/redirection/challenge/rejection
      //   typeProcessingHow: {
      //     type: String,
      //     enum: ['consultation', 'reference','redirection', 'challenge','rejection'],
      //     default: 'consultation',
      //     required: true,
      //   },
      // },
      // note: {
      //   type: Boolean,
      //   // required: true,
      // },
      // psd: {
      //   type: Boolean,
      //   // required: true,
      // },
      // binding: {
      //   type: String,
      //   // required: true,
      // },
      // nameUser: {
      //   type: String,
      //   required: true,
      // }
    }
  ],
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'applicant',
    required: true,
  },
  victims: [
    {
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      gender: {
        type: String,
        enum: ['man', 'woman', 'notDefined'],
      },
      statusVictim: {
        type: String,
        enum: ['saved', 'lost', 'missing'],
      },
      socialStatus: {
        type: String,
        // enum: ['man', 'woman'],
      },
      age: {
        type: String,
        enum: [Date, '0-7','8-14','15-30','31-50','51-65','older 65','no',],
      },
      note: {
        type: String,
        // required: true,
        minlength: 2,
        maxlength: 200,
      },
    }
  ]
}
);

module.exports = mongoose.model('riding', ridingSchema);
