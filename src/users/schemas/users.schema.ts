import { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersInterface } from '../interfaces/users.interface';

export const UserSchema: Schema<UsersInterface> = new Schema({
    name: String,
    phone: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'disabled']
    },
    roles: [String],
    facebookId: String,
    googleId: String
}, { versionKey: false, timestamps: true }) ;

UserSchema.pre<UsersInterface>('save', function(next){

    let user = this;

    // Make sure not to rehash the password if it is already hashed
    if(!user.isModified('password')) return next();

    // Generate a salt and use it to hash the user's password
    bcrypt.genSalt(10, (err, salt) => {

        if(err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {

            if(err) return next(err);
            user.password = hash;
            next();

        });

    });

});

UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    let password = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, success) => {
            if (err) return reject(err);
            return resolve(success);
        });
    });
};