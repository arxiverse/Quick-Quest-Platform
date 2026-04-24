import ServiceContainer from "./test.service";
const ContainerData = ServiceContainer();
// Logika Memproses Data

function LogicContainer1() {
    // Proseslah Data disini
    return ContainerData.ServiceContainer1;
}

function LogicContainer2() {
    return ContainerData.ServiceContainer2;
}

export {LogicContainer1, LogicContainer2};
