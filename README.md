# 🏠 Snoop – [S]earch & [N]avigate [O]ffers [O]n [P]latform

Snoop is a modern, full-featured platform that offers a seamless experience for property search, management, and analytics.
It is highly inspired by [Fredy](https://github.com/orangecoding/fredy), a well-known real estate crawler, but takes it a significant step further with a modern tech stack, improved usability, and extended functionality.

Snoop scrapes multiple services (Immonet, Immowelt etc.) and send new listings to you once they become available. The list of available services can easily be extended. For your convenience, Snoop has a UI to help you configure your search jobs.

If Snoop finds matching results, it will send them to you via Slack, Email, Telegram etc. (More adapters can be configured.) As Snoop stores the listings it has found, new results will not be sent to you twice (and as a side-effect, Snoop can show some statistics). Furthermore, Snoop checks duplicates per scraping so that the same listings are not being sent twice or more when posted on various platforms (which happens more often than one might think).

✨ What Sets Snoop Apart
- Revamped User Interface: Built with React, TypeScript, and TailwindCSS for a clean, responsive, and modern UI.

- Improved Database Integration: Enhanced data handling with MongoDB and Mongoose, supporting more scalable and dynamic interactions.

- Modular Provider System: Easily add or customize real estate providers with structured integration and automated testing.

- Full-Stack Architecture: Seamless frontend-backend communication via a RESTful API powered by Node.js and Express.

- Analytics Dashboard: Real-time insights with rich visualizations using Recharts.

Whether you're searching for properties or managing listings as a platform admin, Snoop delivers a robust, user-friendly solution tailored for modern real estate workflows.

## Features

### Core Features
- **Property Search**: Advanced search with filters and map integration
- **Dashboard**: Real-time analytics and property insights
- **User Management**: Secure authentication and role-based access
- **API Integration**: Robust backend with RESTful API
- **Responsive Design**: Optimized for all devices

### Technical Highlights
- **Frontend**: React with TypeScript and TailwindCSS
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based security
- **Testing**: Comprehensive test suite with Mocha and Chai

## Tech Stack

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Vite
- React Router
- Axios
- Recharts

### Backend
- Node.js
- Express
- Mongoose
- JWT
- Winston
- Puppeteer

### Development Tools
- ESLint
- Prettier
- Nodemon
- Mocha
- Chai

## Project Structure

```
fredy_rebrand/
├── client/                # React frontend
│   ├── public/            # Static assets
│   ├── src/               # Application source
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main application
│   └── package.json       # Frontend dependencies
│
├── server/                # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── server.js          # Server entry point
│   └── package.json       # Backend dependencies
│
├── .env.example           # Environment variables template
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore rules
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB 6+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Doublelayer/snoop.git
   ```

2. Install dependencies:
   ```bash
   cd snoop
   npm install
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update with your configuration

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Testing

Run the test suite:
```bash
cd server
npm test
```

## Creating a New Provider

To add a new provider to the platform, follow these steps:

1. **Create a New Provider File**:
   - Navigate to the `server/provider` directory.
   - Create a new JavaScript file, e.g., `newProvider.js`.

2. **Implement the Provider**:
   - The provider must export the following:
     - `config`: Configuration object for the provider.
     - `metaInformation`: Metadata about the provider.
     - `init`: Function to initialize the provider.
     - `getListings`: Function to fetch listings from the provider. (optional)

   Example:
   ```javascript
   import logger from '../utils/logger.js';

   const config = {
     url: null,
     crawlFields: {
       id: 'id',
       title: 'title',
       price: 'price',
       size: 'size',
       url: 'link',
       address: 'address',
       imageUrl: 'image',
     },
     normalize: (o) => {
       return {
         id: o.id,
         title: o.title,
         price: parseFloat(o.price),
         size: parseFloat(o.size),
         url: o.link,
         address: o.address,
         imageUrl: o.image,
       };
     },
     getListings: async () => { <== this method is optional
       const response = await fetch(config.url);
       if (!response.ok) {
         logger.error(`Error fetching data from New Provider: ${response.statusText}`);
         return [];
       }
       const data = await response.json();
       return data.listings;
     },
   };

   export const init = (sourceConfig, blacklistTerms) => {
     config.url = sourceConfig.url;
   };

   export const metaInformation = {
     name: 'New Provider',
     baseUrl: 'https://www.newprovider.com',
     id: 'newProvider',
   };

   export { config };
   ```

3. **Add Provider to Provider Map**:
   - The provider will be automatically loaded by the `server/provider/index.js` file.

4. **Test the Provider**:
   - Create a test file in `server/test/provider` to ensure the provider works as expected.
   - Example test file:
     ```javascript
     import { expect } from 'chai';
     import * as provider from '../../provider/newProvider.js';
     import { get } from '../mocks/mockNotification.js';
     import { logObject, mockSnoop, providerConfig } from '../utils.js';

     describe('#newProvider testsuite()', () => {
       provider.init(providerConfig.newProvider, [], []);

       it('should test new provider', async () => {
         const mockSnoop = await mockSnoop();
         const snoop = new Snoop(provider, null, "test-id", []);
         const listings = await snoop.execute();

         expect(listings).to.be.a('array');
         const notificationObj = get();
         logObject('Notification Object', notificationObj);

         expect(notificationObj).to.be.a('object');
         expect(notificationObj.serviceName).to.equal(provider.metaInformation.name);

         notificationObj.payload.forEach((notify) => {
           expect(notify.id).to.be.a('string');
           expect(notify.title).to.be.a('string');
           expect(notify.price).to.be.a('number');
           expect(notify.size).to.be.a('number');
           expect(notify.url).to.be.a('string');
           expect(notify.title).to.not.be.empty;
           expect(notify.url).to.include(provider.metaInformation.baseUrl);
         });
       });
     });
     ```

5. **Update Provider Configuration**:
   - Add the new provider configuration to `server/test/provider/testProvider.json`:
     ```json
     "newProvider": {
       "url": "https://api.newprovider.com/listings",
       "IsActive": true
     }
     ```

6. **Run Tests**:
   - Execute the test suite to verify the new provider:
     ```bash
     cd server
     npm test
     ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Maintainer - [Doublelayer]()

Project Link: [https://github.com/Doublelayer/snoop.git](https://github.com/Doublelayer/snoop.git)
