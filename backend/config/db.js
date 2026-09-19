const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS SRV resolution issues (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // fallback if setServers is restricted
}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!connStr) {
      console.error('❌ CRITICAL ERROR: MONGODB_URI is missing in backend/.env file.');
      process.exit(1);
    }

    // Mask password in logs for security
    const maskedUri = connStr.replace(/\/\/(.*):(.*)@/, '//$1:****@');
    console.log(`Connecting to MongoDB Atlas at: ${maskedUri}`);

    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: Host ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DIAGNOSTIC GUIDE (DNS / Network Connectivity Error):');
      console.error('1. Check that your internet connection is active.');
      console.error('2. Ensure your MongoDB Atlas Cluster is online and active.');
      console.error('3. Ensure your current IP address is added to MongoDB Atlas Network Access (IP Whitelist).');
      console.error('4. If your network/ISP blocks DNS SRV lookup, whitelist Google DNS (8.8.8.8 / 1.1.1.1).\n');
    }
    
    console.error('Server execution stopped due to database connection error.');
    process.exit(1);
  }
};

module.exports = connectDB;

