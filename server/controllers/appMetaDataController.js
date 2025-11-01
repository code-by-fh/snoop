import { appMetaData } from "#utils/env.js";

export const getAppMetaData = async (req, res) => {
    return res.status(200).json(appMetaData());

}