import { GlobalTesting } from "../global.service";

const StoredData = GlobalTesting();

function ServiceContainer() {
    // Lakukanlah Logika untuk Mengopreasikan Data ini disini untuk Fungsi ini
    const ServiceContainer1 = [] = [
        {
            id: StoredData.DataContainer1[0].id,
            name: StoredData.DataContainer1[0].name,
            description: StoredData.DataContainer1[0].description,
            date: StoredData.DataContainer1[0].date,
            status: StoredData.DataContainer1[0].status,
        }
    ]

    const ServiceContainer2= [] = [
        {
            id: StoredData.DataContainer2[0].id,
            name: StoredData.DataContainer2[0].name,
            description: StoredData.DataContainer2[0].description,
            date: StoredData.DataContainer2[0].date,
            status: StoredData.DataContainer2[0].status,
        }
    ]
return { ServiceContainer1, ServiceContainer2 };
}

export default ServiceContainer;