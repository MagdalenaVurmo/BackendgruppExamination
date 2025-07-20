import { fetchCompanyInfo } from "../Models/InfoModel.js";

//Hämta företaginfo
// Denna funktion hämtar företagsinformation från databasen och skickar den som JSON-svar.
// req: request-objektet från klienten (t.ex. webbläsare).
// res: response-objektet som används för att skicka ett svar tillbaka till klienten.
// Funktionen används som en route handler i Express – t.ex. i en GET /company-rutt.
export const getCompanyInfo = async (req, res) => {
    try {        // Startar ett try/catch-block för att hantera eventuella fel.
        const companyInfo = await fetchCompanyInfo(); // Anropar funktionen fetchCompanyInfo från InfoModel.js för att hämta företagsinformationen.
        // Om fetchCompanyInfo lyckas, kommer companyInfo att innehålla den hämtade informationen.
        
        res.status(200).json(companyInfo)     // Skickar tillbaka det hämtade svaret till klienten som ett JSON-objekt med HTTP-statuskoden 200 
                                            // Om det inte finns någon info i databasen, skickas en tom array.     

    } catch (error) {  // Fångar alla fel som kan uppstå i try-blocket, t.ex. om fetchCompanyInfo() misslyckas.
        console.error( 'Fel vid hämtning av företagsinfo: ', error);
        res.status(500).send('Fel vid hämtning av företagsinfo')
        // Den här skickar tillbaka ett felmeddelande till klienten med HTTP-statuskoden 500 (ett internt serverfel).
    }
};