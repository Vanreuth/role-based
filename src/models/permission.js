const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    trim: true,
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

permissionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Permission', permissionSchema);