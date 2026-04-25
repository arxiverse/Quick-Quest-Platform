import ContainerService from "./test.service";

function Instance1() {

    const Container1 = ContainerService().ContainerService1;

    const CPU = (data: any[]) => {
        return data.map(x => ({
            ...x,
            computedAt: Date.now()
        }));
    };

    let RAM = {
        lastFetch: null as number | null
    };

    const Disk = {
        save: (key: string, value: any) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        load: (key: string) => {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }
    };

    RAM.lastFetch = Date.now();
    const processed = CPU(Container1);
    Disk.save("instance1-cache", processed);
    return {
        data: processed,
        RAM
    };
}

function Instance2() {
    const Container2 = ContainerService().ContainerService2;

    const CPU = (data: any[]) => {
        return data.map(x => ({
            ...x,
            computedAt: Date.now()
        }));
    };

    let RAM = {
        lastFetch: null as number | null
    };

    const Disk = {
        save: (key: string, value: any) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        load: (key: string) => {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        }
    };

    RAM.lastFetch = Date.now();
    const processed = CPU(Container2);
    Disk.save("instance2-cache", processed);
    return {
        data: processed,
        RAM
    };
}

export { Instance1, Instance2 };
