const mongoose = require('mongoose');
const validator = require('validator');

const departureSchema = new mongoose.Schema({
  countDeparture: {
    type: Number,
    required: true,
    unique: true,
  },
  messageDeparture: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  isDeletedDeparture: {
    type: Boolean,
    required: true
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
      // arw - trafficAccident/sro/fire
      arw: {
        type: String,
        enum: ['', 'дтп', 'пср', 'пожар'],
      },
      message: {
        type: Number,
        required: true,
      },
      applicant: {
        type: mongoose.Schema.Types.ObjectId,
      },
      victim: [{
        idVictim: {
          type: mongoose.Schema.Types.ObjectId
        },
        health: {
          type: String,
        },
      }],
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
