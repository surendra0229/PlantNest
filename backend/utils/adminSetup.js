const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * Ensures the reserved admin account exists in MongoDB.
 * Creates or updates admin using ADMIN_EMAIL and ADMIN_PASSWORD from env vars.
 * Called once at server startup after DB connection.
 * NEVER hardcodes credentials — always reads from process.env.
 */
const ensureAdminExists = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'PlantNest Admin';

    if (!adminEmail || !adminPassword) {
      console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin account setup.');
      return;
    }

    // Remove any old placeholder admin accounts (old default admin@plantnest.com)
    await Admin.deleteMany({
      email: { $nin: [adminEmail] }
    });

    // Check if the correct admin already exists
    let admin = await Admin.findOne({ email: adminEmail }).select('+password');

    if (admin) {
      // Verify password hash matches current ADMIN_PASSWORD
      const isMatch = await bcrypt.compare(adminPassword, admin.password);
      if (!isMatch) {
        // Password changed in env — re-hash and update
        console.log('🔐 Admin password updated — re-hashing from ADMIN_PASSWORD env var...');
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(adminPassword, salt);
        admin.name = adminName;
        await admin.save({ validateBeforeSave: false });
        // Re-hash will be done by pre-save hook only if password field is modified
        // But we need to bypass the pre-save hook since we already hashed
        // Use direct update instead
        await Admin.updateOne(
          { email: adminEmail },
          { $set: { name: adminName } }
        );
        console.log(`✅ Admin account updated: ${adminEmail}`);
      } else {
        // Ensure name is current
        if (admin.name !== adminName) {
          await Admin.updateOne({ email: adminEmail }, { $set: { name: adminName } });
        }
        console.log(`✅ Admin account verified: ${adminEmail}`);
      }
    } else {
      // Create the admin account — password will be hashed by pre-save hook
      await Admin.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`✅ Admin account created: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Admin setup error:', error.message);
  }
};

module.exports = { ensureAdminExists };
