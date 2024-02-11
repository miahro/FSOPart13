//const Sequelize = require('sequelize')
const { User } = require('../models')
//const { Blog } = require('../models')

async function seed() {
  try {
    await User.bulkCreate([
      { username: 'teukka@hotmail.com', name: 'Teuvo Hakkarainen' },
      { username: 'pave@hotmail.com', name: 'Paavo Väyrynen' },
    ])

    // await Blog.bulkCreate([
    //   {
    //     author: 'Matias Mäkynen',
    //     url: 'www.google.com',
    //     title: 'viikset on kivat',
    //     likes: 1,
    //     year: 2022,
    //     userId: 1
    //   },
    //   {
    //     author: 'Paavo Väyrynen',
    //     url: 'www.google.com',
    //     title: 'viikset on huonot',
    //     likes: 10,
    //     year: 1975,
    //     userId: 2
    //   }
    // ])
    console.log('Seed data inserted successfully.')
  } catch (error) {
    console.error('Error inserting seed data:', error)
  }
}

// Run the seeder function
seed()
