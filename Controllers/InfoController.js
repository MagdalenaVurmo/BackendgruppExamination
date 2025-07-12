import { fetchCompanyInfo } from "../Models/InfoModel.js";

//Hämta företaginfo
export const getCompanyInfo = async (req, res) => {
    try {
        const companyInfo = await fetchCompanyInfo();
        res.status(200).json(companyInfo)
    } catch (error) {
        console.error( 'Fel vid hämtning av företagsinfo: ', error);
        res.status(500).send('Fel vid hämtning av företagsinfo')
    }
};