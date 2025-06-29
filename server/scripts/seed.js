const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Temple = require('../models/Temple');
const Event = require('../models/Event');
const Expense = require('../models/Expense');
const ThevaramPathigam = require('../models/ThevaramPathigam');
const Instrument = require('../models/Instrument');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/isai-thondar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Temple.deleteMany({});
    await Event.deleteMany({});
    await Expense.deleteMany({});
    await ThevaramPathigam.deleteMany({});
    await Instrument.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create Users
    const users = await User.create([
      {
        name: 'Ravi Kumar',
        email: 'admin@isai.com',
        password: 'password',
        role: 'admin',
        phone: '+91 98765 43210',
        status: 'active'
      },
      {
        name: 'Priya Devi',
        email: 'organizer@isai.com',
        password: 'password',
        role: 'organizer',
        phone: '+91 98765 43211',
        status: 'active'
      },
      {
        name: 'Murugan Bala',
        email: 'member@isai.com',
        password: 'password',
        role: 'member',
        phone: '+91 98765 43212',
        status: 'active'
      },
      {
        name: 'Lakshmi Priya',
        email: 'guest@isai.com',
        password: 'password',
        role: 'guest',
        phone: '+91 98765 43213',
        status: 'active'
      }
    ]);

    console.log('👥 Created users');

    // Create Temples
    const temples = await Temple.create([
      {
        name: 'Kapaleeshwarar Temple',
        description: 'Ancient Shiva temple dedicated to Lord Kapaleeshwarar',
        location: {
          address: 'Kapaleeshwarar Sannadhi Street',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          pincode: '600004',
          coordinates: {
            latitude: 13.0338,
            longitude: 80.2619
          }
        },
        contact: {
          phone: '+91 44 2464 1670',
          email: 'info@kapaleeshwarar.org'
        },
        deity: {
          primary: 'Lord Shiva',
          secondary: ['Goddess Karpagambal']
        },
        established: '7th Century CE',
        status: 'active',
        isVerified: true,
        createdBy: users[0]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date()
      },
      {
        name: 'Parthasarathy Temple',
        description: 'Historic Vishnu temple with beautiful architecture',
        location: {
          address: 'Triplicane High Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          pincode: '600005',
          coordinates: {
            latitude: 13.0732,
            longitude: 80.2609
          }
        },
        contact: {
          phone: '+91 44 2844 0232'
        },
        deity: {
          primary: 'Lord Krishna',
          secondary: ['Lord Rama', 'Lord Narasimha']
        },
        established: '8th Century CE',
        status: 'active',
        isVerified: true,
        createdBy: users[0]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date()
      },
      {
        name: 'Vadapalani Murugan Temple',
        description: 'Popular Murugan temple known for its festivals',
        location: {
          address: 'Vadapalani',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          pincode: '600026',
          coordinates: {
            latitude: 13.0501,
            longitude: 80.2060
          }
        },
        contact: {
          phone: '+91 44 2480 4728'
        },
        deity: {
          primary: 'Lord Murugan'
        },
        established: '1890',
        status: 'active',
        isVerified: true,
        createdBy: users[0]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date()
      }
    ]);

    console.log('🏛️  Created temples');

    // Update users with temple references
    await User.findByIdAndUpdate(users[0]._id, { temple: temples[0]._id });
    await User.findByIdAndUpdate(users[1]._id, { temple: temples[1]._id });
    await User.findByIdAndUpdate(users[2]._id, { temple: temples[2]._id });
    await User.findByIdAndUpdate(users[3]._id, { temple: temples[0]._id });

    // Create Thevaram Pathigams
    const pathigams = await ThevaramPathigam.create([
      {
        title: 'Thiruvasagam - First Pathigam',
        titleTamil: 'திருவாசகம் - முதல் பதிகம்',
        content: 'Love is the form of God, the world is love, love is God...',
        contentTamil: 'அன்பே சிவமயம் உலகம் அன்பே சிவம்...',
        transliteration: 'Anbae sivamayam ulakam anbae sivam...',
        guru: 'Manikkavacakar',
        category: 'thevaram',
        tags: ['devotional', 'shiva', 'love'],
        status: 'published',
        createdBy: users[0]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date()
      },
      {
        title: 'Thevaram - Sambandar Pathigam',
        titleTamil: 'தேவாரம் - சம்பந்தர் பதிகம்',
        content: 'The one with matted hair...',
        contentTamil: 'தொடுடைய செவியன்...',
        transliteration: 'Thodudaya seivian...',
        guru: 'Thirugnana Sambandar',
        category: 'thevaram',
        tags: ['classical', 'temple', 'shiva'],
        status: 'published',
        createdBy: users[1]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date()
      }
    ]);

    console.log('📖 Created Thevaram pathigams');

    // Create Instruments
    const instruments = await Instrument.create([
      {
        name: 'Mridangam',
        nameTamil: 'மிருதங்கம்',
        category: 'Percussion',
        description: 'Traditional South Indian double-headed drum',
        origin: {
          region: 'South India',
          country: 'India'
        },
        materials: ['Jackfruit wood', 'Goat skin', 'Buffalo skin'],
        musicalContext: {
          genres: ['Carnatic', 'Devotional'],
          ensembleRole: 'Primary rhythm instrument'
        },
        playingTechnique: {
          difficulty: 'advanced',
          method: 'Hand percussion'
        },
        status: 'active',
        isVerified: true,
        createdBy: users[0]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date(),
        tags: ['percussion', 'carnatic', 'traditional']
      },
      {
        name: 'Violin',
        category: 'String',
        description: 'Bowed string instrument adapted for Carnatic music',
        origin: {
          region: 'Europe (adapted for Indian music)',
          country: 'India'
        },
        materials: ['Wood', 'Steel strings'],
        musicalContext: {
          genres: ['Carnatic', 'Classical'],
          ensembleRole: 'Melodic accompaniment'
        },
        playingTechnique: {
          difficulty: 'intermediate',
          method: 'Bowed strings'
        },
        status: 'active',
        isVerified: true,
        createdBy: users[0]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date(),
        tags: ['string', 'carnatic', 'melodic']
      },
      {
        name: 'Veena',
        nameTamil: 'வீணை',
        category: 'String',
        description: 'Ancient plucked string instrument',
        origin: {
          region: 'South India',
          country: 'India'
        },
        materials: ['Jackfruit wood', 'Bronze strings'],
        musicalContext: {
          genres: ['Carnatic', 'Classical', 'Devotional'],
          ensembleRole: 'Solo melodic instrument'
        },
        playingTechnique: {
          difficulty: 'expert',
          method: 'Plucked strings'
        },
        status: 'active',
        isVerified: true,
        createdBy: users[0]._id,
        verifiedBy: users[0]._id,
        verifiedAt: new Date(),
        tags: ['string', 'carnatic', 'classical', 'solo']
      }
    ]);

    console.log('🎵 Created instruments');

    // Create Events
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);
    
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 14);

    const events = await Event.create([
      {
        name: 'Shivaratri Celebration',
        description: 'Annual Shivaratri celebration with traditional music and dance',
        location: 'Kapaleeshwarar Temple, Mylapore',
        locationUrl: 'https://maps.google.com/kapaleeshwarar',
        temple: temples[0]._id,
        date: futureDate1,
        time: '18:00',
        membersNeeded: 12,
        instruments: ['Mridangam', 'Violin', 'Veena', 'Flute'],
        foodRequired: true,
        foodType: 'Prasadam',
        notes: 'Traditional attire required. Bring your own water bottle.',
        guru: 'Thirugnana Sambandar',
        thevaramPathigam: [pathigams[0]._id, pathigams[1]._id],
        createdBy: users[1]._id,
        status: 'upcoming',
        tags: ['festival', 'shivaratri', 'traditional']
      },
      {
        name: 'Karthik Deepam',
        description: 'Karthik Deepam festival celebration',
        location: 'Parthasarathy Temple, Triplicane',
        temple: temples[1]._id,
        date: futureDate2,
        time: '17:30',
        membersNeeded: 8,
        instruments: ['Thavil', 'Nadaswaram'],
        foodRequired: false,
        guru: 'Appar',
        thevaramPathigam: [pathigams[1]._id],
        createdBy: users[1]._id,
        status: 'upcoming',
        tags: ['festival', 'karthik', 'deepam']
      }
    ]);

    console.log('📅 Created events');

    // Add members to events
    await events[0].addMember(users[1]._id, 'organizer');
    await events[0].addMember(users[2]._id, 'participant');
    
    await events[1].addMember(users[1]._id, 'organizer');
    await events[1].addMember(users[3]._id, 'participant');

    // Create Expenses
    await Expense.create([
      {
        event: events[0]._id,
        type: 'Food & Catering',
        amount: 5000,
        paidBy: users[1]._id,
        description: 'Prasadam for 50 people',
        date: new Date(),
        status: 'approved',
        approvedBy: users[0]._id,
        approvedAt: new Date()
      },
      {
        event: events[0]._id,
        type: 'Transportation',
        amount: 2000,
        paidBy: users[2]._id,
        description: 'Bus rental for group travel',
        date: new Date(),
        reimbursed: true,
        reimbursedBy: users[0]._id,
        reimbursedAt: new Date(),
        status: 'reimbursed'
      },
      {
        event: events[1]._id,
        type: 'Sound System',
        amount: 3000,
        paidBy: users[1]._id,
        description: 'Audio equipment rental',
        date: new Date(),
        status: 'pending'
      }
    ]);

    console.log('💰 Created expenses');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏛️  Temples: ${temples.length}`);
    console.log(`📖 Pathigams: ${pathigams.length}`);
    console.log(`🎵 Instruments: ${instruments.length}`);
    console.log(`📅 Events: ${events.length}`);
    console.log(`💰 Expenses: 3`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@isai.com / password');
    console.log('Organizer: organizer@isai.com / password');
    console.log('Member: member@isai.com / password');
    console.log('Guest: guest@isai.com / password');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();