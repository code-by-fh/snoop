import { getAvailableProviders } from '../../provider/index.js';

const providersMap = getAvailableProviders();

const providerUrls = {
  einsAImmobilien: "https://www.1a-immobilienmarkt.de/suchen/berlin/wohnung-mieten.html?search=yes&data_hash=1488744fcb9f1b9e2bdbc48625ef2133",
  immobilienDe: "https://www.immobilien.de/Wohnen/Suchergebnisse-51797.html?search._digest=true&search._filter=wohnen&search.wo=city%3A6444",
  immonet: "https://www.immonet.de/classified-search?distributionTypes=Rent&estateTypes=House,Apartment&locations=AD08DE8634&order=Default&m=homepage_new_search_classified_search_result",
  immoscout: "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten",
  immoswp: "https://immo.swp.de/suchergebnisse?l=Berlin&t=all%3Arental%3Aliving&a=de.berlin",
  immowelt: "https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=House,Apartment&locations=AD08DE8634&order=DateDesc",
  kleinanzeigen: "https://www.kleinanzeigen.de/s-wohnung-mieten/berlin/c203l3331",
  neubauKompass: "https://www.neubaukompass.de/neubau-immobilien/berlin/",
  ohneMakler: "https://www.ohne-makler.net/immobilien/immobilie-mieten/berlin/berlin/",
  wgGesucht: "https://www.wg-gesucht.de/wohnungen-in-Berlin.8.2.1.0.html",
  wohnungsboerse: "https://www.wohnungsboerse.net/searches/index?estate_marketing_types=miete%2C1&marketing_type=miete&estate_types%5B0%5D=1&is_rendite=0&estate_id=&zipcodes%5B%5D=&cities%5B%5D=Berlin&districts%5B%5D=&term=Berlin&umkreiskm=&pricetext=&minprice=&maxprice=&sizetext=&minsize=&maxsize=&roomstext=&minrooms=&maxrooms=",
  regionalimmobilien24: "https://www.regionalimmobilien24.de/rostock/rostock/kaufen/haus/-/-/-/?rd=5",
  sparkasse: "https://immobilien.sparkasse.de/immobilien/treffer?marketingType=buy&objectType=flat&perimeter=10&usageType=residential&zipCityEstateId=62782__Hamburg",
  mcMakler: "https://www.mcmakler.de/immobilien/results?placeId=62649&search=Leipzig%252C+Sachsen&propertyTypes=APARTMENT&page=0"
};

const dynamicProvidersConfig = Object.values(providersMap).map(provider => {
  const { id, name } = provider.metaInformation;
  return {
    id,
    name,
    url: providerUrls[id] || null,
  };
});

export const SEED_CONFIG = {
  users: 5,
  jobsPerUser: 5,
  listingsPerJob: 50,
  providersConfig: dynamicProvidersConfig
};
