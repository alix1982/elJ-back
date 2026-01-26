const mongoose = require('mongoose');
const validator = require('validator');

const departureSchema = new mongoose.Schema({
  countDeparture: {
    type: Number,
    required: true,
    unique: true,
  },
  content: [
    {
      dateActually: {
        type: Number,
        required: true,
      },
      team: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      arw: {
        type: Boolean,
        required: true,
      },
      message: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      applicant: {
        type: mongoose.Schema.Types.ObjectId,
      },
      victim: [
        {type: mongoose.Schema.Types.ObjectId},
      ],
      address: {
        city: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
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
      landmark: {
        type: String,
        // required: true,
      },
      time: {
        dateReceivingDeparture: {
          type: Number,
          // required: true,
        },
        dateTransfer: {
          type: Number,
          // required: true,
        },
        dateDeparture: {
          type: Number,
          // required: true,
        },
        dateArrival: {
          type: Number,
          // required: true,
        },
        dateEnd: {
          type: Number,
          // required: true,
        },
        dateReturn: {
          type: Number,
          // required: true,
        },
      },
      // note: {
      //   type: Boolean,
      //   // required: true,
      // },
      // psd: {
      //   type: Boolean,
      //   // required: true,
      // },
      reasonDelay: {
        type: String,
        // required: true,
      },
      reasonChallenge: {
        type: String,
        // required: true,
      },
      natureChallenge: {
        type: String,
        // required: true,
      },
      checkOutResult: {
        type: String,
        // required: true,
      },
      elderPSG: {
        type: String,
        // required: true,
      },
      textWorkDescription: {
        type: String,
        // required: true,
      },
      assistance: [{
        text: {
          type: String,
        },
      }],
      participation: [{
        text: {
          type: String,
        },
        time: {
          type: String,
        }
      }],
      nameUser: {
        type: String,
        required: true,
      }
    }
  ],
});

module.exports = mongoose.model('departure', departureSchema);
