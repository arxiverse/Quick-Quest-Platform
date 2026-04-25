import { Container } from "../global.service";

function ContainerService() {
    const ContainerService1 = Container().Container1;
    const ContainerService2 = Container().Container2;

    return { ContainerService1, ContainerService2 };
}

export default ContainerService;