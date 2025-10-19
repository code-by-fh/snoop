## 🧩 Creating a New Provider

Adding a new provider to **Snoop** is simple and fully modular.  
Follow these steps to integrate an additional real estate source.

---

### 1️⃣ Create a New Provider File

- Navigate to:  
  ```bash
  server/provider
  ```
- Create a new file, e.g.:
  ```bash
  newProvider.js
  ```

---

### 2️⃣ Implement the Provider

Each provider must export the following elements:

| Export | Description |
|--------|--------------|
| `config` | Provider configuration and normalization rules |
| `metaInformation` | Metadata such as name and base URL |
| `init(sourceConfig, blacklistTerms)` | Initializes the provider with configuration |
| `getListings()` | *(optional)* Fetches and returns listings |

**Example implementation:**

```javascript
import utils from '../utils/utils.js';

let appliedBlackList = [];

function normalize(o) {
  const id = parseInt(o.id.substring(o.id.indexOf('_') + 1, o.id.length));
  return Object.assign(o, { id });
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, appliedBlackList);
  const descNotBlacklisted = !utils.isOneOf(o.description, appliedBlackList);
  return titleNotBlacklisted && descNotBlacklisted;
}

const config = {
  url: null,
  //this is the container wrapping the search listings
  crawlContainer: '#result-list-stage .item',
  crawlFields: {
    id: '@id',
    price: 'div[id*="selPrice_"] | trim',
    size: 'div[id*="selArea_"] | trim',
    title: '.item a img@title',
    link: 'a[id*="lnkImgToDetails_"]@href',
    address: '.item .box-25 .ellipsis .text-100 | removeNewline | trim',
  },
  paginate: '#idResultList .margin-bottom-6.margin-bottom-sm-12 .panel a.pull-right@href',
  normalize: normalize,
  filter: applyBlacklist,
};

export const init = (sourceConfig, blacklistTerms) => {
  config.url = sourceConfig.url;
  appliedBlackList = blacklistTerms || [];
};

export const metaInformation = {
  name: "ProviderName",
  baseUrl: "https://www.new-provider.de",
  imageBaseUrl: "https://image.new-provider.de",
  id: "providerId",
};

export { config };

```

---

### 3️⃣ Add Provider to the Provider Map

All providers inside `server/provider` are automatically discovered and registered by  
`snoop` — **no manual import required**.

---

### 4️⃣ Create Provider Tests

All providers inside server/provider are automatically discovered and registered for testing.
No test file needed


### 5️⃣ Update Provider Configuration

Add your provider entry to `server/test/provider/testProvider.json`:

```json
{
  "newProvider": {
    "url": "https://api.newprovider.com/listings",
    "isActive": true
  }
}
```

---

### 6️⃣ Run Tests

Execute the full test suite to verify your provider:

```bash
cd server
npm test
```

---

## 🤝 Contributing

We welcome all contributions that make **Snoop** better!  
Follow the standard GitHub workflow:

```bash
# 1. Fork the repository
git fork https://github.com/code-by-fh/snoop.git

# 2. Create a new branch
git checkout -b feature/my-awesome-feature

# 3. Make your changes
git commit -m "feat(provider): add NewProvider integration"

# 4. Push to your fork
git push origin feature/my-awesome-feature

# 5. Open a Pull Request on GitHub 🚀
```

Please ensure:
- Code is formatted via **Prettier**
- All **tests pass** (`npm test`)
- New code follows **ESLint** rules and includes doc comments
