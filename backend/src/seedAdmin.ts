import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        
        const adminEmail = 'ylinktech7@gmail.com';
        const adminPassword = '@Ylink3310331042';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists.');
            process.exit(0);
        }

        // const salt = await bcrypt.genSalt(12);
        // const hashedPassword = await bcrypt.hash(adminPassword, salt);
        await User.create({
            name: 'YLink Super Admin',
            email: adminEmail,
            phone: '08012345678',
            password: adminPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

createAdmin();