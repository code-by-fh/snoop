import { getAvailableProviders } from "../provider/index.js";

export const getProviders = async (req, res) => {
    const providers = getAvailableProviders();
    res.status(200).json(Object.values(providers).map(source => source.metaInformation));
}