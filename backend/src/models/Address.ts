import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
    user: mongoose.Types.ObjectId;
    street: string;
    city: string;
    state: string;
    phone: string;
    isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// --- PRE-SAVE HOOK ---
AddressSchema.pre('save', async function () {
    // Only run if isDefault is true AND it was modified or newly created
    if (this.isDefault && this.isModified('isDefault')) {
        // Dynamic model reference prevents "MissingSchemaError"
        const AddressModel = this.constructor as mongoose.Model<IAddress>;

        await AddressModel.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { $set: { isDefault: false } }
        );
    }
    // Do NOT call next() when using an async hook function
});

export default mongoose.model<IAddress>('Address', AddressSchema);